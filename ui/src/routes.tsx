import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TodayPage from './pages/TodayPage';
import { Alert, Box, Button, Container } from '@mui/material';
import { useNavigate, useRouteError, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { QueryClient } from '@tanstack/react-query';


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
    const error = useRouteError() as Error;
    return (
      <Container>
          <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
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
              <Box component={'pre'}>
                {error.message}
              </Box>
          </Box>
      </Container>
    );
}

const queryClient = new QueryClient();
const authLoader = () => {
  return queryClient.fetchQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await fetch('/api/users/me');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    staleTime: 10000,
  });
};

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
            loader: authLoader,
          },
          {
            loader: authLoader,
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
