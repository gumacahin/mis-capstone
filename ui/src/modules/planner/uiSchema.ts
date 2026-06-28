import type {
  PlannerBackendUiSchema,
  PlannerSuggestion,
  PlannerSuggestionAction,
  PlannerUiComponentName,
  PlannerUiMode,
  TodayPlan,
} from "./types";

export interface PlannerUiSchema {
  component: PlannerUiComponentName;
  mode: PlannerUiMode;
  title: string;
  message?: string;
  highlights?: string[];
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

  if (!isPending && plan?.ui_schema) {
    schema.push(toPlannerUiSchema(plan.ui_schema));
    return schema;
  }

  const suggestions = visiblePlannerSuggestions(plan);
  const suggestionCard = getSuggestionCardSchema(plan, suggestions, isPending);
  const selectedSuggestions = selectSuggestionsForMode(
    plan,
    suggestions,
    suggestionCard.mode,
  );
  const suggestionIds = selectedSuggestions.map((suggestion) => suggestion.id);

  schema.push({
    ...suggestionCard,
    suggestionIds,
    allowedActions: ["accept", "snooze", "dismiss"],
  });

  return schema;
};

const toPlannerUiSchema = (
  backendSchema: PlannerBackendUiSchema,
): PlannerUiSchema => ({
  component: backendSchema.component,
  mode: backendSchema.mode,
  title: backendSchema.title,
  message: backendSchema.message || undefined,
  highlights: backendSchema.highlights,
  suggestionIds: backendSchema.suggestion_ids,
  allowedActions: backendSchema.allowed_actions,
});

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
      message: "Focus on overdue work before scanning the full task list.",
      highlights: [`${overdueCount} overdue`, "Urgent first"],
    };
  }

  if (plan.check_in.energy_level === "low") {
    return {
      component: "LowEnergyPlanCard",
      mode: "low_energy",
      title: "Low-energy plan",
      message: "Start with smaller next actions while preserving urgent work.",
      highlights: ["Energy low", formatFocusMode(plan.check_in.focus_mode)],
    };
  }

  if (plan.check_in.available_minutes <= 60) {
    const fittingCount = suggestions.filter(
      (suggestion) =>
        suggestion.estimated_minutes <= plan.check_in.available_minutes,
    ).length;
    return {
      component: "TimeBoxPlanCard",
      mode: "limited_time",
      title: "Fits your time",
      message:
        fittingCount > 0
          ? `Showing tasks that fit within ${plan.check_in.available_minutes} minutes.`
          : `No task fully fits ${plan.check_in.available_minutes} minutes, so the shortest next action is shown.`,
      highlights: [
        `${plan.check_in.available_minutes} minutes`,
        fittingCount > 0 ? `${fittingCount} fit` : "Closest fit",
      ],
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

const selectSuggestionsForMode = (
  plan: TodayPlan | undefined,
  suggestions: PlannerSuggestion[],
  mode: PlannerUiMode,
) => {
  if (!plan || suggestions.length === 0) return suggestions;

  switch (mode) {
    case "limited_time":
      return selectTimeBoxSuggestions(plan, suggestions);
    case "low_energy":
      return [...suggestions].sort(compareLowEnergySuggestions);
    case "overdue_triage":
      return suggestions
        .filter((suggestion) => isOverdue(suggestion.task.due_date, plan.date))
        .sort(compareUrgencyThenOrder);
    case "default":
    case "unavailable":
      return suggestions;
  }
};

const selectTimeBoxSuggestions = (
  plan: TodayPlan,
  suggestions: PlannerSuggestion[],
) => {
  const availableMinutes = plan.check_in.available_minutes;
  const fittingSuggestions = suggestions
    .filter((suggestion) => suggestion.estimated_minutes <= availableMinutes)
    .sort(compareUrgencyThenOrder);

  if (fittingSuggestions.length > 0) {
    return fittingSuggestions;
  }

  return [...suggestions]
    .sort(
      (first, second) =>
        first.estimated_minutes - second.estimated_minutes ||
        compareUrgencyThenOrder(first, second),
    )
    .slice(0, 1);
};

const compareLowEnergySuggestions = (
  first: PlannerSuggestion,
  second: PlannerSuggestion,
) =>
  dueRank(first) - dueRank(second) ||
  first.estimated_minutes - second.estimated_minutes ||
  first.order - second.order;

const compareUrgencyThenOrder = (
  first: PlannerSuggestion,
  second: PlannerSuggestion,
) =>
  dueRank(first) - dueRank(second) ||
  second.score - first.score ||
  first.order - second.order;

const dueRank = (suggestion: PlannerSuggestion) => {
  switch (suggestion.signals.due_status) {
    case "overdue":
      return 0;
    case "due_today":
      return 1;
    case "due_soon":
      return 2;
    case "later":
      return 3;
    case "none":
      return 4;
  }
};

const formatFocusMode = (focusMode: TodayPlan["check_in"]["focus_mode"]) => {
  switch (focusMode) {
    case "admin":
      return "Admin focus";
    case "deep":
      return "Deep focus";
    case "flexible":
      return "Flexible focus";
    case "light":
      return "Light focus";
  }
};
