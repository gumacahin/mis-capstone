export type PlannerEnergyLevel = "low" | "medium" | "high";
export type PlannerFocusMode = "flexible" | "deep" | "admin" | "light";
export type PlannerSuggestionStatus =
  | "suggested"
  | "accepted"
  | "snoozed"
  | "dismissed"
  | "done";

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

export interface TodayPlan {
  id: number;
  date: string;
  status: string;
  generated_at: string;
  check_in: PlannerCheckIn;
  suggestions: PlannerSuggestion[];
  feedback: PlannerFeedback | null;
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
