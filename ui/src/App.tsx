import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
import { useAuth0 } from "@auth0/auth0-react";

import "./App.css";

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={createBrowserRouter(routes)} />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
