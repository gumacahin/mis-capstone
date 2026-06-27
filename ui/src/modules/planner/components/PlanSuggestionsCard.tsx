import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type {
  PlannerSuggestionAction,
  PlannerSuggestionActionInput,
  TodayPlan,
} from "../types";
import type { PlannerUiSchema } from "../uiSchema";
import { visiblePlannerSuggestions } from "../uiSchema";
import SuggestionCard from "./SuggestionCard";

interface PlanSuggestionsCardProps {
  disabled: boolean;
  isPending: boolean;
  plan?: TodayPlan;
  schema: PlannerUiSchema;
  onAction: (input: PlannerSuggestionActionInput) => void;
}

export default function PlanSuggestionsCard({
  disabled,
  isPending,
  plan,
  schema,
  onAction,
}: PlanSuggestionsCardProps) {
  const suggestions = visiblePlannerSuggestions(plan).filter((suggestion) =>
    schema.suggestionIds?.includes(suggestion.id),
  );

  return (
    <Stack spacing={1.5}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" component="h2">
            {schema.title}
          </Typography>
          {isPending && <Chip size="small" label="Loading" />}
          {schema.mode !== "default" && (
            <Chip
              size="small"
              variant="outlined"
              label={formatMode(schema.mode)}
            />
          )}
        </Stack>
        {schema.message && (
          <Typography variant="body2" color="text.secondary">
            {schema.message}
          </Typography>
        )}
      </Stack>
      {suggestions.length === 0 && !isPending && (
        <Alert severity="info">No suggestions for the current check-in.</Alert>
      )}
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={suggestion.id}
          allowedActions={schema.allowedActions}
          disabled={disabled}
          suggestion={suggestion}
          todayDate={plan?.date}
          onAction={(action: PlannerSuggestionAction, minutes?: number) => {
            onAction({
              id: suggestion.id,
              action,
              minutes,
            });
          }}
        />
      ))}
    </Stack>
  );
}

const formatMode = (mode: PlannerUiSchema["mode"]) => {
  switch (mode) {
    case "limited_time":
      return "Time boxed";
    case "low_energy":
      return "Low energy";
    case "overdue_triage":
      return "Triage";
    case "default":
    case "unavailable":
      return mode;
  }
};
