import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API client
const mockApiTasksCreate = vi.fn();
const mockApiTasksList = vi.fn();

vi.mock("../../client", () => ({
  useGeneratedApiClient: () => ({
    api: {
      apiTasksCreate: mockApiTasksCreate,
      apiTasksList: mockApiTasksList,
    },
  }),
}));

// Mock contexts that useAddTask depends on
vi.mock("../../../modules/shared/contexts/ProjectContext", () => ({
  useProject: () => ({ id: 1, title: "Test Project" }),
}));

vi.mock("../../../modules/shared/contexts/SectionContext", () => ({
  useSection: () => ({ id: 1, title: "Test Section" }),
}));

describe("Task Creation with Specific Dates", () => {
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

    // Reset mocks
    mockApiTasksCreate.mockReset();
    mockApiTasksList.mockReset();
  });

  it("should create task with correct due_date for tomorrow", async () => {
    const { useAddTask } = await import("../useTasks");

    const tomorrow = dayjs().add(1, "day");
    const expectedDueDate = tomorrow.startOf("day").toISOString();

    // Mock successful task creation
    mockApiTasksCreate.mockResolvedValue({
      data: {
        id: 123,
        title: "Tomorrow Task",
        due_date: expectedDueDate,
        dtstart: expectedDueDate,
        rrule: "FREQ=DAILY;COUNT=1",
      },
    });

    const { result } = renderHook(() => useAddTask({}), { wrapper });

    // Create task for tomorrow
    const taskData = {
      title: "Tomorrow Task",
      dtstart: tomorrow.startOf("day"),
      rrule: "FREQ=DAILY;COUNT=1",
    };

    await result.current.mutateAsync(taskData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the API was called with correct data structure
    expect(mockApiTasksCreate).toHaveBeenCalledWith({
      taskRequest: expect.objectContaining({
        title: "Tomorrow Task",
        dtstart: expectedDueDate,
        rrule: "FREQ=DAILY;COUNT=1",
        section: expect.any(Number),
      }),
    });

    // Verify the response has correct due_date
    expect(result.current.data?.due_date).toBe(expectedDueDate);

    // Most importantly: verify the date is correct for tomorrow
    const actualCall = mockApiTasksCreate.mock.calls[0][0];
    const sentDate = dayjs(actualCall.taskRequest.dtstart);
    const expectedDate = dayjs().add(1, "day").startOf("day");
    expect(sentDate.format("YYYY-MM-DD")).toBe(
      expectedDate.format("YYYY-MM-DD"),
    );
  });

  it("should create task with correct due_date for next week", async () => {
    const { useAddTask } = await import("../useTasks");

    const nextWeek = dayjs().add(1, "week");
    const expectedDueDate = nextWeek.startOf("day").toISOString();

    mockApiTasksCreate.mockResolvedValue({
      data: {
        id: 124,
        title: "Next Week Task",
        due_date: expectedDueDate,
        dtstart: expectedDueDate,
        rrule: "FREQ=DAILY;COUNT=1",
      },
    });

    const { result } = renderHook(() => useAddTask({}), { wrapper });

    const taskData = {
      title: "Next Week Task",
      dtstart: nextWeek.startOf("day"),
      rrule: "FREQ=DAILY;COUNT=1",
    };

    await result.current.mutateAsync(taskData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockApiTasksCreate).toHaveBeenCalledWith({
      taskRequest: expect.objectContaining({
        title: "Next Week Task",
        dtstart: expectedDueDate,
        rrule: "FREQ=DAILY;COUNT=1",
        section: expect.any(Number),
      }),
    });

    expect(result.current.data?.due_date).toBe(expectedDueDate);

    // Verify the date is correct for next week
    const actualCall = mockApiTasksCreate.mock.calls[0][0];
    const sentDate = dayjs(actualCall.taskRequest.dtstart);
    const expectedDate = dayjs().add(1, "week").startOf("day");
    expect(sentDate.format("YYYY-MM-DD")).toBe(
      expectedDate.format("YYYY-MM-DD"),
    );
  });

  it("should handle timezone correctly when creating tasks", async () => {
    const { useAddTask } = await import("../useTasks");

    // Create a task for a specific date in user's timezone
    const targetDate = dayjs("2024-12-25").startOf("day"); // Christmas
    const expectedDueDate = targetDate.toISOString();

    mockApiTasksCreate.mockResolvedValue({
      data: {
        id: 125,
        title: "Christmas Task",
        due_date: expectedDueDate,
        dtstart: expectedDueDate,
        rrule: "FREQ=DAILY;COUNT=1",
      },
    });

    const { result } = renderHook(() => useAddTask({}), { wrapper });

    const taskData = {
      title: "Christmas Task",
      dtstart: targetDate,
      rrule: "FREQ=DAILY;COUNT=1",
    };

    await result.current.mutateAsync(taskData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the date is preserved correctly
    expect(mockApiTasksCreate).toHaveBeenCalledWith({
      taskRequest: expect.objectContaining({
        title: "Christmas Task",
        dtstart: expectedDueDate,
        rrule: "FREQ=DAILY;COUNT=1",
        section: expect.any(Number),
      }),
    });

    // Verify the task has the correct due_date
    const createdTask = result.current.data;
    expect(createdTask?.due_date).toBe(expectedDueDate);

    // Verify the date matches what we intended
    expect(dayjs(createdTask?.due_date).format("YYYY-MM-DD")).toBe(
      "2024-12-25",
    );

    // Verify the actual sent date is correct
    const actualCall = mockApiTasksCreate.mock.calls[0][0];
    const sentDate = dayjs(actualCall.taskRequest.dtstart);
    expect(sentDate.format("YYYY-MM-DD")).toBe("2024-12-25");
  });
});
