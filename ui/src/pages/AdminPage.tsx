import Dashboard from "@admin/components/AdminDashboard";
import AdminProjectEdit from "@admin/components/AdminProjectEdit";
import AdminProjectList from "@admin/components/AdminProjectList";
import AdminProjectShow from "@admin/components/AdminProjectShow";
import AdminTagEdit from "@admin/components/AdminTagEdit";
import AdminTagList from "@admin/components/AdminTagList";
import AdminTagShow from "@admin/components/AdminTagShow";
import AdminTaskEdit from "@admin/components/AdminTaskEdit";
import AdminTaskList from "@admin/components/AdminTaskList";
import AdminTaskShow from "@admin/components/AdminTaskShow";
import AdminUserEdit from "@admin/components/AdminUserEdit";
import AdminUserList from "@admin/components/AdminUserList";
import AdminUserShow from "@admin/components/AdminUserShow";
import { useAuth0 } from "@auth0/auth0-react";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import PeopleIcon from "@mui/icons-material/People";
import TaskIcon from "@mui/icons-material/Task";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import useDrfDataProvider from "@shared/hooks/useDrfDataProvider";
import { Task } from "@shared/types/common";
import { useEffect } from "react";
import { Admin, Resource, useRecordContext } from "react-admin";
import { useNavigate } from "react-router-dom";
import striptags from "striptags";

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
    <Admin basename="/admin" dataProvider={dataProvider} dashboard={Dashboard}>
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
