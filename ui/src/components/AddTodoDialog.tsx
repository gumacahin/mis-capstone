import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import DueDatePicker from "./DueDatePicker";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiClient from "../apiClient";
import { Task } from "../types/common";
import dayjs from "dayjs";

export default function AddTodoDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const [dueDate, setDueDate] = useState<Date | null>(null);

  // Function to handle date change
  const handleDateChange = (event) => {
    setDueDate(event.format("YYYY-MM-DD"));
  };

  // // Function to handle form submission
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   // Assuming you have other form data to collect, include dueDate in your submission logic
  //   const formData = {
  //     // other form data...
  //     dueDate: dueDate,
  //   };
  //   console.log(formData); // Replace this with your actual form submission logic
  //   // Submit formData to your backend or state management
  // };

  const mutation = useMutation({
    mutationKey: ["addTask"],
    mutationFn: async (newTask: Task) => {
      const result = await apiClient.post("/tasks/", newTask);
      return result.data;
    },
    // TODO: optimistic update
    // onMutate: async (newTask: Task) => {
    //     // Cancel any outgoing refetches
    //     // (so they don't overwrite our optimistic update)
    //     await queryClient.cancelQueries({ queryKey: ['tasks'] })

    //     // Snapshot the previous value
    //     const previousTodos = queryClient.getQueryData(['tasks'])

    //     // Optimistically update to the new value
    //     queryClient.setQueryData(['tasks'], (old: Task[]) => [newTask, ...old])

    //     return { previousTodos }

    // },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    // onError: (_, __, context: {previousTodos: Task[];}) => {
    //     queryClient.setQueryData(['tasks'], context.previousTodos)
    // },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask = Object.fromEntries((formData as any).entries()) as Task;
    newTask.due_date = dueDate
      ? dayjs(dueDate).format("YYYY-MM-DD")
      : undefined;
    void mutation.mutate(newTask);
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
            id="due_date"
            name="due_date"
            label="Due Date"
            onChange={handleDateChange}
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
