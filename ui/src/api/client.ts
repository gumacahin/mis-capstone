import { useAuth0 } from "@auth0/auth0-react";

import { ApiAdminApi, ApiApi } from "../generated-api-client/api";
import { Configuration } from "../generated-api-client/configuration";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const useGeneratedApiClient = () => {
  const { getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const configuration = new Configuration({
    basePath: API_BASE_URL,
    accessToken: async () => {
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        if (error instanceof Error && error.message === "Login required") {
          await loginWithRedirect();
          throw error;
        } else {
          console.error("Failed to get access token:", error);
          throw error;
        }
      }
    },
  });

  return {
    // Main API endpoints
    api: new ApiApi(configuration),

    // Admin API endpoints
    admin: new ApiAdminApi(configuration),

    // Direct access to configuration for custom requests
    configuration,
  };
};

// Export types for convenience
export type { Configuration } from "../generated-api-client/configuration";
export * from "../generated-api-client/models";
