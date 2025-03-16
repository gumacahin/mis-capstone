import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { FormEvent } from "react";
import { toast } from "react-hot-toast";

import { useAddTask } from "../api";
import type { ITask } from "../types/common";
import DueDatePicker from "./DueDatePicker";

export default function AddTodoDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const addTask = useAddTask();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries(formData.entries()) as unknown as ITask;
    toast.promise(addTask.mutateAsync(newTask), {
      loading: "Adding task...",
      success: "Task added successfully!",
      error: "Error adding task.",
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { minWidth: { xs: "100vw", sm: 600 } },
      }}
    >
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            required
            margin="dense"
            id="title"
            name="title"
            label="Task name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            multiline
            margin="dense"
            id="desciption"
            name="note"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
          />
          <DueDatePicker
            name="due_date"
            label="Due Date"
            // onChange={handleDateChange}
            // value={dueDate}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Add Task</Button>
      </DialogActions>
    </Dialog>
  );
}
