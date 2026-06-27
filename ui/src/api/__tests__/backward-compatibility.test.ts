import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useGeneratedApiClient } from "../client";
import { useProjects } from "../hooks/useProjects";
// Types will be imported as needed in individual tests

// Mock the old API client from queries.ts
vi.mock("../../modules/shared/hooks/queries", async () => {
  const actual = await vi.importActual("../../modules/shared/hooks/queries");
  return {
    ...actual,
    useApiClient: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    })),
  };
});

// Mock Auth0
const mockGetAccessTokenSilently = vi.fn();
const mockLoginWithRedirect = vi.fn();

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    getAccessTokenSilently: mockGetAccessTokenSilently,
    loginWithRedirect: mockLoginWithRedirect,
  }),
}));

// Mock the generated API client methods
const mockApiProjectsList = vi.fn();
const mockApiProjectsRetrieve = vi.fn();

vi.mock("../../generated-api-client/api", () => ({
  PlannerApi: vi.fn().mockImplementation(() => ({})),
  ProjectsApi: vi.fn().mockImplementation(() => ({
    projectsList: mockApiProjectsList,
    projectsRetrieve: mockApiProjectsRetrieve,
  })),
  TasksApi: vi.fn().mockImplementation(() => ({})),
}));

describe("Backward Compatibility Tests", () => {
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

  describe("API Client URL Configuration", () => {
    it("should configure new API client with correct base URL", () => {
      // Mock environment variable
      Object.assign(import.meta.env, {
        VITE_API_BASE_URL: "http://localhost:3000",
      });

      const { result } = renderHook(() => useGeneratedApiClient(), { wrapper });

      expect(result.current.configuration.basePath).toBe(
        "http://localhost:3000",
      );
    });

    it("should handle old and new API clients with different URL patterns", async () => {
      // Mock successful API responses
      const mockProjectsResponse = {
        data: {
          count: 2,
          next: null,
          previous: null,
          results: [
            {
              id: 1,
              title: "Test Project 1",
              is_default: true,
              order: 1,
              view: "list",
            },
            {
              id: 2,
              title: "Test Project 2",
              is_default: false,
              order: 2,
              view: "board",
            },
          ],
        },
      };

      mockApiProjectsList.mockResolvedValue(mockProjectsResponse);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify the new API client was called
      expect(mockApiProjectsList).toHaveBeenCalled();

      // Verify data transformation worked
      expect(result.current.data).toEqual({
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 1,
            title: "Test Project 1",
            is_default: true,
            order: 1,
            view: "list",
            sections: [],
          },
          {
            id: 2,
            title: "Test Project 2",
            is_default: false,
            order: 2,
            view: "board",
            sections: [],
          },
        ],
      });
    });
  });

  describe("Data Transformation Compatibility", () => {
    it("should transform generated API responses to match frontend expectations", async () => {
      const mockApiResponse = {
        data: {
          count: 1,
          results: [
            {
              id: 1,
              title: "Test Project",
              is_default: true,
              order: 1,
              view: "list", // ViewEnum from generated client
              // Missing sections property from generated client
            },
          ],
        },
      };

      mockApiProjectsList.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const transformedProject = result.current.data?.results[0];

      // Verify transformation added missing properties
      expect(transformedProject).toEqual({
        id: 1,
        title: "Test Project",
        is_default: true,
        order: 1,
        view: "list", // Transformed from ViewEnum to specific type
        sections: [], // Added by transformation
      });
    });

    it("should handle ViewEnum transformation correctly", async () => {
      const mockApiResponse = {
        data: {
          count: 2,
          results: [
            {
              id: 1,
              title: "List Project",
              view: "list",
              is_default: false,
              order: 1,
            },
            {
              id: 2,
              title: "Board Project",
              view: "board",
              is_default: false,
              order: 2,
            },
          ],
        },
      };

      mockApiProjectsList.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const projects = result.current.data?.results;

      expect(projects?.[0].view).toBe("list");
      expect(projects?.[1].view).toBe("board");
    });

    it("should provide default values for missing properties", async () => {
      const mockApiResponse = {
        data: {
          count: 1,
          results: [
            {
              id: 1,
              title: "Minimal Project",
              // Missing optional properties
            },
          ],
        },
      };

      mockApiProjectsList.mockResolvedValue(mockApiResponse);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const project = result.current.data?.results[0];

      // Verify default values are provided
      expect(project?.is_default).toBe(false);
      expect(project?.order).toBe(0);
      expect(project?.view).toBe("list");
      expect(project?.sections).toEqual([]);
    });
  });

  describe("Error Handling Compatibility", () => {
    it("should handle API errors gracefully", async () => {
      const mockError = new Error("API Error");
      mockApiProjectsList.mockRejectedValue(mockError);

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it("should handle malformed API responses", async () => {
      const mockMalformedResponse = {
        data: null, // Malformed response
      };

      mockApiProjectsList.mockResolvedValue(mockMalformedResponse);

      const { result } = renderHook(() => useProjects(), { wrapper });

      // The hook should either succeed with empty data or fail gracefully
      await waitFor(() => {
        expect(result.current.isSuccess || result.current.isError).toBe(true);
      });

      if (result.current.isSuccess) {
        // Should handle null data gracefully
        expect(result.current.data?.results).toEqual([]);
      } else {
        // Or it should fail with an error
        expect(result.current.error).toBeDefined();
      }
    });
  });

  describe("Authentication Integration", () => {
    it("should handle authentication token correctly", async () => {
      const { result } = renderHook(() => useGeneratedApiClient(), { wrapper });

      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;
      const token = await accessTokenFn();

      expect(mockGetAccessTokenSilently).toHaveBeenCalled();
      expect(token).toBe("mock-token");
    });

    it("should trigger login redirect on authentication failure", async () => {
      mockGetAccessTokenSilently.mockRejectedValue(new Error("Login required"));

      const { result } = renderHook(() => useGeneratedApiClient(), { wrapper });

      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;

      await expect(accessTokenFn()).rejects.toThrow("Login required");
      expect(mockLoginWithRedirect).toHaveBeenCalled();
    });
  });
});
