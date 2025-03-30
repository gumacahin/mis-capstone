import { PropsWithChildren, useState } from "react";

import UpdateTaskDialogContext from "../contexts/updateTaskDialogContext";
import { useTask } from "../hooks/queries";
import { Task } from "../types/common";
import UpdateTaskDialog from "./UpdateTaskDialog";

export default function UpdateTaskDialogProvider({
  children,
}: PropsWithChildren) {
  const [initialTask, setTask] = useState<Task | null>(null);
  const { data: task } = useTask(initialTask, !!initialTask);
  return (
    <>
      {task && <UpdateTaskDialog task={task} onClose={() => setTask(null)} />}
      <UpdateTaskDialogContext.Provider value={{ setTask }}>
        {children}
      </UpdateTaskDialogContext.Provider>
    </>
  );
}
