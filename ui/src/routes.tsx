import { Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RootErrorBoundary from "./components/RootErrorBoundry";
import HomePage from "./pages/HomePage";
import InboxPage from "./pages/InboxPage";
import SettingsPage from "./pages/SettingsPage";
import TodayPage from "./pages/TodayPage";
import UpcomingPage from "./pages/UpcomingPage";

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
            element: <Navigate to="/app/today" replace />,
          },
          {
            path: "today",
            element: <TodayPage />,
            name: "today",
          },
          {
            path: "inbox",
            element: <InboxPage />,
            name: "inbox",
          },
          {
            path: "upcoming",
            element: <UpcomingPage />,
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
