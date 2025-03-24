import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Dayjs } from "dayjs";

import TaskForm from "./TaskForm";

export type FormValues = {
  title: string;
  description: string | null;
  due_date: Dayjs | null;
  section: number | null;
};

export default function AddTaskDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <TaskForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
