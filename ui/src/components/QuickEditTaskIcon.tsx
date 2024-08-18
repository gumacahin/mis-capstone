import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";

import DueDatePicker from "./DueDatePicker";

import { Task } from "../types/common";
import dayjs from "dayjs";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useUpdateTask } from "../api";
import { toast } from "react-hot-toast";

export default function QuickEditTaskIcon({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  // Function to handle form submission
  const handleClick = (event: React.FormEvent) => {
    event.preventDefault();
    setOpen(true);
  };

  const updateTask = useUpdateTask(task);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedTask = Object.fromEntries(
      formData.entries(),
    ) as unknown as Task;
    toast.promise(updateTask.mutateAsync(updatedTask), {
      loading: "Updating task...",
      success: "Task updated successfully!",
      error: "Error updating task.",
    });
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} aria-label="Quick edit task">
        <EditOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Update Task</DialogTitle>
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
              defaultValue={task.title}
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
              defaultValue={task.note}
            />
            <DueDatePicker
              name="due_date"
              label="Due Date"
              defaultValue={task.due_date ? dayjs(task.due_date) : null}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Update Task</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
