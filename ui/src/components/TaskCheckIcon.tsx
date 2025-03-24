import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import dayjs from "dayjs";
import { MouseEvent } from "react";
import toast from "react-hot-toast";

import { useUpdateTask } from "../api";
import type { ITask } from "../types/common";

export default function TaskCheckIcon({
  task,
  projectId,
  disabled,
}: {
  task: ITask;
  disabled?: boolean;
  projectId: number;
}) {
  const updateTask = useUpdateTask(task, projectId);

  const isTaskCompleted = task.completion_date !== null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const data: Pick<ITask, "completion_date"> = {
      completion_date: isTaskCompleted ? null : dayjs().format("YYYY-MM-DD"),
    };
    toast.promise(updateTask.mutateAsync(data), {
      loading: "Updating task...",
      success: "Task updated successfully!",
      error: "Error updating task.",
    });
  };

  // if (isPending) {
  //   return (
  //     <IconButton sx={{ cursor: "not-allowed" }}>
  //       <Skeleton variant="circular" width={24} height={24} />
  //     </IconButton>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <IconButton sx={{ cursor: "not-allowed" }}>
  //       <ErrorOutlineIcon />
  //     </IconButton>
  //   );
  // }

  if (disabled) {
    return (
      <IconButton sx={{ cursor: "not-allowed" }}>
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
        <CircleOutlinedIcon />
      )}
    </IconButton>
  );
}
