import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";

import type {
  IComment,
  IPaginatedResponse,
  IProject,
  IProjectDetail,
  ISection,
  ITask,
  ProjectViewType,
} from "./types/common";

const useApiClient = () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const apiClient = axios.create({
    baseURL: "http://localhost:3000/api/",
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

export const useLabels = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["labels"],
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

export const useTask = (task: ITask) => {
  const apiClient = useApiClient();
  return useQuery({
    initialData: task,
    queryKey: ["task", { task }],
    queryFn: async () => {
      const { data } = await apiClient.get(`tasks/${task.id}/`);
      return data;
    },
  });
};

export const useTasks = (start: Date, end: Date) => {
  const apiClient = useApiClient();
  const startStr = dayjs(start).format("YYYY-MM-DD");
  const endStr = dayjs(end).format("YYYY-MM-DD");
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

export const useAddTask = (projectId: number) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addTask"],
    mutationFn: async (task: ITask) => {
      const response = await apiClient.post("/tasks/", task);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
    },
  });
};

export const useUpdateTask = (task: ITask, project: IProjectDetail | null) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const taskId = task.id;
  const projectId = project?.id;
  return useMutation({
    mutationKey: ["updateTask", { taskId }],
    mutationFn: async (updatedTask: Partial<ITask>) => {
      const result = await apiClient.patch(`/tasks/${task.id}/`, updatedTask);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", { taskId }] });
    },
  });
};

export const useAddComment = (task: ITask) => {
  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addComment"],
    mutationFn: async (comment: IComment) => {
      const response = await apiClient.post("/comments/", comment);
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { taskId: task.id }],
      });
    },
  });
};

export const useComments = (task: ITask) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["comments", { taskId: task.id }],
    queryFn: async () => {
      const { data } = await apiClient.get(`comments/?task_id=${task.id}`);
      return data;
    },
  });
};

export const useDeleteComment = (comment: IComment) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteComment", { commentId: comment.id }],
    mutationFn: async () => {
      const result = await apiClient.delete(
        `/comments/${comment.id}/?task_id=${comment.task_id}`,
      );
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { commentId: comment.task_id }],
      });
    },
  });
};

export const useUpdateComment = (comment: IComment) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateComment", { commentId: comment.id }],
    mutationFn: async (updatedComment: IComment) => {
      const result = await apiClient.put(
        `/comments/${comment.id}/?task_id=${comment.task_id}`,
        updatedComment,
      );
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", { taskId: comment.task_id }],
      });
    },
  });
};

export const useRescheduleTasks = (tasks: ITask[]) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [
      "rescheduleTasks",
      { taskIds: tasks.map((task: ITask) => task.id) },
    ],
    mutationFn: async (rescheduledTasks: ITask[]) => {
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

export const useDeleteTask = (task: ITask) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteTask", { taskId: task.id }],
    mutationFn: async () => {
      const result = await apiClient.delete(`/tasks/${task.id}/`);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
      const { data } = await apiClient.get(`/projects/${projectId}`);
      return data as IProject;
    },
    // FIXME: we will fix this when we migrate to tanstack/router
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
      project: IProject & {
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
    mutationFn: async (data: Partial<IProject>) => {
      const result = await apiClient.patch(`/projects/${projectId}/`, data);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
    },
  });
};

export const useDeleteProject = (project: IProject) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteProject", { projectId: project.id }],
    mutationFn: async () => {
      const result = await apiClient.delete(`/projects/${project.id}/`);
      return result.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      queryClient.setQueryData(
        ["projects"],
        (oldProjects: IPaginatedResponse<IProject> | undefined) => {
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

export const useUpdateProjectView = (project: IProjectDetail) => {
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
    onMutate: async (view: ProjectViewType) => {
      await queryClient.cancelQueries({ queryKey: ["project"] });
      queryClient.setQueryData(["project", { projectId }], {
        ...project,
        view,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAddSection = (preceedingSection: ISection) => {
  const projectId = preceedingSection.project;

  const queryClient = useQueryClient();
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addSection", { projectId }],
    mutationFn: async (project: Partial<ISection>) => {
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["project", { projectId }] });
      queryClient.setQueryData(
        ["project", { projectId }],
        (project: IProject) => {
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
    mutationFn: async (data: Partial<ISection>) => {
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
