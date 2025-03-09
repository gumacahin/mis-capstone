// apiClient.js
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

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

export default useApiClient;
