import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SnoozeIcon from "@mui/icons-material/Snooze";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import type { PlannerSuggestion, PlannerSuggestionAction } from "../types";
import SuggestionReasonCard from "./SuggestionReasonCard";

interface SuggestionCardProps {
  allowedActions: PlannerSuggestionAction[];
  disabled: boolean;
  suggestion: PlannerSuggestion;
  onAction: (action: PlannerSuggestionAction, minutes?: number) => void;
}

export default function SuggestionCard({
  allowedActions,
  disabled,
  suggestion,
  onAction,
}: SuggestionCardProps) {
  const [showReason, setShowReason] = useState(false);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" component="h3">
                  {suggestion.task.title}
                </Typography>
                <Chip size="small" label={suggestion.status} />
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${suggestion.estimated_minutes}m`}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {suggestion.reason}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Button
                size="small"
                startIcon={<InfoOutlinedIcon />}
                onClick={() => {
                  setShowReason((current) => !current);
                }}
              >
                {showReason ? "Hide reason" : "Why this?"}
              </Button>
              {allowedActions.includes("accept") && (
                <Button
                  size="small"
                  startIcon={<CheckCircleOutlineIcon />}
                  disabled={disabled || suggestion.status === "accepted"}
                  onClick={() => {
                    onAction("accept");
                  }}
                >
                  Accept
                </Button>
              )}
              {allowedActions.includes("snooze") && (
                <Button
                  size="small"
                  startIcon={<SnoozeIcon />}
                  disabled={disabled || suggestion.status === "snoozed"}
                  onClick={() => {
                    onAction("snooze", 60);
                  }}
                >
                  Snooze
                </Button>
              )}
              {allowedActions.includes("dismiss") && (
                <Button
                  size="small"
                  color="inherit"
                  startIcon={<CloseIcon />}
                  disabled={disabled}
                  onClick={() => {
                    onAction("dismiss");
                  }}
                >
                  Dismiss
                </Button>
              )}
            </Stack>
          </Stack>
          <Collapse in={showReason} unmountOnExit>
            <SuggestionReasonCard suggestion={suggestion} />
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
