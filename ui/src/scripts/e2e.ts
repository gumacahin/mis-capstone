/**
 * E2E Test Bootstrap Module
 *
 * This module provides helper functions for E2E testing.
 * Only loaded when VITE_APP_ENV === 'e2e'
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface TestLoginResponse {
  access: string;
  refresh: string | null;
  claims: {
    iss: string;
    aud: string;
    sub: string;
    email: string;
    roles: string[];
  };
}

interface TestResetResponse {
  ok: boolean;
  scenario: string;
  tables_truncated: number;
}

interface TestSeedResponse {
  ok: boolean;
  scenario: string;
  created_ids: Record<string, string | number>;
}

/**
 * Login with a test user and trigger user creation via normal auth flow
 */
export async function e2eLogin(
  email: string = "e2e.user@example.com",
): Promise<void> {
  try {
    // Call test login endpoint to get JWT
    const loginResponse = await fetch(`${API_BASE_URL}/test/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        roles: ["user"],
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(
        `Login failed: ${loginResponse.status} ${loginResponse.statusText}`,
      );
    }

    const loginData: TestLoginResponse = await loginResponse.json();

    // Store the access token where the app expects it
    localStorage.setItem("access_token", loginData.access);

    // Call warmup endpoint to trigger user creation via normal auth flow
    const warmupResponse = await fetch(`${API_BASE_URL}/test/warmup`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginData.access}`,
        "Content-Type": "application/json",
      },
    });

    if (!warmupResponse.ok) {
      throw new Error(
        `Warmup failed: ${warmupResponse.status} ${warmupResponse.statusText}`,
      );
    }

    console.log("E2E login successful:", {
      email,
      user_id: (await warmupResponse.json()).user_id,
    });
  } catch (error) {
    console.error("E2E login failed:", error);
    throw error;
  }
}

/**
 * Reset the test database and optionally seed with scenario data
 */
export async function e2eReset(scenario?: string): Promise<void> {
  try {
    // Reset the database
    const resetResponse = await fetch(`${API_BASE_URL}/test/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scenario: scenario || "baseline_empty_user",
      }),
    });

    if (!resetResponse.ok) {
      throw new Error(
        `Reset failed: ${resetResponse.status} ${resetResponse.statusText}`,
      );
    }

    const resetData: TestResetResponse = await resetResponse.json();
    console.log("E2E reset successful:", resetData);

    // If a scenario is provided, seed the database
    if (scenario && scenario !== "baseline_empty_user") {
      const seedResponse = await fetch(`${API_BASE_URL}/test/seed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenario }),
      });

      if (!seedResponse.ok) {
        throw new Error(
          `Seed failed: ${seedResponse.status} ${seedResponse.statusText}`,
        );
      }

      const seedData: TestSeedResponse = await seedResponse.json();
      console.log("E2E seed successful:", seedData);
    }
  } catch (error) {
    console.error("E2E reset failed:", error);
    throw error;
  }
}

/**
 * Clear stored authentication data
 */
export function e2eLogout(): void {
  localStorage.removeItem("access_token");
  console.log("E2E logout successful");
}

/**
 * Get the current access token
 */
export function e2eGetToken(): string | null {
  return localStorage.getItem("access_token");
}

/**
 * Check if E2E mode is enabled
 */
export function e2eIsEnabled(): boolean {
  return import.meta.env.VITE_APP_ENV === "e2e";
}

// Create the e2e module object
const e2eModule = {
  login: e2eLogin,
  reset: e2eReset,
  logout: e2eLogout,
  getToken: e2eGetToken,
  isEnabled: e2eIsEnabled,
};

// Export the module for global access
if (typeof window !== "undefined") {
  (window as { e2e?: typeof e2eModule }).e2e = e2eModule;
}
