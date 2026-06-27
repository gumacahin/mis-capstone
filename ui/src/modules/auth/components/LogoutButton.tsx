import Button from "@mui/material/Button";

import { useAuth0 } from "@/components/AuthProviderWrapper";

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
