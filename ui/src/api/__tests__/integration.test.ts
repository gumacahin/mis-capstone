import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGeneratedApiClient } from "../client";
import {
  useCreateProject,
  useDeleteProject,
  useProject,
  useProjects,
  useUpdateProject,
} from "../hooks/useProjects";
import type { PaginatedResponse, Project } from "../migration-helpers";

// Mock Auth0
const mockGetAccessTokenSilently = vi.fn();
const mockLoginWithRedirect = vi.fn();

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    getAccessTokenSilently: mockGetAccessTokenSilently,
    loginWithRedirect: mockLoginWithRedirect,
  }),
}));

// Mock toast notifications
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the generated API client methods
const mockApiProjectsList = vi.fn();
const mockApiProjectsRetrieve = vi.fn();
const mockApiProjectsCreate = vi.fn();
const mockApiProjectsPartialUpdate = vi.fn();
const mockApiProjectsDestroy = vi.fn();

vi.mock("../../generated-api-client/api", () => ({
  PlannerApi: vi.fn().mockImplementation(() => ({})),
  ProjectsApi: vi.fn().mockImplementation(() => ({
    projectsList: mockApiProjectsList,
    projectsRetrieve: mockApiProjectsRetrieve,
    projectsCreate: mockApiProjectsCreate,
    projectsPartialUpdate: mockApiProjectsPartialUpdate,
    projectsDestroy: mockApiProjectsDestroy,
  })),
  TasksApi: vi.fn().mockImplementation(() => ({})),
}));

