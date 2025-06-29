import "./App.css";

import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ProfileContextProvider } from "./components/ProfileContextProvider";
import Spinner from "./components/Spinner";
import { useProfile } from "./hooks/queries";
import routes from "./routes";

function App() {
  const { isLoading, error, user } = useAuth0();
  const {
    isLoading: profileLoading,
    error: profileError,
    data: profile,
  } = useProfile(!!user);

  if (error || profileError) {
    return (
      <Alert severity="error">{error?.message ?? profileError?.message}</Alert>
    );
  }

  if (isLoading || profileLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <ProfileContextProvider profile={profile}>
      <Toaster />
      <RouterProvider router={createBrowserRouter(routes)} />
    </ProfileContextProvider>
  );
}

export default App;
