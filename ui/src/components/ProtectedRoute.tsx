import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import PersistentDrawerLeft from "./PersistentDrawerLeft";
import Spinner from "./Spinner";

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
