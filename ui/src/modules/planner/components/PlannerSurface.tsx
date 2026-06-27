import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import {
  usePlannerSuggestionAction,
  usePlannerToday,
  useSubmitPlannerCheckIn,
  useSubmitPlannerFeedback,
} from "../hooks";
import { renderPlannerComponent } from "../registry";
import { buildPlannerUiSchema } from "../uiSchema";
import PlannerFeedbackCard from "./PlannerFeedbackCard";

export default function PlannerSurface() {
  const plannerQuery = usePlannerToday();
  const submitCheckIn = useSubmitPlannerCheckIn();
  const submitFeedback = useSubmitPlannerFeedback();
  const suggestionAction = usePlannerSuggestionAction();
  const schemas = buildPlannerUiSchema({
    isError: plannerQuery.isError,
    isPending: plannerQuery.isPending,
    plan: plannerQuery.data,
  });

  return (
    <Stack spacing={2}>
      {schemas.map((schema) =>
        renderPlannerComponent(schema, {
          isPending: plannerQuery.isPending,
          plan: plannerQuery.data,
          suggestionActionPending: suggestionAction.isPending,
          submitCheckInPending: submitCheckIn.isPending,
          onSubmitCheckIn: (input) => {
            submitCheckIn.mutate(input);
          },
          onSuggestionAction: (input) => {
            suggestionAction.mutate(input);
          },
        }),
      )}
      <PlannerFeedbackCard
        disabled={plannerQuery.isPending || submitFeedback.isPending}
        plan={plannerQuery.data}
        onSubmit={(input) => {
          submitFeedback.mutate(input);
        }}
      />
      <Divider />
    </Stack>
  );
}
