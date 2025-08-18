import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

const LogoutButton = () => {
  const { logout, isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return null;
  }

  return (
    isAuthenticated && (
      <Button
        color="inherit"
        onClick={async () => {
          await logout({ logoutParams: { returnTo: window.location.origin } });
        }}
      >
        Log Out
      </Button>
    )
  );
};

export default LogoutButton;
