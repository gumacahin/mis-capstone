// apiClient.js
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useMutation } from '@tanstack/react-query';

const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();

  const apiClient = axios.create({
    baseURL: 'http://localhost:5173/api/',
  });

  apiClient.interceptors.request.use(async (config) => {
    try {
      const token = await getAccessTokenSilently();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting access token', error);
    }
    return config;
  }, (error) => Promise.reject(error));

  return apiClient;
};

export const useAuth = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await apiClient.get('users/me/');
      return data
    },
  });
};

export const useTasksToday = () => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data } = await apiClient.get('tasks/');
      return data
    },
  });
}

export const useAddTask = () => {
  const apiClient = useApiClient();
  return useMutation({
    mutationKey: ['addTask'],
    mutationFn: async (task: any) => {
        const response = await apiClient.post('/tasks/', task);
        return response.data;
        // await fetch('/api/tasks/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${AUTH0_ACCESS_KEY}`, // Added Bearer auth header
        //     },
        //     body: JSON.stringify(task),
        // });
    },
  });
};
