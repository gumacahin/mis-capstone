import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import Spinner from "@shared/components/Spinner";
import AppLayout from "@views/components/AppLayout";
import { Outlet } from "react-router-dom";

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
