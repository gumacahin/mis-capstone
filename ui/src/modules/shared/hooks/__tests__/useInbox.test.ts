import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { Profile } from "../../../../api/migration-helpers";
import { useProfile } from "../queries";
import { useInbox } from "../useInbox";

// Mock the useProfile hook
vi.mock("../queries", () => ({
  useProfile: vi.fn(),
}));

describe("useInbox", () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;
  let mockUseProfile: ReturnType<typeof vi.fn>;

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

    // Mock useProfile
    mockUseProfile = useProfile as ReturnType<typeof vi.fn>;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("successful cases", () => {
    it("should return inbox project when profile has default project", async () => {
      const mockProfile: Profile = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: false,
        is_faculty: true,
        is_onboarded: true,
        timezone: "America/New_York",
        theme: "light",
        projects: [
          {
            id: 1,
            title: "Regular Project",
            is_default: false,
            sections: [
              {
                id: 1,
                title: "Section 1",
                is_default: true,
                project: 1,
              },
            ],
          },
          {
            id: 2,
            title: "Inbox",
            is_default: true,
            sections: [
              {
                id: 2,
                title: "(No Section)",
                is_default: true,
                project: 2,
              },
            ],
          },
        ],
      };

      mockUseProfile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.inbox).toEqual(mockProfile.projects[1]);
      expect(result.current.hasInbox).toBe(true);
      expect(result.current.inboxId).toBe(2);
      expect(result.current.error).toBeNull();
    });

    it("should handle profile with only default project", async () => {
      const mockProfile: Profile = {
        id: 1,
        name: "New User",
        email: "newuser@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: true,
        is_faculty: false,
        is_onboarded: true,
        timezone: "UTC",
        theme: "dark",
        projects: [
          {
            id: 1,
            title: "Inbox",
            is_default: true,
            sections: [
              {
                id: 1,
                title: "(No Section)",
                is_default: true,
                project: 1,
              },
            ],
          },
        ],
      };

      mockUseProfile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.inbox).toEqual(mockProfile.projects[0]);
      expect(result.current.hasInbox).toBe(true);
      expect(result.current.inboxId).toBe(1);
      expect(result.current.error).toBeNull();
    });
  });

  describe("loading states", () => {
    it("should return loading state when profile is loading", async () => {
      mockUseProfile.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.inbox).toBeUndefined();
      expect(result.current.hasInbox).toBe(false);
      expect(result.current.inboxId).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe("error cases", () => {
    it("should return profile error when useProfile fails", async () => {
      const profileError = new Error("Failed to fetch profile");

      mockUseProfile.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: profileError,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(profileError);
      expect(result.current.inbox).toBeUndefined();
      expect(result.current.hasInbox).toBe(false);
      expect(result.current.inboxId).toBeUndefined();
    });

    it("should return error when profile has no projects", async () => {
      const mockProfile: Profile = {
        id: 1,
        name: "User With No Projects",
        email: "noprojects@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: false,
        is_faculty: false,
        is_onboarded: true,
        timezone: "UTC",
        theme: "system",
        projects: [],
      };

      mockUseProfile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(
        "No inbox project found. Please contact support.",
      );
      expect(result.current.inbox).toBeUndefined();
      expect(result.current.hasInbox).toBe(false);
      expect(result.current.inboxId).toBeUndefined();
    });

    it("should return error when profile has no default project", async () => {
      const mockProfile: Profile = {
        id: 1,
        name: "User With No Default Project",
        email: "nodefault@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: false,
        is_faculty: false,
        is_onboarded: true,
        timezone: "UTC",
        theme: "light",
        projects: [
          {
            id: 1,
            title: "Regular Project 1",
            is_default: false,
            sections: [],
          },
          {
            id: 2,
            title: "Regular Project 2",
            is_default: false,
            sections: [],
          },
        ],
      };

      mockUseProfile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(
        "No inbox project found. Please contact support.",
      );
      expect(result.current.inbox).toBeUndefined();
      expect(result.current.hasInbox).toBe(false);
      expect(result.current.inboxId).toBeUndefined();
    });

    it("should handle undefined profile data", async () => {
      mockUseProfile.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.inbox).toBeUndefined();
      expect(result.current.hasInbox).toBe(false);
      expect(result.current.inboxId).toBeUndefined();
      expect(result.current.error).toBeNull(); // No error when data is simply undefined
    });

    it("should handle profile with undefined projects", async () => {
      const mockProfile = {
        id: 1,
        name: "User With Undefined Projects",
        email: "undefined@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: false,
        is_faculty: false,
        is_onboarded: true,
        timezone: "UTC",
        theme: "light",
        // projects is undefined
      } as Profile;

      mockUseProfile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.inbox).toBeUndefined();
      expect(result.current.hasInbox).toBe(false);
      expect(result.current.inboxId).toBeUndefined();
      expect(result.current.error).toBeNull(); // No error when projects is undefined
    });
  });

  describe("memoization", () => {
    it("should memoize inbox result when profile data doesn't change", async () => {
      const mockProfile: Profile = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: false,
        is_faculty: true,
        is_onboarded: true,
        timezone: "America/New_York",
        theme: "light",
        projects: [
          {
            id: 1,
            title: "Inbox",
            is_default: true,
            sections: [
              {
                id: 1,
                title: "(No Section)",
                is_default: true,
                project: 1,
              },
            ],
          },
        ],
      };

      mockUseProfile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
      });

      const { result, rerender } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const firstInbox = result.current.inbox;

      // Rerender with same data
      rerender();

      expect(result.current.inbox).toBe(firstInbox); // Same reference due to memoization
    });

    it("should update inbox when profile projects change", async () => {
      const initialProfile: Profile = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: false,
        is_faculty: true,
        is_onboarded: true,
        timezone: "America/New_York",
        theme: "light",
        projects: [
          {
            id: 1,
            title: "Old Inbox",
            is_default: true,
            sections: [],
          },
        ],
      };

      const updatedProfile: Profile = {
        ...initialProfile,
        projects: [
          {
            id: 2,
            title: "New Inbox",
            is_default: true,
            sections: [],
          },
        ],
      };

      mockUseProfile.mockReturnValue({
        data: initialProfile,
        isLoading: false,
        error: null,
      });

      const { result, rerender } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.inbox?.title).toBe("Old Inbox");

      // Update mock to return new profile
      mockUseProfile.mockReturnValue({
        data: updatedProfile,
        isLoading: false,
        error: null,
      });

      rerender();

      expect(result.current.inbox?.title).toBe("New Inbox");
      expect(result.current.inboxId).toBe(2);
    });
  });

  describe("data structure validation", () => {
    it("should correctly identify inbox with complex project structure", async () => {
      const mockProfile: Profile = {
        id: 1,
        name: "Complex User",
        email: "complex@example.com",
        picture: "https://example.com/avatar.jpg",
        is_student: true,
        is_faculty: true,
        is_onboarded: true,
        timezone: "Europe/London",
        theme: "system",
        projects: [
          {
            id: 1,
            title: "Work Project",
            is_default: false,
            sections: [
              {
                id: 1,
                title: "To Do",
                is_default: true,
                project: 1,
              },
              {
                id: 2,
                title: "In Progress",
                is_default: false,
                project: 1,
              },
            ],
          },
          {
            id: 2,
            title: "Personal",
            is_default: false,
            sections: [
              {
                id: 3,
                title: "Tasks",
                is_default: true,
                project: 2,
              },
            ],
          },
          {
            id: 3,
            title: "Inbox",
            is_default: true,
            sections: [
              {
                id: 4,
                title: "(No Section)",
                is_default: true,
                project: 3,
              },
              {
                id: 5,
                title: "Later",
                is_default: false,
                project: 3,
              },
            ],
          },
          {
            id: 4,
            title: "Archive",
            is_default: false,
            sections: [],
          },
        ],
      };

      mockUseProfile.mockReturnValue({
        data: mockProfile,
        isLoading: false,
        error: null,
      });

      const { result } = renderHook(() => useInbox(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should find the correct inbox project (id: 3)
      expect(result.current.inbox).toEqual(mockProfile.projects[2]);
      expect(result.current.inbox?.title).toBe("Inbox");
      expect(result.current.inbox?.is_default).toBe(true);
      expect(result.current.inboxId).toBe(3);
      expect(result.current.hasInbox).toBe(true);
      expect(result.current.error).toBeNull();

      // Verify it has the correct sections structure
      expect(result.current.inbox?.sections).toHaveLength(2);
      expect(result.current.inbox?.sections[0].title).toBe("(No Section)");
      expect(result.current.inbox?.sections[0].is_default).toBe(true);
    });
  });
});

