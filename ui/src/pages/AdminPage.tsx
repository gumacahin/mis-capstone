import { useAuth0 } from "@auth0/auth0-react";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import PeopleIcon from "@mui/icons-material/People";
import TaskIcon from "@mui/icons-material/Task";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Admin, Resource, useRecordContext } from "react-admin";
import { useNavigate } from "react-router-dom";
import striptags from "striptags";

import AdminDashboard from "../components/AdminDashboard";
import AdminProjectEdit from "../components/AdminProjectEdit";
import AdminProjectList from "../components/AdminProjectList";
import AdminProjectShow from "../components/AdminProjectShow";
import AdminTagEdit from "../components/AdminTagEdit";
import AdminTagList from "../components/AdminTagList";
import AdminTagShow from "../components/AdminTagShow";
import AdminTaskEdit from "../components/AdminTaskEdit";
import AdminTaskList from "../components/AdminTaskList";
import AdminTaskShow from "../components/AdminTaskShow";
import AdminUserEdit from "../components/AdminUserEdit";
import AdminUserList from "../components/AdminUserList";
import AdminUserShow from "../components/AdminUserShow";
import useDrfDataProvider from "../hooks/useDrfDataProvider";
import { Task } from "../types/common";

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
      dashboard={AdminDashboard}
    >
      <Resource
        name="tasks"
        list={AdminTaskList}
        recordRepresentation={<TaskRecord />}
        show={AdminTaskShow}
        edit={AdminTaskEdit}
        icon={TaskIcon}
      />
      <Resource
        name="projects"
        list={AdminProjectList}
        recordRepresentation={(record) => record.title}
        show={AdminProjectShow}
        edit={AdminProjectEdit}
        icon={CategoryIcon}
      />
      <Resource
        name="tags"
        list={AdminTagList}
        show={AdminTagShow}
        edit={AdminTagEdit}
        recordRepresentation={(record) => record.name}
        icon={LabelIcon}
      />
      <Resource
        name="users"
        list={AdminUserList}
        show={AdminUserShow}
        edit={AdminUserEdit}
        recordRepresentation={(record) => record.profile.name ?? `TODO USER`}
        icon={PeopleIcon}
      />
    </Admin>
  );
}

function TaskRecord() {
  const record = useRecordContext<Task>();
  return (
    <Typography maxWidth={120} noWrap variant="body2" color="text.primary">
      {striptags(record?.title ?? "")}
    </Typography>
  );
}
