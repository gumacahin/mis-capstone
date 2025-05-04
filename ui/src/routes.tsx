import { Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RootErrorBoundary from "./components/RootErrorBoundry";
import HomePage from "./pages/HomePage";
import InboxPage from "./pages/InboxPage";
import LabelsListPage from "./pages/LabelsListPage";
import LabelTasksPage from "./pages/LabelTasksPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectsListPage from "./pages/ProjectsListPage";
import SettingsPage from "./pages/SettingsPage";
import TodayPage from "./pages/TodayPage";
import UpcomingPage from "./pages/UpcomingPage";

const HOME = "home";
const APP = "app";
const TODAY = "today";
const INBOX = "inbox";
const UPCOMING = "upcoming";
const PROJECTS = "projects";
const LABELS = "labels";
const PROJECT_DETAILS = "projectDetails";
const LABEL_TASKS = "labelTasks";
const SETTINGS = "settings";

export const ROUTES = {
  HOME,
  APP,
  TODAY,
  INBOX,
  UPCOMING,
  PROJECTS,
  LABELS,
  LABEL_TASKS,
  PROJECT_DETAILS,
  SETTINGS,
};

const routes = [
  {
    path: "/",
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
        name: ROUTES.HOME,
      },
      {
        path: "app",
        name: ROUTES.APP,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="today" replace />,
          },
          {
            path: "today",
            element: <TodayPage />,
            name: ROUTES.TODAY,
          },
          {
            path: "inbox",
            element: <InboxPage />,
            name: ROUTES.INBOX,
          },
          {
            path: "upcoming",
            element: <UpcomingPage />,
            name: ROUTES.UPCOMING,
          },
          {
            path: "projects",
            element: <ProjectsListPage />,
            name: ROUTES.PROJECTS,
            end: true,
          },
          {
            path: "project/:projectId",
            element: <ProjectPage />,
            name: ROUTES.PROJECT_DETAILS,
          },
          {
            path: "labels",
            element: <LabelsListPage />,
            name: ROUTES.LABELS,
          },
          {
            path: "label/:slug",
            element: <LabelTasksPage />,
            name: ROUTES.LABEL_TASKS,
          },
          {
            path: "settings",
            element: <SettingsPage />,
            name: ROUTES.SETTINGS,
          },
        ],
      },
    ],
  },
];

export default routes;
