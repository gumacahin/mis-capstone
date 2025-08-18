import { useContext } from "react";

import UpdateTaskDialogContext, {
  type UpdateTaskDialogContextType,
} from "../contexts/updateTaskDialogContext";

export default function useUpdateTaskDialogContext(): UpdateTaskDialogContextType {
  const context = useContext(UpdateTaskDialogContext);
  if (!context) {
    throw new Error(
      "useUpdateTaskDialogContext must be used within a UpdateTaskDialogProvider",
    );
  }
  return context;
}
