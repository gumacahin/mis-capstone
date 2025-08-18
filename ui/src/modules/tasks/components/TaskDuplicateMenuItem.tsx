import DuplicateIcon from "@mui/icons-material/ContentCopy";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { useDuplicateTask } from "@shared/hooks/queries";
import { Task } from "@shared/types/common";
import toast from "react-hot-toast";

export interface TaskDuplicateMenuItemProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDuplicateMenuItem({
  task,
  onClose,
}: TaskDuplicateMenuItemProps) {
  const { mutateAsync: duplicateTask } = useDuplicateTask(task);
  const handleDuplicateTask = async () => {
    onClose();
    await toast.promise(
      duplicateTask(),

      {
        loading: "Duplicating task...",
        success: "Task duplicated successfully!",
        error: "Failed to duplicate task.",
      },
    );
  };
  return (
    <MenuItem
      onClick={(e) => {
        e.stopPropagation();
        handleDuplicateTask();
      }}
    >
      <ListItemIcon>
        <DuplicateIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Duplicate" />
    </MenuItem>
  );
}
