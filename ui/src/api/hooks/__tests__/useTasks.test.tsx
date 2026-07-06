import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import React from "react";
import toast from "react-hot-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGeneratedApiClient } from "../../client";
import {
  useAddTask,
  useReorderTasks,
  useTask,
  useTasksToday,
} from "../useTasks";

// Mock the generated API client
vi.mock("../../client", () => ({
  useGeneratedApiClient: vi.fn(),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock slugify utility
vi.mock("../../../modules/shared/utils", () => ({
  slugify: vi.fn((str: string) => str.toLowerCase().replace(/\s+/g, "-")),
}));

const mockApiClient = {
  api: {
    apiTasksList: vi.fn(),
    apiTasksRetrieve: vi.fn(),
    apiTasksCreate: vi.fn(),
    apiTasksPartialUpdate: vi.fn(),
    apiTasksDestroy: vi.fn(),
    apiTasksDuplicateCreate: vi.fn(),
    apiTasksBulkUpdateUpdate: vi.fn(),
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = "TestWrapper";

  return TestWrapper;
};

describe("Task Hooks - Generated API Migration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useGeneratedApiClient as ReturnType<typeof vi.fn>).mockReturnValue(
      mockApiClient,
    );
  });

  describe("useTasksToday", () => {
    it("should fetch today's tasks using generated API", async () => {
      const mockTasks = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Test Task 1",
            section: 1,
            project: 1,
            project_title: "Test Project",
            section_title: "Test Section",
            tags: ["work"],
            order: 0,
            rrule: null,
            dtstart: "2024-01-01T10:00:00Z",
            anchor_mode: "SCHEDULED",
            comments_count: "2",
            due_date: "2024-01-01",
            completion_date: null,
            description: "Test description",
            priority: "HIGH",
          },
        ],
      };

      mockApiClient.api.apiTasksList.mockResolvedValue({ data: mockTasks });

      const { result } = renderHook(() => useTasksToday(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.api.apiTasksList).toHaveBeenCalledWith({
        today: true,
      });

      expect(result.current.data).toEqual({
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Test Task 1",
            section: 1,
            project: 1,
            project_title: "Test Project",
            section_title: "Test Section",
            tags: ["work"],
            order: 0,
            rrule: null,
            dtstart: dayjs("2024-01-01T10:00:00Z"), // Should be converted to Dayjs
            anchor_mode: "SCHEDULED",
            comments_count: 2, // Should be converted to number
            due_date: "2024-01-01",
            completion_date: null,
            description: "Test description",
            priority: "HIGH",
          },
        ],
      });
    });

    it("should handle API errors gracefully", async () => {
      mockApiClient.api.apiTasksList.mockRejectedValue(new Error("API Error"));

      const { result } = renderHook(() => useTasksToday(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(new Error("API Error"));
    });
  });

  describe("useTask", () => {
    it("should fetch a single task by ID", async () => {
      const mockTask = {
        id: 1,
        title: "Test Task",
        section: 1,
        project: 1,
        project_title: "Test Project",
        section_title: "Test Section",
        tags: ["work"],
        order: 0,
        rrule: null,
        dtstart: "2024-01-01T10:00:00Z",
        anchor_mode: "SCHEDULED",
        comments_count: "0",
        due_date: "2024-01-01",
        completion_date: null,
        description: "Test description",
        priority: "MEDIUM",
      };

      mockApiClient.api.apiTasksRetrieve.mockResolvedValue({ data: mockTask });

      const { result } = renderHook(() => useTask(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.api.apiTasksRetrieve).toHaveBeenCalledWith({
        id: 1,
      });

      expect(result.current.data).toEqual({
        id: 1,
        title: "Test Task",
        section: 1,
        project: 1,
        project_title: "Test Project",
        section_title: "Test Section",
        tags: ["work"],
        order: 0,
        rrule: null,
        dtstart: dayjs("2024-01-01T10:00:00Z"),
        anchor_mode: "SCHEDULED",
        comments_count: 0, // Converted to number
        due_date: "2024-01-01",
        completion_date: null,
        description: "Test description",
        priority: "MEDIUM",
      });
    });

    it("should not fetch when taskId is null", () => {
      const { result } = renderHook(() => useTask(null), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(mockApiClient.api.apiTasksRetrieve).not.toHaveBeenCalled();
    });
  });

  describe("useAddTask", () => {
    it("should create a new task with proper data transformation", async () => {
      const mockCreatedTask = {
        id: 2,
        title: "New Task",
        section: 1,
        project: 1,
        project_title: "Test Project",
        section_title: "Test Section",
        tags: ["new"],
        order: 1,
        rrule: null,
        dtstart: "2024-01-02T10:00:00Z",
        anchor_mode: "SCHEDULED",
        comments_count: "0",
        due_date: "2024-01-02",
        completion_date: null,
        description: "New task description",
        priority: "LOW",
      };

      mockApiClient.api.apiTasksCreate.mockResolvedValue({
        data: mockCreatedTask,
      });

      const { result } = renderHook(
        () => useAddTask({ projectId: 1, belowTaskId: 1 }),
        {
          wrapper: createWrapper(),
        },
      );

      const taskFormData = {
        title: "New Task",
        description: "New task description",
        section: 1,
        project: 1,
        priority: "LOW" as const,
        tags: ["new"],
        dtstart: dayjs("2024-01-02T10:00:00Z"),
        due_date: dayjs("2024-01-02"),
        rrule: null,
        anchor_mode: "SCHEDULED" as const,
      };

      result.current.mutate(taskFormData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.api.apiTasksCreate).toHaveBeenCalledWith({
        taskRequest: {
          title: "New Task",
          description: "New task description",
          section: 1,
          priority: "LOW",
          tags: ["new"],
          rrule: undefined,
          anchor_mode: "SCHEDULED",
          dtstart: "2024-01-02T10:00:00.000Z", // Converted to ISO string
          due_date: "2024-01-02", // Converted to date string
          completion_date: undefined,
          below_task: 1, // Positioning option
          above_task: undefined,
        },
      });

      expect(result.current.data).toEqual({
        id: 2,
        title: "New Task",
        section: 1,
        project: 1,
        project_title: "Test Project",
        section_title: "Test Section",
        tags: ["new"],
        order: 1,
        rrule: null,
        dtstart: dayjs("2024-01-02T10:00:00Z"), // Converted back to Dayjs
        anchor_mode: "SCHEDULED",
        comments_count: 0, // Converted to number
        due_date: "2024-01-02",
        completion_date: null,
        description: "New task description",
        priority: "LOW",
      });
    });
  });

  describe("useReorderTasks", () => {
    it("does not emit a success toast on successful reorder", async () => {
      const updatedTask = {
        id: 10,
        title: "Task A",
        section: 2,
        project: 1,
        project_title: "Test Project",
        section_title: "Doing",
        tags: [],
        order: 1,
        rrule: null,
        dtstart: null,
        anchor_mode: "SCHEDULED",
        comments_count: "0",
        due_date: null,
        completion_date: null,
        description: null,
        priority: "LOW",
      };

      mockApiClient.api.apiTasksPartialUpdate.mockResolvedValue({
        data: updatedTask,
      });

      const { result } = renderHook(() => useReorderTasks(1), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync({
          sourceSectionId: 1,
          destinationSectionId: 2,
          reorderedSourceTasks: [],
          reorderedDestinationTasks: [],
          task: {
            id: 10,
            title: "Task A",
            completion_date: null,
            description: null,
            priority: "LOW",
            section: 2,
            project: 1,
            project_title: "Test Project",
            section_title: "Doing",
            tags: [],
            order: 1,
            rrule: null,
            dtstart: null,
            anchor_mode: "SCHEDULED",
            comments_count: 0,
            due_date: null,
          },
        });
      });

      expect(mockApiClient.api.apiTasksPartialUpdate).toHaveBeenCalledTimes(1);
      expect(toast.success).not.toHaveBeenCalled();
      expect(toast.error).not.toHaveBeenCalled();
    });
  });
});
