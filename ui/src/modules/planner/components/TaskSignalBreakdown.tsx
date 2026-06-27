import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlannerSuggestion } from "../types";

interface TaskSignalBreakdownProps {
  suggestion: PlannerSuggestion;
}

export default function TaskSignalBreakdown({
  suggestion,
}: TaskSignalBreakdownProps) {
  const { signals } = suggestion;
  const priorityLabel = `Priority ${signals.priority_label.toLowerCase()}`;
  const locationLabel = [signals.project_title, signals.section_title]
    .filter(Boolean)
    .join(" / ");

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Task signals</Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip size="small" variant="outlined" label={signals.due_label} />
        <Chip size="small" variant="outlined" label={priorityLabel} />
        <Chip
          size="small"
          variant="outlined"
          label={`${signals.estimated_minutes} minutes`}
        />
        {locationLabel && (
          <Chip size="small" variant="outlined" label={locationLabel} />
        )}
        {signals.is_recurring && (
          <Chip size="small" variant="outlined" label="Recurring" />
        )}
        {signals.snoozed_count > 0 && (
          <Chip
            size="small"
            variant="outlined"
            label={`Snoozed ${signals.snoozed_count}x`}
          />
        )}
        {signals.dismissed_count > 0 && (
          <Chip
            size="small"
            variant="outlined"
            label={`Dismissed ${signals.dismissed_count}x`}
          />
        )}
        <Chip
          size="small"
          variant="outlined"
          label={`Score ${signals.score}`}
        />
      </Stack>
    </Stack>
  );
}
