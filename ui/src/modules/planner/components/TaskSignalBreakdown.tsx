import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  formatHistorySignal,
  formatLocationSignal,
  formatPrioritySignal,
} from "../explanations";
import type { PlannerSuggestion } from "../types";

interface TaskSignalBreakdownProps {
  suggestion: PlannerSuggestion;
}

export default function TaskSignalBreakdown({
  suggestion,
}: TaskSignalBreakdownProps) {
  const { signals } = suggestion;
  const rows = [
    ["Due", signals.due_label],
    ["Priority", formatPrioritySignal(signals)],
    ["Effort", `${signals.estimated_minutes} minutes`],
    ["Project", formatLocationSignal(signals) || "No project"],
    ["Recurrence", signals.is_recurring ? "Recurring" : "One-time"],
    ["History", formatHistorySignal(signals)],
    ["Planner score", String(signals.score)],
  ];

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Task signals</Typography>
      <Box
        component="dl"
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          m: 0,
        }}
      >
        {rows.map(([label, value]) => (
          <Box
            key={label}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              minWidth: 0,
              p: 1,
            }}
          >
            <Typography component="dt" variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0 }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
