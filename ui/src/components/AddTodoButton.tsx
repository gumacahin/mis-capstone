import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useState } from "react";

import TaskForm from "./TaskForm";

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
