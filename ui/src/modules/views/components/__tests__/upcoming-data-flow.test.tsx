import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// Mock the API client
const mockApiTasksList = vi.fn();

vi.mock("../../../../api/client", () => ({
  useGeneratedApiClient: () => ({
    api: {
      apiTasksList: mockApiTasksList,
    },
  }),
}));

describe("Upcoming Page Data Flow", () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    mockApiTasksList.mockReset();
  });

  it("should call API with correct date range parameters", async () => {
    const { useTasks } = await import("../../../../api/hooks/useTasks");

    // Mock successful API response
    mockApiTasksList.mockResolvedValue({
      data: {
        results: [],
        count: 0,
        next: null,
        previous: null,
      },
    });

    // Test the exact pattern used by UpcomingViewList and UpcomingViewBoard
    const startDate = dayjs().add(1, "day"); // Tomorrow
    const endDate = dayjs().add(7, "days"); // Next week

    const { result } = renderHook(() => useTasks(startDate, endDate), {
      wrapper,
    });

    // Wait for the hook to make the API call
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify API was called with correct parameters
    expect(mockApiTasksList).toHaveBeenCalledWith({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    });
  });

  it("should return tasks from API response", async () => {
    const { useTasks } = await import("../../../../api/hooks/useTasks");

    // Mock API response with tasks
    const mockTasks = [
      {
        id: 1,
        title: "Tomorrow Task",
        due_date: "2024-12-25T09:00:00.000Z",
        dtstart: "2024-12-25T09:00:00.000Z",
        rrule: "FREQ=DAILY;COUNT=1",
        section: 1,
        project: 1,
        completion_date: null,
        created_at: "2024-12-20T10:00:00.000Z",
        updated_at: "2024-12-20T10:00:00.000Z",
        description: "",
        priority: 1,
        tags: [],
        order: 1,
      },
    ];

    mockApiTasksList.mockResolvedValue({
      data: {
        results: mockTasks,
        count: 1,
        next: null,
        previous: null,
      },
    });

    const startDate = dayjs().add(1, "day");
    const endDate = dayjs().add(7, "days");

    const { result } = renderHook(() => useTasks(startDate, endDate), {
      wrapper,
    });

    // Wait for the query to resolve
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify the hook returns the transformed data
    expect(result.current.data?.results).toHaveLength(1);
    expect(result.current.data?.results[0].title).toBe("Tomorrow Task");
    expect(result.current.data?.results[0].due_date).toBe(
      "2024-12-25T09:00:00.000Z",
    );
  });

  it("should verify the exact query key pattern used by upcoming page", async () => {
    const { useTasks } = await import("../../../../api/hooks/useTasks");

    mockApiTasksList.mockResolvedValue({
      data: { results: [], count: 0, next: null, previous: null },
    });

    const startDate = dayjs("2024-12-25");
    const endDate = dayjs("2024-12-31");

    renderHook(() => useTasks(startDate, endDate), { wrapper });

    // The query key should be in the format: ["tasks", { start: "YYYY-MM-DD", end: "YYYY-MM-DD" }]
    // This is what our cache invalidation logic targets
    const queries = queryClient.getQueryCache().getAll();
    const taskQuery = queries.find(
      (q) =>
        q.queryKey[0] === "tasks" &&
        typeof q.queryKey[1] === "object" &&
        "start" in q.queryKey[1] &&
        "end" in q.queryKey[1],
    );

    expect(taskQuery).toBeDefined();
    expect(taskQuery?.queryKey).toEqual([
      "tasks",
      { start: "2024-12-25", end: "2024-12-31" },
    ]);
  });
});
