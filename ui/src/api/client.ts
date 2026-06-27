import { useAuth0 } from "@/components/AuthProviderWrapper";

import { PlannerApi, ProjectsApi, TasksApi } from "../generated-api-client/api";
import { Configuration } from "../generated-api-client/configuration";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window === "undefined"
    ? "http://localhost:3000"
    : window.location.origin);

class GeneratedApiCompatibility {
  constructor(
    private readonly projects: ProjectsApi,
    private readonly tasks: TasksApi,
  ) {}

  apiProjectsList(...args: Parameters<ProjectsApi["projectsList"]>) {
    return this.projects.projectsList(...args);
  }

  apiProjectsRetrieve(...args: Parameters<ProjectsApi["projectsRetrieve"]>) {
    return this.projects.projectsRetrieve(...args);
  }

  apiProjectsCreate(...args: Parameters<ProjectsApi["projectsCreate"]>) {
    return this.projects.projectsCreate(...args);
  }

  apiProjectsPartialUpdate(
    ...args: Parameters<ProjectsApi["projectsPartialUpdate"]>
  ) {
    return this.projects.projectsPartialUpdate(...args);
  }

  apiProjectsDestroy(...args: Parameters<ProjectsApi["projectsDestroy"]>) {
    return this.projects.projectsDestroy(...args);
  }

  apiTasksList(...args: Parameters<TasksApi["tasksList"]>) {
    return this.tasks.tasksList(...args);
  }

  apiTasksRetrieve(...args: Parameters<TasksApi["tasksRetrieve"]>) {
    return this.tasks.tasksRetrieve(...args);
  }

  apiTasksCreate(...args: Parameters<TasksApi["tasksCreate"]>) {
    return this.tasks.tasksCreate(...args);
  }

  apiTasksPartialUpdate(...args: Parameters<TasksApi["tasksPartialUpdate"]>) {
    return this.tasks.tasksPartialUpdate(...args);
  }

  apiTasksDestroy(...args: Parameters<TasksApi["tasksDestroy"]>) {
    return this.tasks.tasksDestroy(...args);
  }

  apiTasksDuplicateCreate(
    ...args: Parameters<TasksApi["tasksDuplicateCreate"]>
  ) {
    return this.tasks.tasksDuplicateCreate(...args);
  }
}

class AdminApiCompatibility {}

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

  const projects = new ProjectsApi(configuration);
  const tasks = new TasksApi(configuration);

  return {
    // Legacy hook compatibility while generated client migration continues.
    api: new GeneratedApiCompatibility(projects, tasks),

    // Admin route generation is intentionally not used by current UI code.
    admin: new AdminApiCompatibility(),

    // Planner-specific typed operations.
    planner: new PlannerApi(configuration),

    // Direct access to configuration for custom requests
    configuration,
  };
};

// Export types for convenience
export type { Configuration } from "../generated-api-client/configuration";
export * from "../generated-api-client/models";