describe("API Integration Tests", () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    wrapper = ({ children }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children,
      );

    vi.clearAllMocks();
    mockGetAccessTokenSilently.mockResolvedValue("mock-token");
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe("Complete Project Workflow", () => {
    it("should handle full CRUD operations for projects", async () => {
      // Mock data
      const mockProjectsResponse = {
        data: {
          count: 1,
          results: [
            {
              id: 1,
              title: "Initial Project",
              is_default: false,
              order: 1,
              view: "list",
            },
          ],
        },
      };

      const mockNewProject = {
        data: {
          id: 2,
          title: "New Project",
          is_default: false,
          order: 2,
          view: "board",
        },
      };

      const mockUpdatedProject = {
        data: {
          id: 2,
          title: "Updated Project",
          is_default: false,
          order: 2,
          view: "board",
        },
      };

      // Setup mocks
      mockApiProjectsList.mockResolvedValue(mockProjectsResponse);
      mockApiProjectsCreate.mockResolvedValue(mockNewProject);
      mockApiProjectsPartialUpdate.mockResolvedValue(mockUpdatedProject);
      mockApiProjectsDestroy.mockResolvedValue({});

      // 1. Fetch initial projects
      const { result: projectsResult } = renderHook(() => useProjects(), {
        wrapper,
      });

      await waitFor(() => {
        expect(projectsResult.current.isSuccess).toBe(true);
      });

      expect(projectsResult.current.data?.results).toHaveLength(1);
      expect(projectsResult.current.data?.results[0].title).toBe(
        "Initial Project",
      );

      // 2. Create new project
      const { result: createResult } = renderHook(() => useCreateProject(), {
        wrapper,
      });

      createResult.current.mutate({
        title: "New Project",
        view: "board",
      });

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true);
      });

      expect(mockApiProjectsCreate).toHaveBeenCalledWith({
        projectDetailRequest: {
          title: "New Project",
          view: "board",
        },
      });

      // 3. Update project
      const { result: updateResult } = renderHook(() => useUpdateProject(2), {
        wrapper,
      });

      updateResult.current.mutate({
        title: "Updated Project",
      });

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true);
      });

      expect(mockApiProjectsPartialUpdate).toHaveBeenCalledWith({
        id: 2,
        patchedProjectDetailRequest: {
          title: "Updated Project",
        },
      });

      // 4. Delete project
      const projectToDelete = {
        id: 2,
        title: "Updated Project",
        view: "board" as const,
        sections: [],
      };

      const { result: deleteResult } = renderHook(
        () => useDeleteProject(projectToDelete),
        { wrapper },
      );

      deleteResult.current.mutate();

      await waitFor(() => {
        expect(deleteResult.current.isSuccess).toBe(true);
      });

      expect(mockApiProjectsDestroy).toHaveBeenCalledWith({ id: 2 });
    });

    it("should handle single project fetch", async () => {
      const mockProjectResponse = {
        data: {
          id: 1,
          title: "Single Project",
          view: "list",
          sections: [],
        },
      };

      mockApiProjectsRetrieve.mockResolvedValue(mockProjectResponse);

      const { result } = renderHook(() => useProject(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiProjectsRetrieve).toHaveBeenCalledWith({ id: 1 });
      expect(result.current.data).toEqual({
        id: 1,
        title: "Single Project",
        view: "list",
        sections: [],
      });
    });
  });

  describe("Cache Management", () => {
    it("should update cache correctly after mutations", async () => {
      // Pre-populate cache
      const initialProjects = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Initial Project",
            is_default: false,
            order: 1,
            view: "list" as const,
            sections: [],
          },
        ],
      };

      queryClient.setQueryData(["projects"], initialProjects);

      const mockNewProject = {
        data: {
          id: 2,
          title: "New Project",
          is_default: false,
          order: 2,
          view: "board",
        },
      };

      mockApiProjectsCreate.mockResolvedValue(mockNewProject);

      const { result } = renderHook(() => useCreateProject(), { wrapper });

      result.current.mutate({
        title: "New Project",
        view: "board",
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check cache was updated
      const updatedCache = queryClient.getQueryData([
        "projects",
      ]) as PaginatedResponse<Project>;
      expect(updatedCache.results).toHaveLength(2);
      expect(updatedCache.results[1].title).toBe("New Project");
    });

    it("should handle optimistic updates for delete operations", async () => {
      // Pre-populate cache
      const initialProjects = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Project 1",
            is_default: false,
            order: 1,
            view: "list" as const,
            sections: [],
          },
          {
            id: 2,
            title: "Project 2",
            is_default: false,
            order: 2,
            view: "board" as const,
            sections: [],
          },
        ],
      };

      queryClient.setQueryData(["projects"], initialProjects);

      mockApiProjectsDestroy.mockResolvedValue({});

      const projectToDelete = {
        id: 2,
        title: "Project 2",
        view: "board" as const,
        sections: [],
      };

      const { result } = renderHook(() => useDeleteProject(projectToDelete), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check optimistic update worked
      const updatedCache = queryClient.getQueryData([
        "projects",
      ]) as PaginatedResponse<Project>;
      expect(updatedCache.results).toHaveLength(1);
      expect(updatedCache.results[0].id).toBe(1);
    });
  });

  describe("Error Scenarios", () => {
    it("should handle network errors gracefully", async () => {
      const networkError = new Error("Network Error");
      mockApiProjectsList.mockRejectedValue(networkError);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(networkError);
    });

    it("should handle authentication errors during mutations", async () => {
      const authError = new Error("Unauthorized");
      mockApiProjectsCreate.mockRejectedValue(authError);

      const { result } = renderHook(() => useCreateProject(), { wrapper });

      result.current.mutate({
        title: "Test Project",
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(authError);
    });

    it("should handle validation errors", async () => {
      const validationError = new Error("Title is required");
      mockApiProjectsCreate.mockRejectedValue(validationError);

      const { result } = renderHook(() => useCreateProject(), { wrapper });

      result.current.mutate({
        title: "",
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(validationError);
    });
  });

  describe("Environment Configuration", () => {
    it("should create client with valid configuration", () => {
      const { result } = renderHook(() => useGeneratedApiClient(), { wrapper });

      expect(result.current.configuration.basePath).toBeTruthy();
      expect(typeof result.current.configuration.basePath).toBe("string");
      expect(result.current.configuration.accessToken).toBeDefined();
    });

    it("should have consistent configuration across instances", () => {
      const { result: result1 } = renderHook(() => useGeneratedApiClient(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useGeneratedApiClient(), {
        wrapper,
      });

      // Should have same base path but different instances
      expect(result1.current.configuration.basePath).toBe(
        result2.current.configuration.basePath,
      );
      expect(result1.current.configuration).not.toBe(
        result2.current.configuration,
      );
    });
  });

  describe("Type Safety", () => {
    it("should maintain type safety across transformations", async () => {
      const mockResponse = {
        data: {
          count: 1,
          results: [
            {
              id: 1,
              title: "Type Safe Project",
              is_default: true,
              order: 1,
              view: "list",
            },
          ],
        },
      };

      mockApiProjectsList.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const project = result.current.data?.results[0];

      // TypeScript should enforce these types
      expect(typeof project?.id).toBe("number");
      expect(typeof project?.title).toBe("string");
      expect(typeof project?.is_default).toBe("boolean");
      expect(typeof project?.order).toBe("number");
      expect(["list", "board"]).toContain(project?.view);
      expect(Array.isArray(project?.sections)).toBe(true);
    });
  });
});
