import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API client
vi.mock("../../../generated-api-client/api/api-api", () => ({
  ApiApi: vi.fn().mockImplementation(() => ({
    apiTasksList: vi.fn().mockResolvedValue({
      data: {
        results: [],
        count: 0,
        next: null,
        previous: null,
      },
    }),
    apiTasksCreate: vi.fn().mockResolvedValue({
      data: { id: 1, title: "Test Task" },
    }),
  })),
}));

vi.mock("../../client", () => ({
  useGeneratedApiClient: () => ({
    api: {
      apiTasksList: vi.fn().mockResolvedValue({
        data: {
          results: [],
          count: 0,
          next: null,
          previous: null,
        },
      }),
      apiTasksCreate: vi.fn().mockResolvedValue({
        data: { id: 1, title: "Test Task" },
      }),
    },
  }),
}));

describe("useTasks Cache Invalidation", () => {
  let queryClient: QueryClient;
  let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children);
  });

  it("should invalidate all task query patterns when task is created", async () => {
    const { useAddTask } = await import("../useTasks");

    // Spy on queryClient.invalidateQueries
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAddTask(), { wrapper });

    // Create a task
    await result.current.mutateAsync({
      title: "Test Task",
      dtstart: new Date().toISOString(),
      rrule: "FREQ=DAILY;COUNT=1",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify all query patterns are invalidated
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ["tasks"] });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["tasks", "today"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["tasks", "inbox"],
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["tasks", "upcoming"],
    });

    // Verify predicate-based invalidations are called
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      predicate: expect.any(Function),
    });

    // Test the predicate functions
    const predicateCalls = invalidateQueriesSpy.mock.calls.filter(
      (call) => call[0] && "predicate" in call[0],
    );

    expect(predicateCalls).toHaveLength(2); // One for date ranges, one for single dates

    // Test date range predicate (useTasks pattern)
    const dateRangePredicate = predicateCalls[0][0].predicate;
    expect(
      dateRangePredicate({
        queryKey: ["tasks", { start: "2024-01-01", end: "2024-01-07" }],
      }),
    ).toBe(true);
    expect(
      dateRangePredicate({
        queryKey: ["tasks", "today"],
      }),
    ).toBe(false);

    // Test single date predicate (useTasksDueOn pattern)
    const singleDatePredicate = predicateCalls[1][0].predicate;
    expect(
      singleDatePredicate({
        queryKey: ["tasks", "date", "2024-01-01"],
      }),
    ).toBe(true);
    expect(
      singleDatePredicate({
        queryKey: ["tasks", "today"],
      }),
    ).toBe(false);
  });

  it("should handle edge cases in predicate functions", () => {
    const { useAddTask } = require("../useTasks");

    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAddTask(), { wrapper });

    // Trigger invalidation
    result.current.mutate({
      title: "Test Task",
    });

    // Get the predicate functions
    const predicateCalls = invalidateQueriesSpy.mock.calls.filter(
      (call) => call[0] && "predicate" in call[0],
    );

    const dateRangePredicate = predicateCalls[0][0].predicate;
    const singleDatePredicate = predicateCalls[1][0].predicate;

    // Test edge cases for date range predicate
    expect(dateRangePredicate({ queryKey: ["tasks"] })).toBe(false);
    expect(dateRangePredicate({ queryKey: ["tasks", null] })).toBe(false);
    expect(dateRangePredicate({ queryKey: ["tasks", "string"] })).toBe(false);
    expect(
      dateRangePredicate({ queryKey: ["tasks", { start: "2024-01-01" }] }),
    ).toBe(false); // missing end
    expect(
      dateRangePredicate({ queryKey: ["tasks", { end: "2024-01-01" }] }),
    ).toBe(false); // missing start

    // Test edge cases for single date predicate
    expect(singleDatePredicate({ queryKey: ["tasks"] })).toBe(false);
    expect(singleDatePredicate({ queryKey: ["tasks", "date"] })).toBe(false); // missing date string
    expect(singleDatePredicate({ queryKey: ["tasks", "date", null] })).toBe(
      false,
    );
    expect(singleDatePredicate({ queryKey: ["tasks", "date", 123] })).toBe(
      false,
    ); // not a string
  });
});
