import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Dayjs } from "dayjs";
import { useState } from "react";

import TaskForm from "./TaskForm";

export default function AddTaskButton({
  presetDueDate = null,
  sectionId,
  projectId,
}: {
  presetDueDate?: Dayjs | null;
  sectionId?: number;
  projectId: number;
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {open ? (
        <TaskForm
          presetDueDate={presetDueDate}
          sectionId={sectionId}
          projectId={projectId}
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
