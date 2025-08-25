import "@testing-library/jest-dom";

// Mock Auth0
jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
    getAccessTokenSilently: jest.fn(),
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
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/" }),
}));
