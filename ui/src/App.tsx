import "./App.css";

import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Spinner from "@shared/components/Spinner";
import { useProfile } from "@shared/hooks/queries";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useAuth0 } from "./components/AuthProviderWrapper";
import { ProfileContextProvider } from "./components/ProfileContextProvider";
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RouterProvider router={createBrowserRouter(routes)} />
      </LocalizationProvider>
    </ProfileContextProvider>
  );
}

export default App;
