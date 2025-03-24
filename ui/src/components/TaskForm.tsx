import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { Dayjs } from "dayjs";
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

export default function TaskForm({
  presetDueDate = null,
  task,
  sectionId,
  projectId,
  handleClose,
}: {
  presetDueDate?: Dayjs | null;
  task?: ITask;
  handleClose: () => void;
  sectionId?: number;
  projectId?: number;
}) {
  console.log("projectId", projectId, typeof projectId);
  const addTask = useAddTask(projectId);

  // TODO: add updating of tasks
  console.log("task", task);

  const { control, register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      due_date: presetDueDate,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formValues) => {
    const data: ITask = {
      title: formValues.title,
      description: formValues.description,
      section: sectionId,
      due_date:
        formValues.due_date != null
          ? formValues.due_date.format("YYYY-MM-DD")
          : null,
    };
    toast.promise(addTask.mutateAsync(data), {
      loading: "Adding task...",
      success: "Task added successfully!",
      error: "Error adding task.",
    });
    handleClose();
  };

  const dueDate = watch("due_date");
  return (
    <Stack
      spacing={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: "100%" }}
    >
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
      <Box display="flex" justifyContent={"flex-end"}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="outlined">
          Save
        </Button>
      </Box>
    </Stack>
  );
}
