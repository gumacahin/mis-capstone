import type { AxiosInstance } from "axios";

import type {
  PlannerCheckInInput,
  PlannerSuggestion,
  PlannerSuggestionActionInput,
  TodayPlan,
} from "./types";

export const plannerQueryKeys = {
  all: ["planner"] as const,
  today: ["planner", "today"] as const,
};

export const getTodayPlan = async (
  apiClient: AxiosInstance,
): Promise<TodayPlan> => {
  const { data } = await apiClient.get("planner/today/");
  return data as TodayPlan;
};

export const submitPlannerCheckIn = async (
  apiClient: AxiosInstance,
  input: PlannerCheckInInput,
): Promise<TodayPlan> => {
  const { data } = await apiClient.post("planner/check-in/", input);
  return data as TodayPlan;
};

export const rebuildTodayPlan = async (
  apiClient: AxiosInstance,
): Promise<TodayPlan> => {
  const { data } = await apiClient.post("planner/rebuild/");
  return data as TodayPlan;
};

export const updatePlannerSuggestion = async (
  apiClient: AxiosInstance,
  { id, action, minutes }: PlannerSuggestionActionInput,
): Promise<PlannerSuggestion> => {
  const body = action === "snooze" ? { minutes: minutes ?? 60 } : {};
  const { data } = await apiClient.post(
    `planner/suggestions/${id}/${action}/`,
    body,
  );
  return data as PlannerSuggestion;
};
