import "./App.css";

import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Spinner from "./components/Spinner";
import routes from "./routes";

function App() {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
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
    <>
      <Toaster />
      <RouterProvider router={createBrowserRouter(routes)} />
    </>
  );
}

export default App;
