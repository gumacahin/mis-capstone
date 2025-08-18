import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import IconButton from "@mui/material/IconButton";
import { useUpdateTask } from "@shared/hooks/queries";
import type { Task } from "@shared/types/common";
import dayjs from "dayjs";
import { MouseEvent } from "react";
import toast from "react-hot-toast";

export default function TaskCheckIcon({
  task,
  disabled,
}: {
  task: Task;
  disabled?: boolean;
}) {
  const priorityColorMap: Record<
    "NONE" | "LOW" | "MEDIUM" | "HIGH",
    "inherit" | "info" | "warning" | "error"
  > = {
    NONE: "inherit",
    LOW: "info",
    MEDIUM: "warning",
    HIGH: "error",
  };

  const updateTask = useUpdateTask(task);

  const isTaskCompleted = task.completion_date !== null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const data = {
      completion_date: isTaskCompleted ? null : dayjs(),
    };
    toast.promise(updateTask.mutateAsync(data), {
      loading: "Updating task...",
      success: "Task updated successfully!",
      error: "Error updating task.",
    });
  };

  if (disabled) {
    return (
      <IconButton
        sx={[{ cursor: "not-allowed" }, { ".MuiButton-root": { padding: 0 } }]}
      >
        {isTaskCompleted ? (
          <CheckCircleOutlineOutlinedIcon />
        ) : (
          <CircleOutlinedIcon />
        )}
      </IconButton>
    );
  }

  return (
    <IconButton onClick={handleClick}>
      {isTaskCompleted ? (
        <CheckCircleOutlineOutlinedIcon />
      ) : (
        <CircleOutlinedIcon color={priorityColorMap[task.priority ?? "NONE"]} />
      )}
    </IconButton>
  );
}
