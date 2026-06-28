import {
  type Query,
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import toast from "react-hot-toast";

import type {
  PatchedTaskRequest,
  PriorityEnum,
  TaskAnchorModeEnum,
  TaskRequest,
} from "../../generated-api-client/models";
import { slugify } from "../../modules/shared/utils";
import { useGeneratedApiClient } from "../client";
import type {
  PaginatedResponse,
  ProjectDetail,
  Task,
  TaskFormFields,
} from "../migration-helpers";

// ============================================================================
// EXTENDED TYPES FOR API COMPATIBILITY
// ============================================================================

// Extended TaskRequest to include due_date (missing from generated type)
interface ExtendedTaskRequest extends TaskRequest {
  due_date?: string | null;
}

// Extended PatchedTaskRequest to include due_date (missing from generated type)
interface ExtendedPatchedTaskRequest extends PatchedTaskRequest {
  due_date?: string | null;
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Transform generated API Task to frontend-compatible Task
 */
const transformTask = (apiTask: unknown): Task => {
  const task = apiTask as Record<string, unknown>;
  return {
    id: task.id as number,
    title: task.title as string,
    completion_date: task.completion_date as string | null,
    description: task.description as string | null,
    priority: task.priority as PriorityEnum,
    section: task.section as number,
    project: task.project as number,
    project_title: task.project_title as string,
    section_title: task.section_title as string | null,
    tags: (task.tags as string[]) || [],
    order: (task.order as number) || 0,
    rrule: task.rrule as string | null,
    // Convert ISO string to Dayjs for frontend compatibility
    dtstart: task.dtstart ? dayjs(task.dtstart as string) : null,
    anchor_mode: task.anchor_mode as TaskAnchorModeEnum,
    // Convert string to number for frontend compatibility
    comments_count: parseInt(task.comments_count as string) || 0,
    due_date: task.due_date as string | null,
  };
};

/**
 * Transform paginated response
 */
const transformPaginatedTasks = (
  apiResponse: unknown,
): PaginatedResponse<Task> => {
  const response = apiResponse as Record<string, unknown>;
  return {
    count: response.count as number,
    next: response.next as string | null,
    previous: response.previous as string | null,
    results: (response.results as unknown[])?.map(transformTask) || [],
  };
};

/**
 * Transform frontend TaskFormFields to API TaskRequest
 */
const transformTaskFormToRequest = (
  formData: Partial<TaskFormFields>,
  options?: {
    belowTaskId?: number;
    aboveTaskId?: number;
  },
): ExtendedTaskRequest => {
  return {
    title: formData.title || "",
    description: formData.description || undefined,
    section: formData.section || 0,
    priority: formData.priority,
    tags: formData.tags || [],
    rrule: formData.rrule || undefined,
    anchor_mode: formData.anchor_mode || undefined,
    // Convert Dayjs to ISO string for API
    dtstart: formData.dtstart ? formData.dtstart.toISOString() : undefined,
    // Handle legacy completion_date field name
    completion_date: dayjs.isDayjs(formData.completion_date)
      ? formData.completion_date.format("YYYY-MM-DD")
      : formData.completion_date || undefined,
    // Handle due_date
    due_date: dayjs.isDayjs(formData.due_date)
      ? formData.due_date.format("YYYY-MM-DD")
      : formData.due_date || undefined,
    // Task positioning
    below_task: options?.belowTaskId,
    above_task: options?.aboveTaskId,
  };
};

/**
 * Transform frontend TaskFormFields to API PatchedTaskRequest
 */
const transformTaskFormToPatchRequest = (
  formData: Partial<TaskFormFields> & { order?: number },
  options?: {
    sourceSectionId?: number;
  },
): ExtendedPatchedTaskRequest => {
  const request: ExtendedPatchedTaskRequest = {};

  if (formData.title !== undefined) request.title = formData.title;
  if (formData.description !== undefined)
    request.description = formData.description || undefined;
  if (formData.section !== undefined) request.section = formData.section;
  if (formData.priority !== undefined) request.priority = formData.priority;
  if (formData.tags !== undefined) request.tags = formData.tags;
  if (formData.rrule !== undefined) request.rrule = formData.rrule;
  if (formData.anchor_mode !== undefined)
    request.anchor_mode = formData.anchor_mode;
  if (formData.order !== undefined) request.order = formData.order;

  // Handle date transformations
  if (formData.dtstart !== undefined) {
    request.dtstart = formData.dtstart
      ? formData.dtstart.toISOString()
      : undefined;
  }
  if (formData.completion_date !== undefined) {
    request.completion_date = dayjs.isDayjs(formData.completion_date)
      ? formData.completion_date.format("YYYY-MM-DD")
      : formData.completion_date;
  }
  if (formData.due_date !== undefined) {
    request.due_date = dayjs.isDayjs(formData.due_date)
      ? formData.due_date.format("YYYY-MM-DD")
      : formData.due_date || undefined;
  }

  // Add source section for reordering
  if (options?.sourceSectionId !== undefined) {
    request.source_section = options.sourceSectionId;
  }

  return request;
};

/**
 * Task API Hooks using Generated OpenAPI Client
 *
 * Migrated from: ui/src/modules/shared/hooks/queries.ts
 * Uses: Generated API client instead of manual Axios calls
 */

// ============================================================================
// READ HOOKS (Queries)
// ============================================================================

/**
 * Fetch tasks for today
 */
export const useTasksToday = () => {
  const { api } = useGeneratedApiClient();

  return useQuery({
    queryKey: ["tasks", "today"],
    queryFn: async () => {
      const response = await api.apiTasksList({ today: true });
      return transformPaginatedTasks(response.data);
    },
  });
};

/**
 * Fetch upcoming tasks
 */
export const useUpcomingTasks = () => {
  const { api } = useGeneratedApiClient();

  return useQuery({
    queryKey: ["tasks", "upcoming"],
    queryFn: async () => {
      const response = await api.apiTasksList({ upcoming: true });
      return transformPaginatedTasks(response.data);
    },
  });
};

/**
 * Fetch a single task by ID
 */
export const useTask = (
  taskOrId: Task | number | null,
  enabled: boolean = true,
) => {
  const { api } = useGeneratedApiClient();
  const taskId = typeof taskOrId === "number" ? taskOrId : taskOrId?.id;

  return useQuery({
    initialData: typeof taskOrId === "object" ? taskOrId : undefined,
    queryKey: ["task", { taskId }],
    queryFn: async () => {
      if (!taskId) throw new Error("Task ID is required");
      const response = await api.apiTasksRetrieve({ id: taskId });
      return transformTask(response.data);
    },
    enabled: !!taskId && enabled,
  });
};

/**
 * Fetch tasks within a date range
 */
export const useTasks = (start: Dayjs, end: Dayjs) => {
  const { api } = useGeneratedApiClient();
  const startStr = start.format("YYYY-MM-DD");
  const endStr = end.format("YYYY-MM-DD");

  return useQuery({
    queryKey: ["tasks", { start: startStr, end: endStr }],
    queryFn: async () => {
      const response = await api.apiTasksList({
        startDate: startStr,
        endDate: endStr,
      });
      return transformPaginatedTasks(response.data);
    },
  });
};

/**
 * Transform generated API ProjectDetail to frontend-compatible ProjectDetail
 */
const transformProjectDetail = (apiProject: unknown): ProjectDetail => {
  const project = apiProject as Record<string, unknown>;

  // Transform sections from API format to frontend format
  const apiSections =
    (project.sections as Array<Record<string, unknown>>) || [];
  const sections = apiSections.map((section) => ({
    id: section.id as number,
    title: section.title as string,
    is_default: (section.is_default as boolean) || false,
    project: section.project as number,
    order: (section.order as number) || 0,
    tasks: [], // Tasks will be loaded separately if needed
  }));

  return {
    id: project.id as number,
    title: project.title as string,
    view: (project.view as "list" | "board") || "list", // Transform ViewEnum to specific type
    sections,
  };
};

/**
 * Fetch inbox tasks for a project (used by useInboxTasks)
 * Note: This actually fetches project details, but is used for inbox tasks
 */
export const useInboxTasks = (projectId?: number) => {
  const { api } = useGeneratedApiClient();

  return useQuery({
    queryKey: ["project", { projectId }],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const response = await api.apiProjectsRetrieve({ id: projectId });
      return transformProjectDetail(response.data); // Transform to frontend-compatible type
    },
    enabled: !!projectId,
  });
};

/**
 * Fetch tasks specifically for the inbox project
 */
export const useInboxTasksList = () => {
  const { api } = useGeneratedApiClient();

  return useQuery({
    queryKey: ["tasks", "inbox"],
    queryFn: async () => {
      const response = await api.apiTasksList({ inbox: true });
      return transformPaginatedTasks(response.data);
    },
  });
};

// ============================================================================
// CACHE INVALIDATION HELPERS
// ============================================================================

/**
 * Invalidate all task-related queries including date ranges
 */
const isTaskRangeQuery = (query: Query): boolean => {
  const [scope, range] = query.queryKey;
  return (
    scope === "tasks" &&
    typeof range === "object" &&
    range !== null &&
    "start" in range &&
    "end" in range
  );
};

const isTaskDateQuery = (query: Query): boolean => {
  const [scope, dateMarker, dateValue] = query.queryKey;
  return (
    scope === "tasks" && dateMarker === "date" && typeof dateValue === "string"
  );
};

const invalidateTaskQueries = (
  queryClient: QueryClient,
  additionalInvalidations?: () => void,
) => {
  // Invalidate basic task queries
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
  queryClient.invalidateQueries({ queryKey: ["tasks", "today"] });
  queryClient.invalidateQueries({ queryKey: ["tasks", "inbox"] });
  queryClient.invalidateQueries({ queryKey: ["tasks", "upcoming"] });

  // Invalidate all date range queries (for upcoming page: useTasks)
  queryClient.invalidateQueries({
    predicate: isTaskRangeQuery,
  });

  // Invalidate all single date queries (for useTasksDueOn)
  queryClient.invalidateQueries({
    predicate: isTaskDateQuery,
  });

  // Run any additional invalidations
  if (additionalInvalidations) {
    additionalInvalidations();
  }
};

// ============================================================================
// WRITE HOOKS (Mutations)
// ============================================================================

/**
 * Create a new task
 */
export const useAddTask = ({
  projectId,
  belowTaskId,
  aboveTaskId,
}: {
  projectId: number;
  belowTaskId?: number;
  aboveTaskId?: number;
}) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addTask"],
    mutationFn: async (task: Partial<TaskFormFields>) => {
      const taskRequest = transformTaskFormToRequest(task, {
        belowTaskId,
        aboveTaskId,
      });
      const response = await api.apiTasksCreate({ taskRequest });
      return transformTask(response.data);
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
    },
    onSettled: () => {
      invalidateTaskQueries(queryClient, () => {
        queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
        queryClient.invalidateQueries({ queryKey: ["tag"] });
      });
    },
  });
};

