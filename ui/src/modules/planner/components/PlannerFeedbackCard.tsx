import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import type { PlannerFeedbackInput, TodayPlan } from "../types";

interface PlannerFeedbackCardProps {
  disabled: boolean;
  plan?: TodayPlan;
  onSubmit: (input: PlannerFeedbackInput) => void;
}

export default function PlannerFeedbackCard({
  disabled,
  plan,
  onSubmit,
}: PlannerFeedbackCardProps) {
  const [helpfulnessRating, setHelpfulnessRating] = useState(4);
  const [confidenceRating, setConfidenceRating] = useState(4);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!plan) return;
    setHelpfulnessRating(plan.feedback?.helpfulness_rating ?? 4);
    setConfidenceRating(plan.feedback?.confidence_rating ?? 4);
    setNote(plan.feedback?.note ?? "");
  }, [
    plan,
    plan?.feedback?.confidence_rating,
    plan?.feedback?.helpfulness_rating,
    plan?.feedback?.note,
  ]);

  const hasValidRatings = useMemo(
    () => isRating(helpfulnessRating) && isRating(confidenceRating),
    [confidenceRating, helpfulnessRating],
  );

  if (!plan) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasValidRatings) return;
    onSubmit({
      helpfulness_rating: helpfulnessRating,
      confidence_rating: confidenceRating,
      note: note.trim(),
    });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="h6" component="h2">
              Was this plan useful?
            </Typography>
            {plan.feedback && (
              <Chip size="small" color="success" label="Feedback saved" />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Rate whether the suggestions helped you decide what to do today.
            These responses are stored as aggregate evaluation evidence for the
            planner.
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              size="small"
              type="number"
              label="Helpful rating"
              value={helpfulnessRating}
              onChange={(event) => {
                setHelpfulnessRating(Number(event.target.value));
              }}
              inputProps={{ min: 1, max: 5 }}
              error={!isRating(helpfulnessRating)}
            />
            <TextField
              size="small"
              type="number"
              label="Confidence rating"
              value={confidenceRating}
              onChange={(event) => {
                setConfidenceRating(Number(event.target.value));
              }}
              inputProps={{ min: 1, max: 5 }}
              error={!isRating(confidenceRating)}
            />
            <TextField
              size="small"
              label="Feedback note"
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
              }}
              inputProps={{ maxLength: 1000 }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              type="submit"
              variant="outlined"
              disabled={disabled || !hasValidRatings}
            >
              {plan.feedback ? "Update feedback" : "Save feedback"}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

const isRating = (value: number) =>
  Number.isInteger(value) && value >= 1 && value <= 5;
