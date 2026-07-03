import type { PlannerApi } from "@/generated-api-client/api";

import type {
  PlannerCheckInInput,
  PlannerEvaluationSummary,
  PlannerFeedback,
  PlannerFeedbackInput,
  PlannerSuggestion,
  PlannerSuggestionActionInput,
  PlannerToolDefinition,
  PlannerToolInvocationInput,
  PlannerToolInvocationResult,
  TodayPlan,
} from "./types";

export const plannerQueryKeys = {
  all: ["planner"] as const,
  today: ["planner", "today"] as const,
  evaluation: ["planner", "evaluation"] as const,
  tools: ["planner", "tools"] as const,
};

export const getTodayPlan = async (
  plannerClient: PlannerApi,
): Promise<TodayPlan> => {
  const { data } = await plannerClient.plannerTodayRetrieve();
  return data as TodayPlan;
};

export const submitPlannerCheckIn = async (
  plannerClient: PlannerApi,
  input: PlannerCheckInInput,
): Promise<TodayPlan> => {
  const { data } = await plannerClient.plannerCheckInCreate({
    energyCheckInRequest: input,
  });
  return data as TodayPlan;
};

export const rebuildTodayPlan = async (
  plannerClient: PlannerApi,
): Promise<TodayPlan> => {
  const { data } = await plannerClient.plannerRebuildCreate();
  return data as TodayPlan;
};

export const getPlannerEvaluationSummary = async (
  plannerClient: PlannerApi,
): Promise<PlannerEvaluationSummary> => {
  const { data } = await plannerClient.plannerEvaluationRetrieve();
  return data as PlannerEvaluationSummary;
};

export const getPlannerTools = async (
  plannerClient: PlannerApi,
): Promise<PlannerToolDefinition[]> => {
  const { data } = await plannerClient.plannerToolsList();
  return data as PlannerToolDefinition[];
};

export const invokePlannerTool = async (
  plannerClient: PlannerApi,
  input: PlannerToolInvocationInput,
): Promise<PlannerToolInvocationResult> => {
  const { data } = await plannerClient.plannerToolsInvokeCreate({
    toolName: input.toolName,
    plannerToolInvokeRequest: {
      arguments: input.arguments ?? {},
    },
  });
  return data as PlannerToolInvocationResult;
};

export const submitPlannerFeedback = async (
  plannerClient: PlannerApi,
  input: PlannerFeedbackInput,
): Promise<PlannerFeedback> => {
  const { data } = await plannerClient.plannerFeedbackCreate({
    todayPlanFeedbackRequest: input,
  });
  return data as PlannerFeedback;
};

export const updatePlannerSuggestion = async (
  plannerClient: PlannerApi,
  { id, action, minutes }: PlannerSuggestionActionInput,
): Promise<PlannerSuggestion> => {
  const response =
    action === "accept"
      ? await plannerClient.plannerSuggestionsAcceptCreate({ itemId: id })
      : action === "dismiss"
        ? await plannerClient.plannerSuggestionsDismissCreate({ itemId: id })
        : await plannerClient.plannerSuggestionsSnoozeCreate({
            itemId: id,
            snoozePlanItemRequest: { minutes: minutes ?? 60 },
          });
  const { data } = response;
  return data as PlannerSuggestion;
};
