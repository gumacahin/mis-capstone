import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Dayjs } from "dayjs";
// import type { FormEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAddTask } from "../api";
import type { ITask } from "../types/common";
import DueDatePicker from "./DueDatePicker";

export type FormValues = {
  title: string;
  description: string | null;
  due_date: Dayjs | null;
  section: number | null;
};

export default function AddTodoDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const addTask = useAddTask();

  const { control, register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      due_date: null,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
    const data: ITask = {
      title: formValues.title,
      description: formValues.description,
      due_date:
        formValues.due_date != null
          ? formValues.due_date.format("YYYY-MM-DD")
          : null,
    };
    // return;
    toast.promise(addTask.mutateAsync(data), {
      loading: "Adding task...",
      success: "Task added successfully!",
      error: "Error adding task.",
    });
    handleClose();
  };

  const dueDate = watch("due_date");

  return (
    <Dialog
      open={open}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(onSubmit),
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
            label="Task name"
            type="text"
            fullWidth
            variant="standard"
            {...register("title")}
          />
          <TextField
            multiline
            margin="dense"
            id="desciption"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            {...register("description")}
          />
          <DueDatePicker control={control} dueDate={dueDate} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Add Task</Button>
      </DialogActions>
    </Dialog>
  );
}
