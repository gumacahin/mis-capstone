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

export interface PlannerSuggestion {
  id: number;
  task: PlannerTask;
  order: number;
  reason: string;
  estimated_minutes: number;
  score: number;
  status: PlannerSuggestionStatus;
  snoozed_until: string | null;
  accepted_at: string | null;
  dismissed_at: string | null;
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
