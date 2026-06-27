import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import {
  usePlannerSuggestionAction,
  usePlannerToday,
  useSubmitPlannerCheckIn,
} from "../hooks";
import { renderPlannerComponent } from "../registry";
import { buildPlannerUiSchema } from "../uiSchema";

export default function PlannerSurface() {
  const plannerQuery = usePlannerToday();
  const submitCheckIn = useSubmitPlannerCheckIn();
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
      <Divider />
    </Stack>
  );
}
