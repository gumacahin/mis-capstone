import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs, { type Dayjs } from "dayjs";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import type {
  Comment,
  PaginatedResponse,
  Profile,
  Project,
  ProjectDetail,
  ProjectViewType,
  Section,
  Tag,
  Task,
  TaskFormFields,
} from "../types/common";
import { slugify } from "../utils";

export const useApiClient = () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
  });

  apiClient.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      if (error instanceof Error && error.message === "Login required") {
        await loginWithRedirect();
      } else {
        console.error("Unexpected error getting access token", error);
      }
    }
    return config;
  });

  return apiClient;
};

export const useProfile = (enabled: boolean = true) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await apiClient.get("users/me/");
      return data;
    },
    enabled,
  });
};

export const useUpdateProfile = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateOptions"],
    mutationFn: async (data: Partial<Profile>) => {
      void apiClient.patch("users/options/", data);
    },
    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], (profile: Profile) => ({
        ...profile,
        ...data,
      }));
    },
  });
};

export const useTags = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await apiClient.get("tags/");
      return data;
    },
  });
};

export const useTasksToday = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["tasks", "today"],
    queryFn: async () => {
      const { data } = await apiClient.get("tasks/?today=1");
      return data;
    },
  });
};

export const useInboxTasks = (projectId?: number) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["project", { projectId }],
    queryFn: async () => {
      const { data } = await apiClient.get(`projects/${projectId}/`);
      return data;
    },
    enabled: !!projectId,
  });
};

export const useUpcomingTasks = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["tasks", "upcoming"],
    queryFn: async () => {
      const { data } = await apiClient.get("tasks/?upcoming=1");
      return data;
    },
  });
};

export const useTask = (
  taskOrId: Task | number | null,
  enabled: boolean = true,
) => {
  const apiClient = useApiClient();
  const taskId = typeof taskOrId === "number" ? taskOrId : taskOrId?.id;

  return useQuery({
    initialData: typeof taskOrId === "object" ? taskOrId : undefined,
    queryKey: ["task", { taskId }],
    queryFn: async () => {
      const { data } = await apiClient.get(`tasks/${taskId}/`);
      return data;
    },
    enabled: !!taskId && enabled,
  });
};

export const useTasks = (start: Dayjs, end: Dayjs) => {
  const apiClient = useApiClient();
  const startStr = start.format("YYYY-MM-DD");
  const endStr = end.format("YYYY-MM-DD");
  return useQuery({
    queryKey: ["tasks", { start: startStr, end: endStr }],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `tasks/?start_date=${startStr}&end_date=${endStr}`,
      );
      return data;
    },
  });
};

export const useAddTask = ({
  projectId,
  belowTaskId,
  aboveTaskId,
}: {
  projectId: number;
  belowTaskId?: number;
  aboveTaskId?: number;
}) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addTask"],
    mutationFn: async (task: Partial<TaskFormFields>) => {
      const data = {
        ...task,
        below_task: belowTaskId,
        above_task: aboveTaskId,
        ...(dayjs.isDayjs(task.due_date) && {
          due_date: task.due_date.format("YYYY-MM-DD"),
        }),
      };
      const response = await apiClient.post("/tasks/", data);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
      queryClient.invalidateQueries({ queryKey: ["tag"] });
    },
  });
};

export const useUpdateTask = (task?: Task) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const taskId = task?.id;
  const projectId = task?.project;
  return useMutation({
    mutationKey: ["updateTask", { taskId }],
    mutationFn: async (updatedTask: Partial<TaskFormFields>) => {
      const data = {
        ...updatedTask,
        ...(dayjs.isDayjs(updatedTask.completion_date) && {
          completion_date: updatedTask.completion_date.format("YYYY-MM-DD"),
        }),
        ...(dayjs.isDayjs(updatedTask.due_date) && {
          due_date: updatedTask.due_date.format("YYYY-MM-DD"),
        }),
      };

      const result = await apiClient.patch(`/tasks/${taskId}/`, data);
      return result.data;
    },
    onMutate: (updatedTask: Partial<TaskFormFields>) => {
      queryClient.cancelQueries({ queryKey: ["task", { taskId }] });
      queryClient.setQueryData(["task", { taskId }], (task: Task) => ({
        ...task,
        ...updatedTask,
      }));
    },
    onSettled: (data, __, vars) => {
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", { taskId }] });
      if (vars.tags) {
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      }

      if (data.tags) {
        for (const tagName of data.tags) {
          queryClient.invalidateQueries({
            queryKey: ["tag", { slug: slugify(tagName) }],
          });
        }
      }
    },
  });
};

