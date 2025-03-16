import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { type FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

import { useUpdateTask } from "../api";
import type { ITask } from "../types/common";
import DueDatePicker from "./DueDatePicker";

export default function QuickEditTaskIcon({ task }: { task: ITask }) {
  const [open, setOpen] = useState(false);

  // Function to handle form submission
  const handleClick = (event: FormEvent) => {
    event.preventDefault();
    setOpen(true);
  };

  const updateTask = useUpdateTask(task);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
              defaultValue={
                task.due_date ? dayjs(task.due_date).toDate() : undefined
              }
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
