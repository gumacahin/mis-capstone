import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
import { MouseEvent } from "react";
import toast from "react-hot-toast";

import { useTask, useUpdateTask } from "../api";
import type { ITask } from "../types/common";

export default function TaskCheckIcon({
  task,
  disabled,
}: {
  task: ITask;
  disabled?: boolean;
}) {
  const updateTask = useUpdateTask(task);
  const { isPending, isError, data } = useTask(task);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedTask: ITask = {
      ...data,
      completed: !data.completed,
      completed_date: data.completed ? "" : dayjs().format("YYYY-MM-DD"),
    };
    toast.promise(updateTask.mutateAsync(updatedTask), {
      loading: "Updating task...",
      success: "Task updated successfully!",
      error: "Error updating task.",
    });
  };

  if (isPending) {
    return (
      <IconButton sx={{ cursor: "not-allowed" }}>
        <Skeleton variant="circular" width={24} height={24} />
      </IconButton>
    );
  }

  if (isError) {
    return (
      <IconButton sx={{ cursor: "not-allowed" }}>
        <ErrorOutlineIcon />
      </IconButton>
    );
  }

  if (disabled) {
    return (
      <IconButton sx={{ cursor: "not-allowed" }}>
        {data.completed ? (
          <CheckCircleOutlineOutlinedIcon />
        ) : (
          <CircleOutlinedIcon />
        )}
      </IconButton>
    );
  }

  return (
    <IconButton onClick={handleClick}>
      {data.completed ? (
        <CheckCircleOutlineOutlinedIcon />
      ) : (
        <CircleOutlinedIcon />
      )}
    </IconButton>
  );
}
