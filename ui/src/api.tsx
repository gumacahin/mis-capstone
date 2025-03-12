// apiClient.js
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";

import { IComment, ITask } from "./types/common";

const useApiClient = () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const apiClient = axios.create({
    baseURL: "http://localhost:5173/api/",
  });

  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        if (error instanceof Error && error.message === "login_required") {
          loginWithRedirect();
        }
        console.error("Error getting access token", error);
      }
      return config;
    },
    // eslint-disable-next-line
    (error) => Promise.reject(error),
  );

  return apiClient;
};

export const useAuth = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await apiClient.get("users/me/");
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

export const useInboxTasks = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["tasks", "inbox"],
    queryFn: async () => {
      const { data } = await apiClient.get("tasks/?inbox=1");
      return data;
    },
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

export const useAddTask = () => {
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
    },
  });
};

export const useUpdateTask = (task: ITask) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTask", { taskId: task.id }],
    mutationFn: async (updatedTask: ITask) => {
      const result = await apiClient.put(`/tasks/${task.id}/`, updatedTask);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", { task }] });
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
