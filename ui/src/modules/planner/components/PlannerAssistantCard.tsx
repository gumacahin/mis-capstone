import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactElement } from "react";
import { useMemo, useState } from "react";

import { useInvokePlannerTool, usePlannerTools } from "../hooks";
import type {
  PlannerToolInvocationInput,
  PlannerToolInvocationResult,
  PlannerToolName,
  TodayPlan,
} from "../types";

interface PlannerAssistantCardProps {
  plan?: TodayPlan;
}

interface PlannerAssistantAction {
  id: string;
  label: string;
  toolName: PlannerToolName;
  icon: ReactElement;
  buildArguments: (plan?: TodayPlan) => Record<string, unknown>;
}

const assistantActions: PlannerAssistantAction[] = [
  {
    id: "show-plan",
    label: "Show current plan",
    toolName: "get_today_plan",
    icon: <VisibilityIcon fontSize="small" />,
    buildArguments: () => ({}),
  },
  {
    id: "refresh-plan",
    label: "Refresh plan",
    toolName: "rebuild_today_plan",
    icon: <RefreshIcon fontSize="small" />,
    buildArguments: () => ({}),
  },
  {
    id: "low-energy",
    label: "Use low-energy mode",
    toolName: "submit_check_in",
    icon: <LightbulbIcon fontSize="small" />,
    buildArguments: (plan) => ({
      energy_level: "low",
      available_minutes: Math.min(plan?.check_in.available_minutes ?? 45, 45),
      focus_mode: "light",
      context: plan?.check_in.context || "Low-energy planning",
    }),
  },
];

export default function PlannerAssistantCard({
  plan,
}: PlannerAssistantCardProps) {
  const toolsQuery = usePlannerTools();
  const invokeTool = useInvokePlannerTool();
  const [lastResult, setLastResult] =
    useState<PlannerToolInvocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableToolNames = useMemo(
    () => new Set((toolsQuery.data ?? []).map((tool) => tool.name)),
    [toolsQuery.data],
  );

  const handleInvoke = (input: PlannerToolInvocationInput) => {
    setError(null);
    invokeTool.mutate(input, {
      onSuccess: (result) => {
        setLastResult(result);
      },
      onError: () => {
        setError("Planner assistant could not complete that action.");
      },
    });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Typography variant="h6" component="h2">
              Planner assistant
            </Typography>
            {toolsQuery.isPending && (
              <Chip size="small" label="Loading tools" />
            )}
            {toolsQuery.isSuccess && (
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={`${toolsQuery.data.length} typed tools`}
              />
            )}
          </Stack>

          {toolsQuery.isError && (
            <Alert severity="warning">Planner assistant is unavailable.</Alert>
          )}

          {toolsQuery.data && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {toolsQuery.data.map((tool) => (
                <Chip
                  key={tool.name}
                  size="small"
                  variant="outlined"
                  label={formatToolName(tool.name)}
                />
              ))}
            </Stack>
          )}

          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            {assistantActions.map((action) => (
              <Button
                key={action.id}
                variant={action.id === "show-plan" ? "outlined" : "contained"}
                startIcon={action.icon}
                disabled={
                  toolsQuery.isPending ||
                  invokeTool.isPending ||
                  !availableToolNames.has(action.toolName)
                }
                onClick={() => {
                  handleInvoke({
                    toolName: action.toolName,
                    arguments: action.buildArguments(plan),
                  });
                }}
              >
                {action.label}
              </Button>
            ))}
          </Stack>

          {invokeTool.isPending && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Running planner tool
              </Typography>
            </Stack>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {lastResult && (
            <Alert severity="success">
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    size="small"
                    color="success"
                    label={`tool: ${formatToolName(lastResult.tool_name)}`}
                  />
                  <Chip
                    size="small"
                    color="success"
                    variant="outlined"
                    label={`result_type: ${lastResult.result_type}`}
                  />
                </Stack>
                <Typography variant="body2">
                  {summarizeInvocationResult(lastResult)}
                </Typography>
              </Stack>
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

const formatToolName = (toolName: string) => toolName.replace(/_/g, " ");

const summarizeInvocationResult = (result: PlannerToolInvocationResult) => {
  if (result.result_type === "today_plan" && isTodayPlan(result.result)) {
    const suggestionCount = result.result.suggestions.length;
    const mode = result.result.ui_schema?.mode ?? "default";
    return `${suggestionCount} ${pluralize("suggestion", suggestionCount)} | ${formatMode(mode)}`;
  }

  if (result.result_type === "plan_item" && isPlanItem(result.result)) {
    return `${result.result.task.title} is ${result.result.status}.`;
  }

  if (result.result_type === "plan_feedback") {
    return "Plan feedback saved.";
  }

  return "Planner tool completed.";
};

const isTodayPlan = (value: unknown): value is TodayPlan =>
  isRecord(value) &&
  Array.isArray(value.suggestions) &&
  isRecord(value.check_in);

const isPlanItem = (
  value: unknown,
): value is { task: { title: string }; status: string } => {
  if (!isRecord(value) || typeof value.status !== "string") {
    return false;
  }

  return isRecord(value.task) && typeof value.task.title === "string";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const pluralize = (word: string, count: number) =>
  count === 1 ? word : `${word}s`;

const formatMode = (mode: string) => {
  switch (mode) {
    case "limited_time":
      return "Time boxed";
    case "low_energy":
      return "Low energy";
    case "overdue_triage":
      return "Overdue triage";
    case "default":
      return "Default plan";
    default:
      return mode;
  }
};
