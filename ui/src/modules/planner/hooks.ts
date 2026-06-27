import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useGeneratedApiClient } from "@/api/client";

import {
  getTodayPlan,
  plannerQueryKeys,
  rebuildTodayPlan,
  submitPlannerCheckIn,
  submitPlannerFeedback,
  updatePlannerSuggestion,
} from "./client";
import type {
  PlannerCheckInInput,
  PlannerFeedbackInput,
  PlannerSuggestionActionInput,
  TodayPlan,
} from "./types";

export const usePlannerToday = () => {
  const { planner } = useGeneratedApiClient();
  return useQuery({
    queryKey: plannerQueryKeys.today,
    queryFn: async () => getTodayPlan(planner),
  });
};

export const useSubmitPlannerCheckIn = () => {
  const { planner } = useGeneratedApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["planner", "check-in"],
    mutationFn: async (input: PlannerCheckInInput) =>
      submitPlannerCheckIn(planner, input),
    onSuccess: (data) => {
      queryClient.setQueryData(plannerQueryKeys.today, data);
    },
  });
};

export const useRebuildTodayPlan = () => {
  const { planner } = useGeneratedApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["planner", "rebuild"],
    mutationFn: async () => rebuildTodayPlan(planner),
    onSuccess: (data) => {
      queryClient.setQueryData(plannerQueryKeys.today, data);
    },
  });
};

export const useSubmitPlannerFeedback = () => {
  const { planner } = useGeneratedApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["planner", "feedback"],
    mutationFn: async (input: PlannerFeedbackInput) =>
      submitPlannerFeedback(planner, input),
    onSuccess: (data) => {
      queryClient.setQueryData<TodayPlan | undefined>(
        plannerQueryKeys.today,
        (plan) => (plan ? { ...plan, feedback: data } : plan),
      );
    },
  });
};

export const usePlannerSuggestionAction = () => {
  const { planner } = useGeneratedApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["planner", "suggestion-action"],
    mutationFn: async (input: PlannerSuggestionActionInput) =>
      updatePlannerSuggestion(planner, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.today });
    },
  });
};
