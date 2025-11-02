import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGeneratedApiClient } from "../../client";
import type {
  PaginatedResponse,
  Project,
  ProjectDetail,
} from "../../migration-helpers";
import {
  useCreateProject,
  useDeleteProject,
  useProject,
  useProjects,
  useUpdateProject,
} from "../useProjects";

// Mock the generated API client
vi.mock("../../client", () => ({
  useGeneratedApiClient: vi.fn(),
}));

// Mock toast notifications
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useProjects API Hooks", () => {
  let queryClient: QueryClient;
  let mockApi: {
    apiProjectsList: ReturnType<typeof vi.fn>;
    apiProjectsRetrieve: ReturnType<typeof vi.fn>;
    apiProjectsCreate: ReturnType<typeof vi.fn>;
    apiProjectsPartialUpdate: ReturnType<typeof vi.fn>;
    apiProjectsDestroy: ReturnType<typeof vi.fn>;
  };
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    // Create fresh QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Create wrapper with QueryClient
    wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children,
      );

    // Mock API client methods
    mockApi = {
      apiProjectsList: vi.fn(),
      apiProjectsRetrieve: vi.fn(),
      apiProjectsCreate: vi.fn(),
      apiProjectsPartialUpdate: vi.fn(),
      apiProjectsDestroy: vi.fn(),
    };

    // Mock useGeneratedApiClient
    (useGeneratedApiClient as ReturnType<typeof vi.fn>).mockReturnValue({
      api: mockApi,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // READ HOOKS TESTS
  // ============================================================================

  describe("useProjects", () => {
    it("should fetch projects successfully", async () => {
      const mockProjectsResponse: PaginatedResponse<Project> = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Project 1",
            is_default: false,
            order: 1,
            view: "list",
            sections: [],
          },
          {
            id: 2,
            title: "Project 2",
            is_default: false,
            order: 2,
            view: "board",
            sections: [],
          },
        ],
      };

      mockApi.apiProjectsList.mockResolvedValue({
        data: mockProjectsResponse,
      });

      const { result } = renderHook(() => useProjects(), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProjectsResponse);
      expect(result.current.error).toBeNull();
      expect(mockApi.apiProjectsList).toHaveBeenCalledWith();
    });

    it("should handle projects fetch error", async () => {
      const mockError = new Error("Failed to fetch projects");
      mockApi.apiProjectsList.mockRejectedValue(mockError);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("useProject", () => {
    it("should fetch single project successfully", async () => {
      const mockProject: ProjectDetail = {
        id: 1,
        title: "Test Project",
        view: "list",
        sections: [],
      };

      mockApi.apiProjectsRetrieve.mockResolvedValue({
        data: mockProject,
      });

      const { result } = renderHook(() => useProject(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockProject);
      expect(mockApi.apiProjectsRetrieve).toHaveBeenCalledWith({ id: 1 });
    });

    it("should handle single project fetch error", async () => {
      const mockError = new Error("Project not found");
      mockApi.apiProjectsRetrieve.mockRejectedValue(mockError);

      const { result } = renderHook(() => useProject(999), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(mockError);
    });
  });

  // ============================================================================
  // MUTATION HOOKS TESTS
  // ============================================================================

  describe("useCreateProject", () => {
    it("should create project successfully", async () => {
      const newProject: Project = {
        id: 3,
        title: "New Project",
        is_default: false,
        order: 3,
        view: "list",
        sections: [],
      };

      mockApi.apiProjectsCreate.mockResolvedValue({
        data: newProject,
      });

      const { result } = renderHook(() => useCreateProject(), { wrapper });

      // Trigger mutation
      result.current.mutate({
        title: "New Project",
        view: "list",
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(newProject);
      expect(mockApi.apiProjectsCreate).toHaveBeenCalledWith({
        projectDetailRequest: {
          title: "New Project",
          view: "list",
        },
      });
    });

    it("should handle create project error", async () => {
      const mockError = new Error("Validation failed");
      mockApi.apiProjectsCreate.mockRejectedValue(mockError);

      const { result } = renderHook(() => useCreateProject(), { wrapper });

      result.current.mutate({
        title: "Invalid Project",
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
    });

    it("should update cache optimistically on success", async () => {
      const existingProjects: PaginatedResponse<Project> = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Existing Project",
            is_default: false,
            order: 1,
            view: "list",
            sections: [],
          },
        ],
      };

      const newProject: Project = {
        id: 2,
        title: "New Project",
        is_default: false,
        order: 2,
        view: "board",
        sections: [],
      };

      // Pre-populate cache
      queryClient.setQueryData(["projects"], existingProjects);

      mockApi.apiProjectsCreate.mockResolvedValue({
        data: newProject,
      });

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
      expect(updatedCache.results[1]).toEqual(newProject);
    });
  });

  describe("useUpdateProject", () => {
    it("should update project successfully", async () => {
      const updatedProject: ProjectDetail = {
        id: 1,
        title: "Updated Project",
        view: "board",
        sections: [],
      };

      mockApi.apiProjectsPartialUpdate.mockResolvedValue({
        data: updatedProject,
      });

      const { result } = renderHook(() => useUpdateProject(1), { wrapper });

      result.current.mutate({
        title: "Updated Project",
        view: "board",
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(updatedProject);
      expect(mockApi.apiProjectsPartialUpdate).toHaveBeenCalledWith({
        id: 1,
        patchedProjectDetailRequest: {
          title: "Updated Project",
          view: "board",
        },
      });
    });
  });

  describe("useDeleteProject", () => {
    it("should delete project successfully", async () => {
      const projectToDelete: ProjectDetail = {
        id: 1,
        title: "Project to Delete",
        view: "list",
        sections: [],
      };

      mockApi.apiProjectsDestroy.mockResolvedValue({});

      const { result } = renderHook(() => useDeleteProject(projectToDelete), {
        wrapper,
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApi.apiProjectsDestroy).toHaveBeenCalledWith({ id: 1 });
    });

    it("should optimistically remove from cache", async () => {
      const existingProjects: PaginatedResponse<Project> = {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Project 1",
            is_default: false,
            order: 1,
            view: "list",
            sections: [],
          },
          {
            id: 2,
            title: "Project 2",
            is_default: false,
            order: 2,
            view: "board",
            sections: [],
          },
        ],
      };

      const projectToDelete: ProjectDetail = {
        id: 1,
        title: "Project 1",
        view: "list",
        sections: [],
      };

      // Pre-populate cache
      queryClient.setQueryData(["projects"], existingProjects);

      mockApi.apiProjectsDestroy.mockResolvedValue({});

      const { result } = renderHook(() => useDeleteProject(projectToDelete), {
        wrapper,
      });

      result.current.mutate();

      // Wait for the mutation to complete and check optimistic update worked
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Check optimistic update worked (should have removed the item)
      const cacheAfterMutation = queryClient.getQueryData([
        "projects",
      ]) as PaginatedResponse<Project>;
      expect(cacheAfterMutation.results).toHaveLength(1);
      expect(cacheAfterMutation.results[0].id).toBe(2);
    });
  });
});
