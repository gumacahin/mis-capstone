import Dashboard from "@admin/components/AdminDashboard";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import useDrfDataProvider from "@shared/hooks/useDrfDataProvider";
import { useEffect } from "react";
import { Admin } from "react-admin";
import { useNavigate } from "react-router-dom";

import { useAuth0 } from "@/components/AuthProviderWrapper";

const API_BASE_URL = import.meta.env.VITE_API_ADMIN_BASE_URL;

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const dataProvider = useDrfDataProvider(API_BASE_URL);

  useEffect(() => {
    // if (isAuthenticated) {
    //   navigate(ROUTES.TODAY);
    // }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{
          color: (theme) => theme.palette.common.white,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      dashboard={Dashboard}
    />
  );
}
