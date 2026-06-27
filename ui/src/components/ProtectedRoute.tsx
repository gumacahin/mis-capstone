import { Box } from "@mui/material";
import Spinner from "@shared/components/Spinner";
import AppLayout from "@views/components/AppLayout";
import { Outlet } from "react-router-dom";

import { withAuthenticationRequired } from "./AuthProviderWrapper";

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
