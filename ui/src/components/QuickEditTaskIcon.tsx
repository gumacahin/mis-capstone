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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiClient from "../apiClient";
import { Task } from "../types/common";
import dayjs from "dayjs";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useUpdateTask } from "../api";

export default function QuickEditTaskIcon({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  const [dueDate, setDueDate] = useState(
    task.due_date ? dayjs(task.due_date).format("YYYY-MM-DD") : undefined,
  );

  // Function to handle date change
  const handleDateChange = (date) => {
    setDueDate(date.format("YYYY-MM-DD"));
  };

  // Function to handle form submission
  const handleClick = (event: React.FormEvent) => {
    event.preventDefault();
    setOpen(true);
  };

  const mutation = useUpdateTask(task);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries((formData as any).entries()) as Task;
    newTask.due_date = dueDate;
    mutation.mutate(newTask);
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
              id="due_date"
              name="due_date"
              label="Due Date"
              onChange={handleDateChange}
              defaultValue={task.due_date ? dayjs(task.due_date) : undefined}
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
