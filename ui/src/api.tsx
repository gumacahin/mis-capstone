// apiClient.js
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Task } from "./types/common";

const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();

  const apiClient = axios.create({
    baseURL: "http://localhost:5173/api/",
  });

  apiClient.interceptors.request.use(
    async (config) => {
      try {
        const token = await getAccessTokenSilently();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting access token", error);
      }
      return config;
    },
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
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await apiClient.get("tasks/");
      return data;
    },
  });
};

export const useAddTask = () => {
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ["addTask"],
    mutationFn: async (task: any) => {
      const response = await apiClient.post("/tasks/", task);
      return response.data;
    },
  });
};

export const useUpdateTask = (task: Task) => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateTask", { taskId: task.id }],
    mutationFn: async (updatedTask: Task) => {
      const result = await apiClient.put(`/tasks/${task.id}/`, updatedTask);
      return result.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
