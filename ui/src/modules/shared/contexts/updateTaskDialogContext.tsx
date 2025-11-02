import { createContext } from "react";

import { Task } from "../../../api/migration-helpers";

export interface UpdateTaskDialogContextType {
  setTask: (task: Task) => void;
}

const UpdateTaskDialogContext =
  createContext<UpdateTaskDialogContextType | null>(null);

export default UpdateTaskDialogContext;
