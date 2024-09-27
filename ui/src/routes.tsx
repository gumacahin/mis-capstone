import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TodayPage from "./pages/TodayPage";
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
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
        name: "home",
      },
      {
        path: "app",
        name: "app",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            path: "today",
            element: <TodayPage />,
            name: "today",
          },
          {
            path: "inbox",
            element: <h1>Inbox</h1>,
            name: "inbox",
          },
          {
            path: "upcoming",
            element: <h1>Upcoming</h1>,
            name: "upcoming",
          },
          {
            path: "settings",
            element: <SettingsPage />,
            name: "settings",
          },
        ],
      },
    ],
  },
];

export default routes;
