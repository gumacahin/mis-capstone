export type PlannerEnergyLevel = "low" | "medium" | "high";
export type PlannerFocusMode = "flexible" | "deep" | "admin" | "light";
export type PlannerSuggestionStatus =
  | "suggested"
  | "accepted"
  | "snoozed"
  | "dismissed"
  | "done";

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

export interface PlannerBackendUiSchema {
  component: PlannerUiComponentName;
  mode: PlannerUiMode;
  title: string;
  message: string;
  highlights: string[];
  suggestion_ids: number[];
  allowed_actions: PlannerSuggestionAction[];
}

export interface PlannerCheckIn {
  id: number;
  date: string;
  energy_level: PlannerEnergyLevel;
  available_minutes: number;
  focus_mode: PlannerFocusMode;
  context: string;
  created_at: string;
  updated_at: string;
}

export interface PlannerTask {
  id: number;
  title: string;
  description?: string | null;
  priority?: string;
  due_date?: string | null;
  project_title?: string;
  section_title?: string | null;
}

export type PlannerDueStatus =
  | "none"
  | "overdue"
  | "due_today"
  | "due_soon"
  | "later";

export interface PlannerTaskSignals {
  due_date: string | null;
  due_status: PlannerDueStatus;
  due_label: string;
  due_in_days: number | null;
  priority: string;
  priority_label: string;
  estimated_minutes: number;
  is_recurring: boolean;
  project_title: string;
  section_title: string | null;
  score: number;
  snoozed_count: number;
  dismissed_count: number;
}

export interface PlannerSuggestion {
  id: number;
  task: PlannerTask;
  order: number;
  reason: string;
  estimated_minutes: number;
  score: number;
  signals: PlannerTaskSignals;
  status: PlannerSuggestionStatus;
  snoozed_until: string | null;
  accepted_at: string | null;
  dismissed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlannerFeedback {
  id: number;
  helpfulness_rating: number;
  confidence_rating: number;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface PlannerSuggestionStatusCounts {
  suggested: number;
  accepted: number;
  snoozed: number;
  dismissed: number;
  done: number;
}

export interface PlannerSuggestionActionRates {
  accepted: number;
  snoozed: number;
  dismissed: number;
}

export interface PlannerEvaluationSummary {
  plan_count: number;
  feedback_count: number;
  feedback_response_rate: number;
  average_helpfulness_rating: number | null;
  average_confidence_rating: number | null;
  total_suggestions: number;
  suggestion_status_counts: PlannerSuggestionStatusCounts;
  suggestion_action_rates: PlannerSuggestionActionRates;
}

export type PlannerToolName =
  | "get_today_plan"
  | "submit_check_in"
  | "rebuild_today_plan"
  | "accept_suggestion"
  | "snooze_suggestion"
  | "dismiss_suggestion"
  | "submit_plan_feedback";

export type PlannerToolResultType =
  | "today_plan"
  | "plan_item"
  | "plan_feedback";

export interface PlannerToolDefinition {
  name: PlannerToolName;
  description: string;
  input_schema: Record<string, unknown>;
  mutates_state: boolean;
}

export interface PlannerToolInvocationInput {
  toolName: PlannerToolName;
  arguments?: Record<string, unknown>;
}

export interface PlannerToolInvocationResult {
  tool_name: PlannerToolName;
  result_type: PlannerToolResultType;
  result: Record<string, unknown>;
}

export interface TodayPlan {
  id: number;
  date: string;
  status: string;
  generated_at: string;
  check_in: PlannerCheckIn;
  suggestions: PlannerSuggestion[];
  feedback: PlannerFeedback | null;
  ui_schema?: PlannerBackendUiSchema;
  created_at: string;
  updated_at: string;
}

export type PlannerCheckInInput = Pick<
  PlannerCheckIn,
  "energy_level" | "available_minutes" | "focus_mode" | "context"
>;

export type PlannerSuggestionAction = "accept" | "snooze" | "dismiss";

export interface PlannerSuggestionActionInput {
  id: number;
  action: PlannerSuggestionAction;
  minutes?: number;
}

export type PlannerFeedbackInput = Pick<
  PlannerFeedback,
  "helpfulness_rating" | "confidence_rating" | "note"
>;
