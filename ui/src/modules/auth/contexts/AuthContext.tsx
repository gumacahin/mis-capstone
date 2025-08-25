import { useAuth0 } from "@auth0/auth0-react";
import { createContext, type ReactNode, useContext } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  error: any;
  loginWithRedirect: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user,
    isLoading: loading,
    error,
    loginWithRedirect,
    logout: auth0Logout,
    isAuthenticated,
  } = useAuth0();

  const logout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    loginWithRedirect,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
