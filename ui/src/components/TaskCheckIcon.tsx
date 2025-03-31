import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import { MouseEvent, useContext } from "react";
import toast from "react-hot-toast";

import { useUpdateTask } from "../api";
import ProjectContext from "../contexts/projectContext";
import type { IProjectDetail, ITask } from "../types/common";

export default function TaskCheckIcon({
  task,
  disabled,
}: {
  task: ITask;
  disabled?: boolean;
}) {
  const project = useContext<IProjectDetail | null>(ProjectContext);
  const updateTask = useUpdateTask(task, project);

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
