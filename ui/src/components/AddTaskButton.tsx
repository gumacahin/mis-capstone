import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Dayjs } from "dayjs";
import { useState } from "react";

import TaskForm from "./TaskForm";

export interface AddTaskButtonProps {
  presetDueDate?: Dayjs;
  presetLabel?: string;
}

export default function AddTaskButton({
  presetDueDate,
  presetLabel,
}: AddTaskButtonProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {open ? (
        <TaskForm
          presetDueDate={presetDueDate}
          presetLabel={presetLabel}
          handleClose={() => {
            setOpen(false);
          }}
        />
      ) : (
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            setOpen(true);
          }}
          color="primary"
          aria-label="add"
        >
          Add Task
        </Button>
      )}
    </>
  );
}
