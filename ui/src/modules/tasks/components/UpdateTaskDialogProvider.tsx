import UpdateTaskDialogContext from "@shared/contexts/updateTaskDialogContext";
import { useTask } from "@shared/hooks/queries";
import { Task } from "@shared/types/common";
import { PropsWithChildren, useState } from "react";

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
