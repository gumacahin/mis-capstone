import { useAuth0 } from "@auth0/auth0-react";
import Button, { type ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";

interface SignupButtonProps extends ButtonProps {
  children?: ReactNode;
}

const SignupButton = ({ children, ...props }: SignupButtonProps) => {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return null;
  }

  return (
    !isAuthenticated && (
      <Button
        color="inherit"
        onClick={async () => {
          await loginWithRedirect({
            authorizationParams: {
              screen_hint: "signup",
            },
          });
        }}
        {...props}
      >
        {children ?? "Sign Up"}
      </Button>
    )
  );
};

export default SignupButton;