/**
 * Update an existing task
 */
export const useUpdateTask = (task?: Task) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();
  const taskId = task?.id;
  const projectId = task?.project;

  return useMutation({
    mutationKey: ["updateTask", { taskId }],
    mutationFn: async (updatedTask: Partial<TaskFormFields>) => {
      if (!taskId) throw new Error("Task ID is required");

      const patchedTaskRequest = transformTaskFormToPatchRequest(updatedTask);
      const response = await api.apiTasksPartialUpdate({
        id: taskId,
        patchedTaskRequest,
      });
      return transformTask(response.data);
    },
    onMutate: (updatedTask: Partial<TaskFormFields>) => {
      queryClient.cancelQueries({ queryKey: ["task", { taskId }] });
      queryClient.setQueryData(["task", { taskId }], (oldTask: Task) => ({
        ...oldTask,
        ...updatedTask,
      }));
    },
    onSuccess: (updatedTask) => {
      toast.success("Task updated successfully!");

      // Handle tag cache invalidation
      if (updatedTask.tags) {
        for (const tagName of updatedTask.tags) {
          queryClient.invalidateQueries({
            queryKey: ["tag", { slug: slugify(tagName) }],
          });
        }
      }
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    },
    onSettled: (_, __, variables) => {
      invalidateTaskQueries(queryClient, () => {
        queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
        queryClient.invalidateQueries({ queryKey: ["task", { taskId }] });
        if (variables.tags) {
          queryClient.invalidateQueries({ queryKey: ["tags"] });
        }
      });
    },
  });
};

