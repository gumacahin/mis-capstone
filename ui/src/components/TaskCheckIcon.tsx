import IconButton from "@mui/material/IconButton";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Task } from "../types/common";
import { useUpdateTask, useTask } from "../api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import Skeleton from "@mui/material/Skeleton";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function TaskCheckIcon({
  task,
  disabled,
}: {
  task: Task;
  disabled?: boolean;
}) {
  const updateTask = useUpdateTask(task);
  const { isPending, isError, data } = useTask(task);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const updatedTask: Task = {
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
