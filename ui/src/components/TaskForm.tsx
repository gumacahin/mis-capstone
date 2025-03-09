import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { toast } from "react-hot-toast";

import { useAddTask } from "../api";
import { Task } from "../types/common";
import DueDatePicker from "./DueDatePicker";

export default function TaskForm({
  dueDate,
  task,
  handleClose,
}: {
  dueDate?: Date;
  task?: Task;
  handleClose: () => void;
}) {
  const addTask = useAddTask();
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
    <Stack
      spacing={2}
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: "100%" }}
    >
      <TextField
        required
        margin="dense"
        id="title"
        name="title"
        label="Task name"
        type="text"
        fullWidth
        variant="standard"
        value={task?.title}
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
        value={task?.note}
      />
      <DueDatePicker defaultValue={dueDate} />
      <Box display="flex" justifyContent={"flex-end"}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="outlined">
          Save
        </Button>
      </Box>
    </Stack>
  );
}
