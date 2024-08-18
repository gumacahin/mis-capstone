import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { useAuth0 } from "@auth0/auth0-react";
import { Toaster } from "react-hot-toast";

import "./App.css";

function App() {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={createBrowserRouter(routes)} />
    </>
  );
}

export default App;
