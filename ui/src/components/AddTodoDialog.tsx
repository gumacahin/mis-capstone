import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import DueDatePicker from "./DueDatePicker";

import { toast } from "react-hot-toast";
import { Task } from "../types/common";
import { useAddTask } from "../api";

export default function AddTodoDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const addTask = useAddTask();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries(formData.entries()) as unknown as Task;
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
      }}
    >
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            autoFocus
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
