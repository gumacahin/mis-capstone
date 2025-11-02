import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import type { ProjectDetailRequest } from "../../generated-api-client/models";
import { useGeneratedApiClient } from "../client";
import type {
  PaginatedResponse,
  Project,
  ProjectDetail,
} from "../migration-helpers";

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Transform generated API Project to frontend-compatible Project
 */
const transformProject = (apiProject: unknown): Project => {
  const project = apiProject as Record<string, unknown>;
  return {
    id: project.id as number,
    title: project.title as string,
    is_default: (project.is_default as boolean) || false,
    order: (project.order as number) || 0,
    view: (project.view as "list" | "board") || "list", // Transform ViewEnum to specific type
    sections: [], // Will be populated separately if needed
  };
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
 * Transform paginated response
 */
const transformPaginatedProjects = (
  apiResponse: unknown,
): PaginatedResponse<Project> => {
  const response = apiResponse as Record<string, unknown>;
  return {
    count: response.count as number,
    next: response.next as string | null,
    previous: response.previous as string | null,
    results: (response.results as unknown[])?.map(transformProject) || [],
  };
};

/**
 * Projects API Hooks using Generated OpenAPI Client
 *
 * Migrated from: ui/src/modules/shared/hooks/queries.ts
 * Uses: Generated API client instead of manual Axios calls
 */

// ============================================================================
// READ HOOKS (Queries)
// ============================================================================

/**
 * Fetch all projects for the current user
 */
export const useProjects = () => {
  const { api } = useGeneratedApiClient();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await api.apiProjectsList();
      return transformPaginatedProjects(response.data);
    },
  });
};

/**
 * Fetch a single project by ID
 */
export const useProject = (projectId: number) => {
  const { api } = useGeneratedApiClient();

  return useQuery({
    queryKey: ["project", { projectId }],
    queryFn: async () => {
      const response = await api.apiProjectsRetrieve({ id: projectId });
      return transformProjectDetail(response.data);
    },
  });
};

// ============================================================================
// WRITE HOOKS (Mutations)
// ============================================================================

/**
 * Create a new project
 */
export const useCreateProject = () => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: async (projectData: {
      title: string;
      view?: "list" | "board";
    }) => {
      const requestData: ProjectDetailRequest = {
        title: projectData.title,
        view: projectData.view || "list",
      };
      const response = await api.apiProjectsCreate({
        projectDetailRequest: requestData,
      });
      return transformProject(response.data);
    },
    onSuccess: (newProject) => {
      // Update projects cache
      queryClient.setQueryData(
        ["projects"],
        (oldData: PaginatedResponse<Project> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: [...oldData.results, newProject as Project],
          };
        },
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["projects"] });

      toast.success("Project created successfully!");
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project");
    },
  });
};

/**
 * Update an existing project
 */
export const useUpdateProject = (projectId: number) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProject", { projectId }],
    mutationFn: async (projectData: Partial<ProjectDetailRequest>) => {
      const response = await api.apiProjectsPartialUpdate({
        id: projectId,
        patchedProjectDetailRequest: projectData,
      });
      return transformProjectDetail(response.data);
    },
    onSuccess: (updatedProject) => {
      // Update specific project cache
      queryClient.setQueryData(["project", { projectId }], updatedProject);

      // Update projects list cache
      queryClient.setQueryData(
        ["projects"],
        (oldData: PaginatedResponse<Project> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.map((project) =>
              project.id === projectId
                ? ({ ...project, ...updatedProject } as Project)
                : project,
            ),
          };
        },
      );

      toast.success("Project updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project");
    },
  });
};

/**
 * Delete a project
 */
export const useDeleteProject = (project: ProjectDetail) => {
  const { api } = useGeneratedApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteProject", { projectId: project.id }],
    mutationFn: async () => {
      await api.apiProjectsDestroy({ id: project.id });
      return project.id;
    },
    onMutate: () => {
      // Cancel outgoing queries
      queryClient.cancelQueries({ queryKey: ["projects"] });

      // Optimistically remove from cache
      queryClient.setQueryData(
        ["projects"],
        (oldData: PaginatedResponse<Project> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            results: oldData.results.filter((p) => p.id !== project.id),
          };
        },
      );
    },
    onSuccess: () => {
      toast.success("Project deleted successfully!");
    },
    onError: (error) => {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// TODO: Add more project-related hooks as needed:
// - useUpdateProjectView
// - useReorderProjects
// - etc.
