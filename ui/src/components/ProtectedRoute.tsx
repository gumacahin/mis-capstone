import { Outlet } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import PersistentDrawerLeft from "./PersistentDrawerLeft";

export function ProtectedRoute() {
  return (
    <PersistentDrawerLeft>
      <Outlet />
    </PersistentDrawerLeft>
  );
}

export default withAuthenticationRequired(ProtectedRoute, {
  onRedirecting: () => <div>Loading...</div>,
});
