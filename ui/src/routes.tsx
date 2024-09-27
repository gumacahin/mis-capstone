import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TodayPage from "./pages/TodayPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { Alert, Box, Button, Container } from "@mui/material";
import { useRouteError } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

export function RootErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh", // This assumes the Box is directly within the body or a full-height container
        }}
      >
        <Alert
          severity="warning"
          action={
            <Button
              onClick={() => window.location.reload()}
              color="inherit"
              size="small"
            >
              REFRESH
            </Button>
          }
        >
          Something went wrong. Please try refreshing the page.
        </Alert>
        <Box component={"pre"}>{error.message}</Box>
      </Box>
    </Container>
  );
}

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
        name: "home",
      },
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/today",
            element: <TodayPage />,
            name: "dashboard",
          },
          {
            path: "/profile",
            element: <ProfilePage />,
            name: "profile",
          },
          {
            path: "/settings",
            element: <SettingsPage />,
            name: "profile",
          },
        ],
      },
    ],
  },
];

export default routes;
