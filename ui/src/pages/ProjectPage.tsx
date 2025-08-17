import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/PageLayout";
import ProjectView from "../components/ProjectView";
import ProjectViewMenu from "../components/ProjectViewMenu";
import SkeletonList from "../components/SkeletonList";
import ViewPageTitle from "../components/ViewPageTitle";
import ProjectContext from "../contexts/projectContext";
import { useProject } from "../hooks/queries";
import { useTask } from "../hooks/queries";
import useToolbarContext from "../hooks/useToolbarContext";
import useUpdateTaskDialogContext from "../hooks/useUpdateTaskDialogContext";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const { isPending, isError, data: project } = useProject(Number(projectId));
  const { setToolbarIcons, setToolbarTitle } = useToolbarContext();
  const { setTask } = useUpdateTaskDialogContext();

  const projectTitle = project?.title || "";

  const taskId = location.state?.taskId ? Number(location.state.taskId) : null;
  const { data: task } = useTask(taskId, !!taskId);

  useEffect(() => {
    if (task && project) {
      setTask(task);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [task, project, setTask, navigate, location.pathname]);

  useEffect(() => {
    setToolbarTitle(
      <Stack direction="row" spacing={1} alignItems="center">
        <Button onClick={() => navigate("/projects")}>My Projects /</Button>
        <ViewPageTitle title={projectTitle} />
      </Stack>,
    );
    setToolbarIcons(<>{project && <ProjectViewMenu project={project} />}</>);
    return () => {
      setToolbarIcons(null);
      setToolbarTitle(null);
    };
  }, [project, projectTitle, setToolbarTitle, setToolbarIcons, navigate]);

  if (isError) {
    return (
      <PageLayout>
        <Alert severity="error">Failed to load project</Alert>
      </PageLayout>
    );
  }

  if (isPending) {
    return <SkeletonList count={5} width={250} />;
  }

  return (
    <ProjectContext.Provider value={project}>
      <ProjectView project={project} />
    </ProjectContext.Provider>
  );
}
