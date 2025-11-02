import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : undefined;

// Import new API hooks for gradual migration
import {
  // Task hooks - Phase 1 migration
  useAddTask as useAddTaskNew,
  useCreateProject as useCreateProjectNew,
  useDeleteProject as useDeleteProjectNew,
  useDeleteTask as useDeleteTaskNew,
  useDuplicateTask as useDuplicateTaskNew,
  useInboxTasks as useInboxTasksNew,
  useInboxTasksList as useInboxTasksListNew,
  useProject as useProjectNew,
  useProjects as useProjectsNew,
  useReorderTasks as useReorderTasksNew,
  useRescheduleTask as useRescheduleTaskNew,
  useRescheduleTasks as useRescheduleTasksNew,
  useTask as useTaskNew,
  useTasks as useTasksNew,
  useTasksToday as useTasksTodayNew,
  useUpcomingTasks as useUpcomingTasksNew,
  useUpdateProject as useUpdateProjectNew,
  useUpdateTask as useUpdateTaskNew,
} from "../../../api/hooks";
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
} from "../../../api/migration-helpers";
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

// ============================================================================
// TASK HOOKS - MIGRATED TO GENERATED API CLIENT
// ============================================================================

export const useTasksToday = useTasksTodayNew;

export const useInboxTasks = useInboxTasksNew;

export const useInboxTasksList = useInboxTasksListNew;

export const useUpcomingTasks = useUpcomingTasksNew;

export const useTask = useTaskNew;

export const useTasks = useTasksNew;

export const useAddTask = useAddTaskNew;

export const useUpdateTask = useUpdateTaskNew;

export const useRescheduleTask = useRescheduleTaskNew;

export const useReorderTasks = useReorderTasksNew;

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

export const useRescheduleTasks = useRescheduleTasksNew;

export const useDeleteTask = useDeleteTaskNew;

// ============================================================================
// PROJECT HOOKS - MIGRATED TO GENERATED API CLIENT
// ============================================================================

export const useProjects = useProjectsNew;

// OLD IMPLEMENTATION (backup - remove after testing)
// export const useProjectsOld = () => {
//   const apiClient = useApiClient();
//   return useQuery({
//     queryKey: ["projects"],
//     queryFn: async () => {
//       const { data } = await apiClient.get(`/projects/`);
//       return data;
//     },
//   });
// };

export const useProject = useProjectNew;

// OLD IMPLEMENTATION (backup - remove after testing)
// export const useProjectOld = (projectId: number) => {
//   const apiClient = useApiClient();
//   return useQuery({
//     queryKey: ["project", { projectId }],
//     queryFn: async () => {
//       const { data } = await apiClient.get(`/projects/${projectId}/`);
//       return data as ProjectDetail;
//     },
//     enabled: !!projectId,
//   });
// };

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

export const useUpdateProject = useUpdateProjectNew;

// OLD IMPLEMENTATION (backup - remove after testing)
// export const useUpdateProjectOld = (projectId: number) => {
//   const apiClient = useApiClient();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationKey: ["updateProject", { projectId }],
//     mutationFn: async (data: Partial<Project>) => {
//       const result = await apiClient.patch(`/projects/${projectId}/`, data);
//       return result.data;
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["projects"] });
//       queryClient.invalidateQueries({ queryKey: ["project", { projectId }] });
//     },
//   });
// };

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

export const useDeleteProject = useDeleteProjectNew;

// NEW HOOK - Create project with generated client
export const useCreateProject = useCreateProjectNew;

// OLD IMPLEMENTATION (backup - remove after testing)
// export const useDeleteProjectOld = (project: ProjectDetail) => {
//   const apiClient = useApiClient();
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationKey: ["deleteProject", { projectId: project.id }],
//     mutationFn: async () => {
//       const result = await apiClient.delete(`/projects/${project.id}/`);
//       return result.data;
//     },
//     onMutate: () => {
//       queryClient.cancelQueries({ queryKey: ["projects"] });
//       queryClient.setQueryData(
//         ["projects"],
//         (oldProjects: PaginatedResponse<Project> | undefined) => {
//           const newProjects = oldProjects?.results.filter(
//             (p) => p.id !== project.id,
//           );
//           return { ...oldProjects, results: newProjects };
//         },
//       );
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["projects"] });
//     },
//   });
// };

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

export const useDuplicateTask = useDuplicateTaskNew;

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
