import { useState } from "react";
import Button from "@mui/material/Button";
import TaskForm from "./TaskForm";
import AddIcon from "@mui/icons-material/Add";

export default function AddTodoButton({ dueDate }: { dueDate?: Date }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {open ? (
        <TaskForm dueDate={dueDate} handleClose={() => setOpen(false)} />
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          color="primary"
          aria-label="add"
        >
          Add Task
        </Button>
      )}
    </>
  );
}
