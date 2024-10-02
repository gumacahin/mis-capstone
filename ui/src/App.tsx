import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { useAuth0 } from "@auth0/auth0-react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import { Box } from "@mui/material";
import Spinner from "./components/Spinner";

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
