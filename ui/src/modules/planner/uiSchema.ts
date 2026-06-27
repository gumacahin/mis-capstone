import type {
  PlannerSuggestion,
  PlannerSuggestionAction,
  TodayPlan,
} from "./types";

export type PlannerUiComponentName =
  | "EnergyCheckInCard"
  | "LowEnergyPlanCard"
  | "PlannerUnavailableCard"
  | "TaskTriagePanel"
  | "TimeBoxPlanCard"
  | "TodayPlanCard";

export type PlannerUiMode =
  | "default"
  | "limited_time"
  | "low_energy"
  | "overdue_triage"
  | "unavailable";

export interface PlannerUiSchema {
  component: PlannerUiComponentName;
  mode: PlannerUiMode;
  title: string;
  message?: string;
  suggestionIds?: number[];
  allowedActions: PlannerSuggestionAction[];
}

interface BuildPlannerUiSchemaInput {
  isError: boolean;
  isPending: boolean;
  plan?: TodayPlan;
}

export const visiblePlannerSuggestions = (
  plan?: TodayPlan,
): PlannerSuggestion[] =>
  plan?.suggestions.filter((item) => item.status !== "dismissed") ?? [];

export const buildPlannerUiSchema = ({
  isError,
  isPending,
  plan,
}: BuildPlannerUiSchemaInput): PlannerUiSchema[] => {
  if (isError) {
    return [
      {
        component: "PlannerUnavailableCard",
        mode: "unavailable",
        title: "Planner unavailable",
        allowedActions: [],
      },
    ];
  }

  const schema: PlannerUiSchema[] = [
    {
      component: "EnergyCheckInCard",
      mode: "default",
      title: "Plan today",
      allowedActions: [],
    },
  ];

  const suggestions = visiblePlannerSuggestions(plan);
  const suggestionIds = suggestions.map((suggestion) => suggestion.id);
  const suggestionCard = getSuggestionCardSchema(plan, suggestions, isPending);

  schema.push({
    ...suggestionCard,
    suggestionIds,
    allowedActions: ["accept", "snooze", "dismiss"],
  });

  return schema;
};

const getSuggestionCardSchema = (
  plan: TodayPlan | undefined,
  suggestions: PlannerSuggestion[],
  isPending: boolean,
): Omit<PlannerUiSchema, "allowedActions" | "suggestionIds"> => {
  if (isPending || !plan || suggestions.length === 0) {
    return {
      component: "TodayPlanCard",
      mode: "default",
      title: "Suggested next",
    };
  }

  const overdueCount = suggestions.filter((suggestion) =>
    isOverdue(suggestion.task.due_date, plan.date),
  ).length;

  if (overdueCount >= 2) {
    return {
      component: "TaskTriagePanel",
      mode: "overdue_triage",
      title: "Overdue triage",
      message: "A smaller shortlist from overdue work.",
    };
  }

  if (plan.check_in.energy_level === "low") {
    return {
      component: "LowEnergyPlanCard",
      mode: "low_energy",
      title: "Low-energy plan",
      message: "Lighter next actions for your current energy.",
    };
  }

  if (plan.check_in.available_minutes <= 60) {
    return {
      component: "TimeBoxPlanCard",
      mode: "limited_time",
      title: "Fits your time",
      message: `Suggested work for ${plan.check_in.available_minutes} minutes.`,
    };
  }

  return {
    component: "TodayPlanCard",
    mode: "default",
    title: "Suggested next",
  };
};

const isOverdue = (dueDate: string | null | undefined, planDate: string) => {
  if (!dueDate) return false;
  return dueDate < planDate;
};
