import { Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import RootErrorBoundary from "./components/RootErrorBoundry";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import InboxPage from "./pages/InboxPage";
import LabelsListPage from "./pages/LabelsListPage";
import LabelTasksPage from "./pages/LabelTasksPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectsListPage from "./pages/ProjectsListPage";
import SettingsPage from "./pages/SettingsPage";
import TodayPage from "./pages/TodayPage";
import UpcomingPage from "./pages/UpcomingPage";

const ADMIN = "admin";
const APP = "app";
const HOME = "home";
const INBOX = "inbox";
const LABELS = "labels";
const LABEL_TASKS = "labelTasks";
const ONBOARDING = "onboarding";
const PROJECTS = "projects";
const PROJECT_DETAILS = "projectDetails";
const SETTINGS = "settings";
const TODAY = "today";
const UPCOMING = "upcoming";

export const ROUTES = {
  ADMIN,
  APP,
  HOME,
  INBOX,
  LABELS,
  LABEL_TASKS,
  ONBOARDING,
  PROJECTS,
  PROJECT_DETAILS,
  SETTINGS,
  TODAY,
  UPCOMING,
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
        path: "onboarding",
        element: <OnboardingPage />,
        name: ROUTES.ONBOARDING,
      },
      {
        path: "admin/*",
        element: <AdminPage />,
        name: ROUTES.ADMIN,
      },
      {
        path: "/",
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
          {
            path: "*",
            element: <Navigate to="today" replace />,
          },
        ],
      },
    ],
  },
];

export default routes;
