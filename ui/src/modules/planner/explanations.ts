import type { PlannerSuggestion, PlannerTaskSignals } from "./types";

const hasPriority = (signals: PlannerTaskSignals) =>
  signals.priority.toLowerCase() !== "none";

export const formatPrioritySignal = (signals: PlannerTaskSignals) =>
  hasPriority(signals) ? `${signals.priority_label} priority` : "No priority";

export const formatLocationSignal = (signals: PlannerTaskSignals) =>
  [signals.project_title, signals.section_title].filter(Boolean).join(" / ");

export const formatHistorySignal = (signals: PlannerTaskSignals) => {
  const history = [];
  if (signals.snoozed_count > 0)
    history.push(`snoozed ${signals.snoozed_count}x`);
  if (signals.dismissed_count > 0) {
    history.push(`dismissed ${signals.dismissed_count}x`);
  }
  return history.length > 0
    ? history.join(", ")
    : "No prior snoozes or dismissals";
};

export const buildSuggestionTodayLine = (suggestion: PlannerSuggestion) => {
  const { signals } = suggestion;
  return [
    signals.due_label,
    formatPrioritySignal(signals),
    `${signals.estimated_minutes} min`,
    formatLocationSignal(signals),
  ]
    .filter(Boolean)
    .join(" | ");
};

export const buildSuggestionRelevance = (suggestion: PlannerSuggestion) => {
  const { signals } = suggestion;
  const priorityClause = hasPriority(signals)
    ? `is marked ${signals.priority_label.toLowerCase()} priority`
    : "has no priority flag";
  const effortClause = `is estimated at ${signals.estimated_minutes} minutes`;

  const base = (() => {
    switch (signals.due_status) {
      case "overdue":
        return `It is overdue, ${priorityClause}, and ${effortClause}.`;
      case "due_today":
        return `It is due today, ${priorityClause}, and ${effortClause}.`;
      case "due_soon":
        return `It is coming up soon, ${priorityClause}, and ${effortClause}.`;
      case "later":
        return `It is scheduled later, but ${priorityClause} and ${effortClause}.`;
      case "none":
        return `It ${priorityClause} and ${effortClause}.`;
    }
  })();

  if (signals.is_recurring) {
    return `${base} It is recurring, so doing it today keeps the routine moving.`;
  }

  return base;
};