/**
 * Reschedule a single task
 */
export const useRescheduleTask = () => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["rescheduleTask"],
    mutationFn: async ({ task, dueDate }: { task: Task; dueDate: Dayjs }) => {
      const patchedTaskRequest: ExtendedPatchedTaskRequest = {
        due_date: dueDate.format("YYYY-MM-DD"),
      };
      const response = await api.apiTasksPartialUpdate({
        id: task.id,
        patchedTaskRequest,
      });
      return transformTask(response.data);
    },
    onSuccess: () => {
      toast.success("Task rescheduled successfully!");
    },
    onError: (error) => {
      console.error("Failed to reschedule task:", error);
      toast.error("Failed to reschedule task");
    },
    onSettled: () => {
      invalidateTaskQueries(queryClient);
    },
  });
};

/**
 * Reorder tasks (move task between sections or within section)
 */
export const useReorderTasks = (projectId: number) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["projectReorderTask", { projectId }],
    mutationFn: async ({
      task,
      sourceSectionId,
    }: {
      task: Task;
      sourceSectionId: number;
      reorderedSourceTasks: Task[];
      destinationSectionId: number;
      reorderedDestinationTasks: Task[];
    }) => {
      const patchedTaskRequest = transformTaskFormToPatchRequest(
        {
          order: task.order,
          section: task.section,
        },
        { sourceSectionId },
      );

      const response = await api.apiTasksPartialUpdate({
        id: task.id,
        patchedTaskRequest,
      });
      return transformTask(response.data);
    },
    onMutate: ({
      sourceSectionId,
      reorderedSourceTasks,
      destinationSectionId,
      reorderedDestinationTasks,
    }) => {
      queryClient.cancelQueries({ queryKey: ["project", { projectId }] });
      queryClient.setQueryData(
        ["project", { projectId }],
        (project: { sections?: { id: number; tasks: Task[] }[] }) => {
          if (!project?.sections) return project;

          const sourceSectionIndex = project.sections.findIndex(
            (s) => s.id === sourceSectionId,
          );
          const destinationSectionIndex = project.sections.findIndex(
            (s) => s.id === destinationSectionId,
          );

          if (sourceSectionIndex >= 0) {
            project.sections[sourceSectionIndex].tasks = reorderedSourceTasks;
          }
          if (destinationSectionIndex >= 0) {
            project.sections[destinationSectionIndex].tasks =
              reorderedDestinationTasks;
          }

          return project;
        },
      );
    },
    onSuccess: () => {
      toast.success("Task moved successfully!");
    },
    onError: (error) => {
      console.error("Failed to reorder task:", error);
      toast.error("Failed to move task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
    },
  });
};

