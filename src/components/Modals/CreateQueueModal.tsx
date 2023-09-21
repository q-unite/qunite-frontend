import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Modal, P } from "../UI";
import APIClient from "../../services/api-client";
import { Queue } from "../../interfaces/Queue";
import useQueuesStore from "../../stores/queues-store";
import useMyQueuesStore from "../../stores/my-queues-store";
import { Form } from "./components/Form";

interface ErrorResponse {
  name: string;
}

interface Props {
  isShown: boolean;
  setIsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const apiClient = new APIClient<Queue>("/queues");

export const CreateQueueModal = ({
  isShown,
  setIsShown,
}: Props): JSX.Element => {
  const [text, setText] = useState("");
  const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
  const addToQueues = useQueuesStore((q) => q.addToQueues);
  const addToMyQueues = useMyQueuesStore((q) => q.addToMyQueues);
  const navigate = useNavigate();

  const onSubmitHandler = (): void => {
    apiClient
      .post({ data: { params: { name: text } } })
      .then((res) => {
        setError(null);
        setIsShown(false);
        addToQueues(res);
        addToMyQueues(res);
        navigate(`/queues/${res.id}`);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => setText(""));
  };

  return (
    <Modal
      isShown={isShown}
      setIsShown={setIsShown}
      title="Create queue"
      successButtonText="Create"
      successButtonClick={onSubmitHandler}
      dangerButtonText="Cancel"
      dangerButtonClick={() => {
        setText("");
        setError(null);
        setIsShown(false);
      }}
    >
      <Form
        onSubmitHandler={onSubmitHandler}
        placeholder="Type queue name"
        setText={setText}
        text={text}
      />
      {error && (
        <P color="primary" style={{ marginTop: "15px" }}>
          {error.response?.data.name}
        </P>
      )}
    </Modal>
  );
};
