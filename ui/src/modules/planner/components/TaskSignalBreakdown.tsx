import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlannerSuggestion } from "../types";

interface TaskSignalBreakdownProps {
  suggestion: PlannerSuggestion;
  todayDate?: string;
}

export default function TaskSignalBreakdown({
  suggestion,
  todayDate,
}: TaskSignalBreakdownProps) {
  const dueLabel = getDueLabel(suggestion.task.due_date, todayDate);
  const priorityLabel = suggestion.task.priority
    ? `Priority ${suggestion.task.priority}`
    : "No priority";
  const locationLabel = [
    suggestion.task.project_title,
    suggestion.task.section_title,
  ]
    .filter(Boolean)
    .join(" / ");

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Task signals</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip size="small" variant="outlined" label={dueLabel} />
        <Chip size="small" variant="outlined" label={priorityLabel} />
        <Chip
          size="small"
          variant="outlined"
          label={`${suggestion.estimated_minutes} minutes`}
        />
        {locationLabel && (
          <Chip size="small" variant="outlined" label={locationLabel} />
        )}
        <Chip
          size="small"
          variant="outlined"
          label={`Score ${Math.round(suggestion.score)}`}
        />
      </Stack>
    </Stack>
  );
}

const getDueLabel = (
  dueDate: string | null | undefined,
  todayDate?: string,
) => {
  if (!dueDate) return "No due date";
  if (!todayDate) return `Due ${dueDate}`;
  if (dueDate < todayDate) return `Overdue ${dueDate}`;
  if (dueDate === todayDate) return "Due today";
  return `Due ${dueDate}`;
};
