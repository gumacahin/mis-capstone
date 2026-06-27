import Button, { type ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";

import { useAuth0 } from "@/components/AuthProviderWrapper";

interface LoginButtonProps extends ButtonProps {
  children?: ReactNode;
}

const LoginButton = ({ children, ...props }: LoginButtonProps) => {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return null;
  }

  return (
    !isAuthenticated && (
      <Button
        color="inherit"
        onClick={async () => {
          await loginWithRedirect();
        }}
        {...props}
      >
        {children ?? "Log In"}
      </Button>
    )
  );
};

export default LoginButton;