export const useRescheduleTask = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["rescheduleTask"],
    mutationFn: async ({ task, dueDate }: { task: Task; dueDate: Dayjs }) => {
      const data = {
        due_date: dueDate.format("YYYY-MM-DD"),
      };
      const taskId = task.id;
      const result = await apiClient.patch(`/tasks/${taskId}/`, data);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useReorderTasks = (projectId: number) => {
  const apiClient = useApiClient();
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
      const data = {
        task_id: task.id,
        order: task.order,
        section: task.section,
        source_section: sourceSectionId,
      };
      const response = await apiClient.patch(`/tasks/${task.id}/`, data);
      return response.data;
    },
    onMutate: ({
      sourceSectionId,
      reorderedSourceTasks,
      destinationSectionId,
      reorderedDestinationTasks,
    }: {
      task: Task;
      sourceSectionId: number;
      reorderedSourceTasks: Task[];
      destinationSectionId: number;
      reorderedDestinationTasks: Task[];
    }) => {
      queryClient.cancelQueries({ queryKey: ["project", { projectId }] });
      queryClient.setQueryData(
        ["project", { projectId }],
        (project: ProjectDetail) => {
          const sourceSectionIndex = project.sections.findIndex(
            (s) => s.id === sourceSectionId,
          );
          const destinationSectionIndex = project.sections.findIndex(
            (s) => s.id === destinationSectionId,
          );
          project.sections[sourceSectionIndex].tasks = reorderedSourceTasks;
          project.sections[destinationSectionIndex].tasks =
            reorderedDestinationTasks;
          return project;
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
    },
  });
};

export const useAddComment = (task: Task) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addComment"],
    mutationFn: async (comment: Comment) => {
      const data = {
        ...comment,
        content_type: "upoutodo.task",
        object_pk: task.id,
      };
      const response = await apiClient.post("/comments/", data);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { taskId: task.id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tag"],
      });
    },
  });
};

export const useComments = (task: Task) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["comments", { taskId: task.id }],
    queryFn: async () => {
      const { data } = await apiClient.get(`comments/?task=${task.id}`);
      return data;
    },
  });
};

export const useDeleteComment = (comment: Comment) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteComment", { commentId: comment.id }],
    mutationFn: async () => {
      const result = await apiClient.delete(
        `/comments/${comment.id}/?task_id=${comment.object_pk}`,
      );
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { taskId: parseInt(`${comment.object_pk}`) }],
      });
    },
  });
};

export const useUpdateComment = (comment: Comment) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateComment", { commentId: comment.id }],
    mutationFn: async (updatedComment: Comment) => {
      const data = {
        ...comment,
        ...updatedComment,
      };
      const result = await apiClient.put(`/comments/${comment.id}/`, data);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { taskId: parseInt(`${comment.object_pk}`) }],
      });
    },
  });
};

export const useRescheduleTasks = (tasks: Task[]) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [
      "rescheduleTasks",
      { taskIds: tasks.map((task: Task) => task.id) },
    ],
    mutationFn: async (rescheduledTasks: Task[]) => {
      const result = await apiClient.put(
        `/tasks/bulk_update/`,
        rescheduledTasks,
      );
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = (task: Task) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteTask", { taskId: task.id }],
    mutationFn: async () => {
      const result = await apiClient.delete(`/tasks/${task.id}/`);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId: task.project }],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      for (const tag of task.tags) {
        queryClient.invalidateQueries({
          queryKey: ["tag", { slug: slugify(tag) }],
        });
      }
    },
  });
};

