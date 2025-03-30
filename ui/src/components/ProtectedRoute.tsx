import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import AppLayout from "./AppLayout";
import Spinner from "./Spinner";

const ProtectedRoute = withAuthenticationRequired(
  () => {
    // const queryClient = useQueryClient();
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  },
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
