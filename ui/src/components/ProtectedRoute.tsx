import { Outlet } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

export function ProtectedRoute() {
  return <Outlet />;
}

export default withAuthenticationRequired(ProtectedRoute, {
  onRedirecting: () => <div>Loading...</div>,
});