export const useProjects = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projects/`);
      return data;
    },
  });
};

export const useProject = (projectId: number) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["project", { projectId }],
    queryFn: async () => {
      const { data } = await apiClient.get(`/projects/${projectId}/`);
      return data as ProjectDetail;
    },
    enabled: !!projectId,
  });
};

export const useAddProject = (
  referenceProjectId?: number,
  position?: "above" | "below",
) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addProject"],
    mutationFn: async (
      project: Partial<Project> & {
        above_project_id?: number;
        below_project_id?: number;
      },
    ) => {
      if (position === "above") {
        project["above_project_id"] = referenceProjectId;
      } else if (position === "below") {
        project["below_project_id"] = referenceProjectId;
      }
      const response = await apiClient.post("/projects/", project);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = (projectId: number) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateProject", { projectId }],
    mutationFn: async (data: Partial<Project>) => {
      const result = await apiClient.patch(`/projects/${projectId}/`, data);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
    },
  });
};

export const useReorderProjects = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["reorderProjects"],
    mutationFn: async (projects: Partial<Project>[]) => {
      const data = projects.map((project) => ({
        id: project.id,
        order: project.order,
      }));
      const result = await apiClient.put(`/projects/bulk_update/`, data);
      return result.data;
    },
    onMutate: async (reorderedProjects: Project[]) => {
      queryClient.cancelQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(
        ["projects"],
        (oldData: PaginatedResponse<Project>) => ({
          ...oldData,
          results: reorderedProjects,
        }),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = (project: ProjectDetail) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteProject", { projectId: project.id }],
    mutationFn: async () => {
      const result = await apiClient.delete(`/projects/${project.id}/`);
      return result.data;
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(
        ["projects"],
        (oldProjects: PaginatedResponse<Project> | undefined) => {
          const newProjects = oldProjects?.results.filter(
            (p) => p.id !== project.id,
          );
          return { ...oldProjects, results: newProjects };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProjectView = (project: ProjectDetail) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  const projectId = project.id;
  return useMutation({
    mutationKey: ["updateProjectView", { projectId }],
    mutationFn: async (view: ProjectViewType) => {
      const response = await apiClient.patch(`/projects/${projectId}/`, {
        view,
      });
      return response.data;
    },
    onMutate: (view: ProjectViewType) => {
      queryClient.cancelQueries({ queryKey: ["project"] });
      queryClient.setQueryData(
        ["project", { projectId }],
        (oldProject: ProjectDetail | undefined) => {
          if (!oldProject) {
            return oldProject;
          }
          return {
            ...oldProject,
            view,
          };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAddSection = (preceedingSection: Section) => {
  const projectId = preceedingSection.project;

  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addSection", { projectId }],
    mutationFn: async (project: Partial<Section>) => {
      const data = {
        title: project.title,
        project: projectId,
        preceding_section: preceedingSection.id,
      };
      const response = await apiClient.post("/project_sections/", data);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useDeleteSection = (projectId: number, sectionId: number) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteSection", { sectionId }],
    mutationFn: async () => {
      const result = await apiClient.delete(`/project_sections/${sectionId}/`);
      return result.data;
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["project", { projectId }] });
      queryClient.setQueryData(
        ["project", { projectId }],
        (project: Project) => {
          const newProject = {
            ...project,
            sections: project.sections.filter(
              (s: { id: number }) => s.id !== sectionId,
            ),
          };
          return newProject;
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
    },
  });
};

export const useUpdateSection = (projectId: number, sectionId: number) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateSection", { sectionId }],
    mutationFn: async (data: Partial<Section>) => {
      const result = await apiClient.patch(
        `/project_sections/${sectionId}/`,
        data,
      );
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
    },
  });
};

export const useReorderSections = (projectId: number) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["reorderSections"],
    mutationFn: async (sections: Section[]) => {
      const data = sections.map((section) => ({
        id: section.id,
        order: section.order,
      }));
      const result = await apiClient.put(
        `/project_sections/bulk_update/`,
        data,
      );
      return result.data;
    },
    onMutate: async (reorderedSections: Section[]) => {
      queryClient.setQueryData(
        ["project", { projectId }],
        (oldData: Partial<ProjectDetail> | undefined) => {
          if (!oldData) {
            return oldData;
          }
          const inbox = oldData.sections!.find((s) => s.is_default);
          return {
            ...oldData,
            sections: [inbox, ...reorderedSections],
          };
        },
      );
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export function useMoveSection(sectionId: number, currentProjectId: number) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["moveSection", { sectionId }],
    mutationFn: async (destinationProjectId: number) => {
      const result = await apiClient.patch(`/project_sections/${sectionId}/`, {
        project: destinationProjectId,
        source_project: currentProjectId,
      });
      return result.data;
    },
    onSettled: (destinationProjectId: number | undefined) => {
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId: currentProjectId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId: destinationProjectId }],
      });
    },
  });
}

export function useDuplicateSection(sectionId: number, projectId: number) {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["duplicateSection", { sectionId }],
    mutationFn: async () => {
      const result = await apiClient.post(
        `/project_sections/${sectionId}/duplicate/`,
      );
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId }],
      });
    },
  });
}

export const useLabel = (slug: string) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["tag", { slug }],
    queryFn: async () => {
      const { data } = await apiClient.get(`tags/${slug}/`);
      return data;
    },
  });
};

export const useAddTag = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addTag"],
    mutationFn: async (name: string) => {
      return await apiClient.post(`tags/`, { name });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteLabel = (label: Tag) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const slug = slugify(label.name);
  return useMutation({
    mutationKey: ["deleteLabel", { slug }],
    mutationFn: async () => {
      const result = await apiClient.delete(`/tags/${slug}/`);
      return result.data;
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["tags"] });
      queryClient.setQueryData(
        ["tags"],
        (oldTags: PaginatedResponse<Tag> | undefined) => {
          const newTags = oldTags?.results.filter((t) => t.name !== label.name);
          return { ...oldTags, results: newTags };
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateLabel = (label: Tag) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const slug = slugify(label.name);
  return useMutation({
    mutationKey: ["updateLabel", { slug }],
    mutationFn: async (data: Partial<Tag>) => {
      const result = await apiClient.patch(`/tags/${slug}/`, data);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag", { slug }] });
    },
  });
};

export function useDuplicateTask(task: Task) {
  const taskId = task.id;
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["duplicateTask", { taskId }],
    mutationFn: async () => {
      const result = await apiClient.post(`/tasks/${taskId}/duplicate/`);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", { projectId: task.project }],
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", { taskId }] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag"] });
    },
  });
}

export const useDashboard = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await apiClient.get("dashboard");
      return data;
    },
  });
};
