import Alert, { type AlertColor } from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useState } from "react";

import {
  usePlannerSuggestionAction,
  usePlannerToday,
  useSubmitPlannerCheckIn,
  useSubmitPlannerFeedback,
} from "../hooks";
import { renderPlannerComponent } from "../registry";
import type { PlannerSuggestionAction } from "../types";
import { buildPlannerUiSchema } from "../uiSchema";
import PlannerFeedbackCard from "./PlannerFeedbackCard";

type PlannerNotice = {
  severity: AlertColor;
  message: string;
};

export default function PlannerSurface() {
  const plannerQuery = usePlannerToday();
  const submitCheckIn = useSubmitPlannerCheckIn();
  const submitFeedback = useSubmitPlannerFeedback();
  const suggestionAction = usePlannerSuggestionAction();
  const [notice, setNotice] = useState<PlannerNotice | null>(null);
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
            submitCheckIn.mutate(input, {
              onSuccess: () => {
                setNotice({
                  severity: "success",
                  message:
                    "Check-in updated. Suggestions were rebuilt from your current energy, time, and focus.",
                });
              },
              onError: () => {
                setNotice({
                  severity: "error",
                  message:
                    "Check-in could not be saved. Please try updating the planner again.",
                });
              },
            });
          },
          onSuggestionAction: (input) => {
            suggestionAction.mutate(input, {
              onSuccess: () => {
                setNotice({
                  severity: "success",
                  message: getSuggestionActionNotice(input.action),
                });
              },
              onError: () => {
                setNotice({
                  severity: "error",
                  message:
                    "Suggestion action could not be saved. Please try again.",
                });
              },
            });
          },
        }),
      )}
      {notice && (
        <Alert
          severity={notice.severity}
          onClose={() => {
            setNotice(null);
          }}
        >
          {notice.message}
        </Alert>
      )}
      <PlannerFeedbackCard
        disabled={plannerQuery.isPending || submitFeedback.isPending}
        plan={plannerQuery.data}
        onSubmit={(input) => {
          submitFeedback.mutate(input, {
            onSuccess: () => {
              setNotice({
                severity: "success",
                message:
                  "Feedback saved for evaluation. It will appear in aggregate planner metrics.",
              });
            },
            onError: () => {
              setNotice({
                severity: "error",
                message: "Feedback could not be saved. Please try again.",
              });
            },
          });
        }}
      />
      <Divider />
    </Stack>
  );
}

const getSuggestionActionNotice = (action: PlannerSuggestionAction) => {
  switch (action) {
    case "accept":
      return "Recorded: accepted. This choice is included in planner evaluation metrics.";
    case "snooze":
      return "Recorded: snoozed for later. This choice is included in planner evaluation metrics.";
    case "dismiss":
      return "Recorded: dismissed. The suggestion is hidden from today's plan and counted in evaluation metrics.";
  }
};
