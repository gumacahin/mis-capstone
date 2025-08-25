import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

const LogoutButton = () => {
  const { user, isLoading, logout } = useAuth0();

  if (isLoading) {
    return null;
  }

  return (
    user && (
      <Button
        color="inherit"
        onClick={() => {
          logout({ logoutParams: { returnTo: window.location.origin } });
        }}
      >
        Log Out
      </Button>
    )
  );
};

export default LogoutButton;
