import { Outlet } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import PersistentDrawerLeft from "./PersistentDrawerLeft";
import Spinner from "./Spinner";
import { Box } from "@mui/material";

export function ProtectedRoute() {
  return (
    <PersistentDrawerLeft>
      <Outlet />
    </PersistentDrawerLeft>
  );
}

export default withAuthenticationRequired(ProtectedRoute, {
  onRedirecting: () => (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Spinner />
    </Box>
  ),
});
