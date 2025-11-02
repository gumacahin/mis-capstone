// AuthProviderWrapper.tsx - Conditionally uses Auth0 or E2E auth based on environment

import {
  Auth0Provider,
  Auth0ProviderOptions,
  useAuth0 as useAuth0Real,
} from "@auth0/auth0-react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Mock Auth0 context for E2E testing
interface MockAuth0ContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: Record<string, unknown>;
  error?: Error;
  getAccessTokenSilently: () => Promise<string>;
  loginWithRedirect: () => Promise<void>;
  logout: () => void;
}

const MockAuth0Context = createContext<MockAuth0ContextValue | undefined>(
  undefined,
);

// E2E Auth Provider that mimics Auth0Provider behavior
const E2EAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Record<string, unknown>>();
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const checkE2EAuth = () => {
      try {
        const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
        const origin = window.location.origin;

        const authKey = `@@auth0spajs@@::${clientId}::${origin}::openid profile email`;
        const userKey = `@@auth0spajs@@::${clientId}::${origin}::@@user@@`;

        const authData = localStorage.getItem(authKey);
        const userData = localStorage.getItem(userKey);

        if (authData && userData) {
          const parsedAuthData = JSON.parse(authData);
          const parsedUserData = JSON.parse(userData);

          if (parsedAuthData.body?.access_token && parsedUserData.email) {
            setAccessToken(parsedAuthData.body.access_token);
            setUser(parsedUserData);
            setIsAuthenticated(true);
            console.log("✅ E2E Auth: Programmatic authentication detected");
          }
        }
      } catch (error) {
        console.error("❌ E2E Auth: Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Check for auth data after a brief delay to ensure localStorage is ready
    setTimeout(checkE2EAuth, 100);
  }, []);

  const getAccessTokenSilently = async (): Promise<string> => {
    if (!isAuthenticated || !accessToken) {
      throw new Error("Login required");
    }
    return accessToken;
  };

  const loginWithRedirect = async (): Promise<void> => {
    throw new Error(
      "E2E Auth: Use loginAs() in your test to set up authentication",
    );
  };

  const logout = (): void => {
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const origin = window.location.origin;

    const authKey = `@@auth0spajs@@::${clientId}::${origin}::openid profile email`;
    const userKey = `@@auth0spajs@@::${clientId}::${origin}::@@user@@`;

    localStorage.removeItem(authKey);
    localStorage.removeItem(userKey);

    setIsAuthenticated(false);
    setUser(undefined);
    setAccessToken("");
  };

  const contextValue: MockAuth0ContextValue = {
    isLoading,
    isAuthenticated,
    user,
    error: undefined,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  };

  return (
    <MockAuth0Context.Provider value={contextValue}>
      {children}
    </MockAuth0Context.Provider>
  );
};

// Hook that returns either real Auth0 or mock context
export const useAuth0 = (): MockAuth0ContextValue => {
  const isE2EMode = import.meta.env.VITE_APP_ENV === "e2e";
  const bypassAuth = import.meta.env.VITE_E2E_BYPASS_AUTH === "1";

  // Always call both hooks to avoid conditional hook calls
  const mockContext = useContext(MockAuth0Context);
  const realAuth0Context = useAuth0Real();

  if (isE2EMode && bypassAuth) {
    if (mockContext === undefined) {
      throw new Error(
        "useAuth0 must be used within E2EAuthProvider in E2E mode",
      );
    }
    return mockContext;
  } else {
    // Use real Auth0 in normal mode
    return realAuth0Context as MockAuth0ContextValue;
  }
};

// Wrapper component that chooses the right provider
interface AuthProviderWrapperProps {
  children: ReactNode;
  auth0Config: Auth0ProviderOptions;
}

export const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({
  children,
  auth0Config,
}) => {
  const isE2EMode = import.meta.env.VITE_APP_ENV === "e2e";
  const bypassAuth = import.meta.env.VITE_E2E_BYPASS_AUTH === "1";

  if (isE2EMode && bypassAuth) {
    console.log("🔧 E2E Mode: Using mock Auth0 provider");
    return <E2EAuthProvider>{children}</E2EAuthProvider>;
  } else {
    console.log("🔧 Normal Mode: Using real Auth0 provider");
    return <Auth0Provider {...auth0Config}>{children}</Auth0Provider>;
  }
};
