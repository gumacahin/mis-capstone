import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";

interface LoginButtonProps extends ButtonProps {
  children?: ReactNode;
}

const LoginButton = ({ children, ...props }: LoginButtonProps) => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (user || isAuthenticated) {
    return null;
  }

  return (
    <Button
      color="inherit"
      onClick={handleLogin}
      data-testid="login-button"
      {...props}
    >
      {children ?? "Log In"}
    </Button>
  );
};

export default LoginButton;
