import "@testing-library/jest-dom";

import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, expect, vi } from "vitest";

vi.mock("@auth0/auth0-react", () => ({
  Auth0Provider: ({ children }: { children: unknown }) => children,
  useAuth0: () => ({
    error: undefined,
    getAccessTokenSilently: vi.fn(async () => "test-token"),
    isAuthenticated: true,
    isLoading: false,
    loginWithRedirect: vi.fn(async () => {}),
    logout: vi.fn(),
    user: {
      email: "test@example.com",
      name: "Test User",
      sub: "auth0|test-user",
    },
  }),
}));

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

beforeAll(() => {
  const originalWarn = console.warn.bind(console);

  vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
    const [message] = args;
    if (
      typeof message === "string" &&
      message.includes("React Router Future Flag Warning")
    ) {
      return;
    }

    originalWarn(...args);
  });
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = "0px";
  thresholds = [0];

  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
} as typeof IntersectionObserver;
