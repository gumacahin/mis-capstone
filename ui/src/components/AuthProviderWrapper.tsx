// AuthProviderWrapper.tsx - Conditionally uses Auth0 or E2E auth based on environment
/* eslint-disable react-refresh/only-export-components */

import {
  Auth0Provider,
  Auth0ProviderOptions,
  useAuth0 as useAuth0Real,
} from "@auth0/auth0-react";
import React, {
  ComponentType,
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
  loginWithRedirect: (options?: Record<string, unknown>) => Promise<void>;
  logout: (options?: Record<string, unknown>) => Promise<void> | void;
}

const MockAuth0Context = createContext<MockAuth0ContextValue | undefined>(
  undefined,
);

type LoginOptions = Record<string, unknown> & {
  appState?: Record<string, unknown>;
};

type WithAuthenticationRequiredOptions = {
  onRedirecting?: () => ReactNode;
  onBeforeAuthentication?: () => Promise<void> | void;
  returnTo?: string | (() => string);
  loginOptions?: LoginOptions;
};

const authStoragePrefix = "@@auth0spajs@@::";

function findAuthStorageKeys() {
  const keys = Object.keys(localStorage);
  return {
    authKey: keys.find(
      (key) =>
        key.startsWith(authStoragePrefix) &&
        !key.endsWith("::@@user@@") &&
        key.includes("::openid profile email"),
    ),
    userKey: keys.find(
      (key) => key.startsWith(authStoragePrefix) && key.endsWith("::@@user@@"),
    ),
  };
}

// E2E Auth Provider that mimics Auth0Provider behavior
const E2EAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Record<string, unknown>>();
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const checkE2EAuth = () => {
      try {
        const { authKey, userKey } = findAuthStorageKeys();
        const authData = authKey ? localStorage.getItem(authKey) : null;
        const userData = userKey ? localStorage.getItem(userKey) : null;

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
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(authStoragePrefix)) {
        localStorage.removeItem(key);
      }
    });

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

export const withAuthenticationRequired = <P extends object>(
  Component: ComponentType<P>,
  options: WithAuthenticationRequiredOptions = {},
): React.FC<P> => {
  const {
    loginOptions,
    onBeforeAuthentication = () => undefined,
    onRedirecting = () => null,
    returnTo = () => `${window.location.pathname}${window.location.search}`,
  } = options;

  const WithAuthenticationRequiredComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    useEffect(() => {
      if (isLoading || isAuthenticated) {
        return;
      }

      const authenticate = async () => {
        await onBeforeAuthentication();
        await loginWithRedirect({
          ...loginOptions,
          appState: {
            ...(loginOptions?.appState ?? {}),
            returnTo: typeof returnTo === "function" ? returnTo() : returnTo,
          },
        });
      };

      void authenticate();
    }, [isAuthenticated, isLoading, loginWithRedirect]);

    if (!isAuthenticated) {
      return <>{onRedirecting()}</>;
    }

    return <Component {...props} />;
  };

  WithAuthenticationRequiredComponent.displayName = `withAuthenticationRequired(${
    Component.displayName ?? Component.name ?? "Component"
  })`;

  return WithAuthenticationRequiredComponent;
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
