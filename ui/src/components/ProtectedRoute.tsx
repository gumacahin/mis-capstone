import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import PersistentDrawerLeft from "./PersistentDrawerLeft";
import Spinner from "./Spinner";

const ProtectedRoute = withAuthenticationRequired(
  () => (
    <PersistentDrawerLeft>
      <Outlet />
    </PersistentDrawerLeft>
  ),
  {
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
  },
);

export default ProtectedRoute;
