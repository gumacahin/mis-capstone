import FlagIcon from "@mui/icons-material/Flag";

import { TaskPriority } from "../types/common";

export default function PriorityIcon({ priority }: { priority: TaskPriority }) {
  switch (priority) {
    case "LOW":
      return <FlagIcon fontSize="small" color="info" />;
    case "MEDIUM":
      return <FlagIcon fontSize="small" color="warning" />;
    case "HIGH":
      return <FlagIcon fontSize="small" color="error" />;
    default:
      return <FlagIcon fontSize="small" color="disabled" />;
  }
}
