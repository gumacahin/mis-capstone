import { useApiClient } from "@shared/hooks/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getTodayPlan,
  plannerQueryKeys,
  rebuildTodayPlan,
  submitPlannerCheckIn,
  updatePlannerSuggestion,
} from "./client";
import type {
  PlannerCheckInInput,
  PlannerSuggestionActionInput,
} from "./types";

export const usePlannerToday = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: plannerQueryKeys.today,
    queryFn: async () => getTodayPlan(apiClient),
  });
};

export const useSubmitPlannerCheckIn = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["planner", "check-in"],
    mutationFn: async (input: PlannerCheckInInput) =>
      submitPlannerCheckIn(apiClient, input),
    onSuccess: (data) => {
      queryClient.setQueryData(plannerQueryKeys.today, data);
    },
  });
};

export const useRebuildTodayPlan = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["planner", "rebuild"],
    mutationFn: async () => rebuildTodayPlan(apiClient),
    onSuccess: (data) => {
      queryClient.setQueryData(plannerQueryKeys.today, data);
    },
  });
};

export const usePlannerSuggestionAction = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["planner", "suggestion-action"],
    mutationFn: async (input: PlannerSuggestionActionInput) =>
      updatePlannerSuggestion(apiClient, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.today });
    },
  });
};
