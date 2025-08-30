import "@testing-library/jest-dom";

import { vi } from "vitest";

// Polyfill for matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Polyfill for ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock Auth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently: vi.fn(),
  }),
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock environment variables
Object.defineProperty(window, "import.meta", {
  value: {
    env: {
      VITE_AUTH0_DOMAIN: "test.auth0.com",
      VITE_AUTH0_CLIENT_ID: "test-client-id",
      VITE_AUTH0_AUDIENCE: "test-audience",
      VITE_AUTH0_SCOPE: "openid profile email",
      VITE_AUTH0_REDIRECT_URL: "http://localhost:3000",
    },
  },
  writable: true,
});

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

vi.useFakeTimers();
vi.setSystemTime(new Date("2025-08-27T10:00:00Z"));
