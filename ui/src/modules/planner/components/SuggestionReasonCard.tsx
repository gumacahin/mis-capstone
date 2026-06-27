import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { PlannerSuggestion } from "../types";
import TaskSignalBreakdown from "./TaskSignalBreakdown";

interface SuggestionReasonCardProps {
  suggestion: PlannerSuggestion;
}

export default function SuggestionReasonCard({
  suggestion,
}: SuggestionReasonCardProps) {
  return (
    <Box
      role="region"
      aria-label={`Reason for ${suggestion.task.title}`}
      sx={{
        borderLeft: 3,
        borderColor: "primary.main",
        pl: 2,
        py: 0.5,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="subtitle2">Reason</Typography>
        <Typography variant="body2" color="text.secondary">
          {suggestion.reason}
        </Typography>
        <TaskSignalBreakdown suggestion={suggestion} />
      </Stack>
    </Box>
  );
}
