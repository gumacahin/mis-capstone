import IconButton from "@mui/material/IconButton";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Task } from "../types/common";
import { useUpdateTask } from "../api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

export default function TaskCheckIcon({ task }: { task: Task }) {
  const updateTask = useUpdateTask(task);

  const handleClick = () => {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed,
      completed_date: task.completed ? "" : dayjs().format("YYYY-MM-DD"),
    };
    toast.promise(updateTask.mutateAsync(updatedTask), {
      loading: "Updating task...",
      success: "Task updated successfully!",
      error: "Error updating task.",
    });
  };

  return (
    <IconButton onClick={handleClick}>
      {task.completed ? (
        <CheckCircleOutlineOutlinedIcon />
      ) : (
        <CircleOutlinedIcon />
      )}
    </IconButton>
  );
}
