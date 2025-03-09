import { useAuth0 } from "@auth0/auth0-react";
import Button, { ButtonProps } from "@mui/material/Button";
import { ReactNode } from "react";

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
      <Button color="inherit" onClick={() => loginWithRedirect()} {...props}>
        {children ?? "Log In"}
      </Button>
    )
  );
};

export default LoginButton;
