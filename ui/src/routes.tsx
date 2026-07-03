import Box from "@mui/material/Box";
import Spinner from "@shared/components/Spinner";
import { lazy, type ReactNode, Suspense } from "react";
import { Navigate } from "react-router-dom";

import RootErrorBoundary from "./components/RootErrorBoundry";

const AdminPage = lazy(() => import("./pages/AdminPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const InboxPage = lazy(() => import("./pages/InboxPage"));
const LabelsListPage = lazy(() => import("./pages/LabelsListPage"));
const LabelTasksPage = lazy(() => import("./pages/LabelTasksPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const ProductivityPage = lazy(() => import("./pages/ProductivityPage"));
const ProjectPage = lazy(() => import("./pages/ProjectPage"));
const ProjectsListPage = lazy(() => import("./pages/ProjectsListPage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const TaskPage = lazy(() => import("./pages/TaskPage"));
const TodayPage = lazy(() => import("./pages/TodayPage"));
const UpcomingPage = lazy(() => import("./pages/UpcomingPage"));

const ADMIN = "admin";
const APP = "app";
const HOME = "home";
const INBOX = "inbox";
const LABELS = "labels";
const LABEL_TASKS = "labelTasks";
const ONBOARDING = "onboarding";
const PRODUCTIVITY = "productivity";
const PROJECTS = "projects";
const PROJECT_DETAILS = "projectDetails";
const SETTINGS = "settings";
const TASK = "task";
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
  PRODUCTIVITY,
  PROJECTS,
  PROJECT_DETAILS,
  SETTINGS,
  TASK,
  TODAY,
  UPCOMING,
};

const routeFallback = (
  <Box display="flex" justifyContent="center" alignItems="center" p={3}>
    <Spinner />
  </Box>
);

function lazyRoute(element: ReactNode) {
  return <Suspense fallback={routeFallback}>{element}</Suspense>;
}

const routes = [
  {
    path: "/",
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: lazyRoute(<HomePage />),
        name: ROUTES.HOME,
      },
      {
        path: "onboarding",
        element: lazyRoute(<OnboardingPage />),
        name: ROUTES.ONBOARDING,
      },
      {
        path: "admin/*",
        element: lazyRoute(<AdminPage />),
        name: ROUTES.ADMIN,
      },
      {
        path: "/",
        name: ROUTES.APP,
        element: lazyRoute(<ProtectedRoute />),
        children: [
          {
            index: true,
            element: <Navigate to="today" replace />,
          },
          {
            path: "today",
            element: lazyRoute(<TodayPage />),
            name: ROUTES.TODAY,
          },
          {
            path: "inbox",
            element: lazyRoute(<InboxPage />),
            name: ROUTES.INBOX,
          },
          {
            path: "upcoming",
            element: lazyRoute(<UpcomingPage />),
            name: ROUTES.UPCOMING,
          },
          {
            path: "projects",
            element: lazyRoute(<ProjectsListPage />),
            name: ROUTES.PROJECTS,
            end: true,
          },
          {
            path: "project/:projectId",
            element: lazyRoute(<ProjectPage />),
            name: ROUTES.PROJECT_DETAILS,
          },
          {
            path: "task/:taskId",
            element: lazyRoute(<TaskPage />),
            name: ROUTES.TASK,
          },
          {
            path: "labels",
            element: lazyRoute(<LabelsListPage />),
            name: ROUTES.LABELS,
          },
          {
            path: "label/:slug",
            element: lazyRoute(<LabelTasksPage />),
            name: ROUTES.LABEL_TASKS,
          },
          {
            path: "productivity",
            element: lazyRoute(<ProductivityPage />),
            name: ROUTES.PRODUCTIVITY,
          },
          {
            path: "settings",
            element: lazyRoute(<SettingsPage />),
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
