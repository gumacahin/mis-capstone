import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGeneratedApiClient } from "../client";

// Mock Auth0
const mockGetAccessTokenSilently = vi.fn();
const mockLoginWithRedirect = vi.fn();

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    getAccessTokenSilently: mockGetAccessTokenSilently,
    loginWithRedirect: mockLoginWithRedirect,
  }),
}));

describe("API Client Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAccessTokenSilently.mockResolvedValue("mock-token");
  });

  describe("useGeneratedApiClient", () => {
    it("should create API client with configuration", () => {
      const { result } = renderHook(() => useGeneratedApiClient());

      expect(result.current.api).toBeDefined();
      expect(result.current.admin).toBeDefined();
      expect(result.current.planner).toBeDefined();
      expect(result.current.configuration).toBeDefined();

      // The basePath should be set (either from env or fallback)
      expect(result.current.configuration.basePath).toBeTruthy();
      expect(typeof result.current.configuration.basePath).toBe("string");
    });

    it("should configure access token function correctly", async () => {
      const { result } = renderHook(() => useGeneratedApiClient());

      // Test access token function
      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;
      const token = await accessTokenFn();

      expect(mockGetAccessTokenSilently).toHaveBeenCalled();
      expect(token).toBe("mock-token");
    });

    it("should handle login required error", async () => {
      mockGetAccessTokenSilently.mockRejectedValue(new Error("Login required"));

      const { result } = renderHook(() => useGeneratedApiClient());

      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;

      await expect(accessTokenFn()).rejects.toThrow("Login required");
      expect(mockLoginWithRedirect).toHaveBeenCalled();
    });

    it("should handle unexpected token errors", async () => {
      const unexpectedError = new Error("Network error");
      mockGetAccessTokenSilently.mockRejectedValue(unexpectedError);

      const { result } = renderHook(() => useGeneratedApiClient());

      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;

      await expect(accessTokenFn()).rejects.toThrow("Network error");
      expect(mockLoginWithRedirect).not.toHaveBeenCalled();
    });

    it("should provide compatibility API, Admin, and Planner clients", () => {
      const { result } = renderHook(() => useGeneratedApiClient());

      expect(result.current.api).toBeDefined();
      expect(result.current.admin).toBeDefined();
      expect(result.current.planner).toBeDefined();
      expect(result.current.api.constructor.name).toBe(
        "GeneratedApiCompatibility",
      );
      expect(result.current.admin.constructor.name).toBe(
        "AdminApiCompatibility",
      );
      expect(result.current.planner.constructor.name).toBe("PlannerApi");
    });

    it("should provide direct access to configuration", () => {
      const { result } = renderHook(() => useGeneratedApiClient());

      expect(result.current.configuration).toBeDefined();
      expect(result.current.configuration.constructor.name).toBe(
        "Configuration",
      );
    });

    it("should have access token function defined", () => {
      const { result } = renderHook(() => useGeneratedApiClient());

      expect(result.current.configuration.accessToken).toBeDefined();
      expect(typeof result.current.configuration.accessToken).toBe("function");
    });

    it("should create new instances on each call", () => {
      const { result: result1 } = renderHook(() => useGeneratedApiClient());
      const { result: result2 } = renderHook(() => useGeneratedApiClient());

      // Should be different instances
      expect(result1.current.api).not.toBe(result2.current.api);
      expect(result1.current.admin).not.toBe(result2.current.admin);
      expect(result1.current.planner).not.toBe(result2.current.planner);
      expect(result1.current.configuration).not.toBe(
        result2.current.configuration,
      );
    });
  });

  describe("Authentication Integration", () => {
    it("should handle successful token retrieval", async () => {
      const testToken = "test-jwt-token";
      mockGetAccessTokenSilently.mockResolvedValue(testToken);

      const { result } = renderHook(() => useGeneratedApiClient());

      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;
      const token = await accessTokenFn();

      expect(token).toBe(testToken);
    });

    it("should handle token retrieval with parameters", async () => {
      const { result } = renderHook(() => useGeneratedApiClient());

      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;
      await accessTokenFn("test-name", ["read:projects"]);

      expect(mockGetAccessTokenSilently).toHaveBeenCalled();
    });

    it("should propagate authentication errors", async () => {
      const authError = new Error("Authentication failed");
      mockGetAccessTokenSilently.mockRejectedValue(authError);

      const { result } = renderHook(() => useGeneratedApiClient());

      const accessTokenFn = result.current.configuration
        .accessToken as () => Promise<string>;

      await expect(accessTokenFn()).rejects.toThrow("Authentication failed");
    });
  });
});
