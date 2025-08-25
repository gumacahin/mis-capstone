import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";

interface SignupButtonProps extends ButtonProps {
  children?: ReactNode;
}

const SignupButton = ({ children, ...props }: SignupButtonProps) => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  const handleSignup = async () => {
    try {
      // For signup, we can pass additional parameters to hint at signup flow
      await loginWithRedirect({
        appState: { returnTo: "/onboarding" },
        authorizationParams: {
          screen_hint: "signup",
        },
      });
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  if (user || isAuthenticated) {
    return null;
  }

  return (
    <Button
      color="inherit"
      onClick={handleSignup}
      data-testid="signup-button"
      {...props}
    >
      {children ?? "Sign Up"}
    </Button>
  );
};

export default SignupButton;
