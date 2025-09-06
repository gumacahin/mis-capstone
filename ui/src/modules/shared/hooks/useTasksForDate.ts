import { useQuery } from "@tanstack/react-query";
import { Dayjs } from "dayjs";

import { useApiClient } from "./queries";

/**
 * Custom hook to fetch tasks for a specific date
 */
export const useTasksForDate = (date: Dayjs | null) => {
  const apiClient = useApiClient();

  const dateStr = date?.isValid() ? date.format("YYYY-MM-DD") : null;

  return useQuery({
    queryKey: ["tasks", "date", dateStr],
    queryFn: async () => {
      if (!dateStr) return [];

      const { data } = await apiClient.get(
        `tasks/?start_date=${dateStr}&end_date=${dateStr}`,
      );
      return data || [];
    },
    enabled: !!dateStr,
    staleTime: 5 * 60 * 1000, // 5 minutes - tasks don't change that frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
