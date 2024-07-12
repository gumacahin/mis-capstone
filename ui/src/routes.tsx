import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TodayPage from './pages/TodayPage';
import { Alert, Box, Button, Fab } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';


export function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    if (isLoading) {
        return "Checking authentication...";
    }

    if (!isAuthenticated) {
        navigate('/');
    }
    return <Outlet />
}

export function RootErrorBoundary() {
    // const error = useRouteError() as Error;
    return (
        <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // This assumes the Box is directly within the body or a full-height container
        }}>
            <Alert
            severity="warning"
            action={
                <Button onClick={() => window.location.reload() } color="inherit" size="small">
                    REFRESH
                </Button>
            }>
            Something went wrong. Please try refreshing the page.
            </Alert>
        </Box>
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
            // loader: teamLoader,
          },
          {
            path: "/",
            element: <ProtectedRoute />,
            children: [
              {
                path: "/today",
                element: <TodayPage />,
                name: "dashboard"
              },
            ]
          },
        ],
      },
]

export default routes