/**
 * Bulk reschedule multiple tasks
 */
export const useRescheduleTasks = (tasks: Task[]) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [
      "rescheduleTasks",
      { taskIds: tasks.map((task: Task) => task.id) },
    ],
    mutationFn: async (rescheduledTasks: Task[]) => {
      // For now, update tasks individually since bulk update API signature is unclear
      const results = await Promise.all(
        rescheduledTasks.map(async (task) => {
          const patchedTaskRequest: ExtendedPatchedTaskRequest = {
            due_date: task.due_date,
          };
          const response = await api.apiTasksPartialUpdate({
            id: task.id,
            patchedTaskRequest,
          });
          return response.data;
        }),
      );
      return results;
    },
    onSuccess: () => {
      toast.success("Tasks rescheduled successfully!");
    },
    onError: (error) => {
      console.error("Failed to reschedule tasks:", error);
      toast.error("Failed to reschedule tasks");
    },
    onSettled: () => {
      invalidateTaskQueries(queryClient);
    },
  });
};

/**
 * Delete a task
 */
export const useDeleteTask = (task: Task) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteTask", { taskId: task.id }],
    mutationFn: async () => {
      await api.apiTasksDestroy({ id: task.id });
      return task.id;
    },
    onSuccess: () => {
      toast.success("Task deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId: task.project }],
      });
      invalidateTaskQueries(queryClient);

      // Invalidate tag caches for all tags on this task
      for (const tag of task.tags) {
        queryClient.invalidateQueries({
          queryKey: ["tag", { slug: slugify(tag) }],
        });
      }
    },
  });
};

/**
 * Duplicate a task
 */
export const useDuplicateTask = (task: Task) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();
  const taskId = task.id;

  return useMutation({
    mutationKey: ["duplicateTask", { taskId }],
    mutationFn: async () => {
      // Note: The duplicate endpoint might need a task request body
      // This is a placeholder - check the actual API specification
      const response = await api.apiTasksDuplicateCreate({
        id: taskId,
        taskRequest: {
          title: task.title,
          section: task.section,
        },
      });
      return transformTask(response.data);
    },
    onSuccess: () => {
      toast.success("Task duplicated successfully!");
    },
    onError: (error) => {
      console.error("Failed to duplicate task:", error);
      toast.error("Failed to duplicate task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId: task.project }],
      });
      invalidateTaskQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["task", { taskId }] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag"] });
    },
  });
};

// TODO: Add more task-related hooks as needed:
// - useTaskComments (might be separate file)
// - useTaskHistory
// - etc.
