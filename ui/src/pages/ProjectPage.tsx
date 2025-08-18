import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ProjectView from "@projects/components/ProjectView";
import ProjectViewMenu from "@projects/components/ProjectViewMenu";
import SkeletonList from "@shared/components/SkeletonList";
import ProjectContext from "@shared/contexts/projectContext";
import { useProject, useTask } from "@shared/hooks/queries";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import useUpdateTaskDialogContext from "@shared/hooks/useUpdateTaskDialogContext";
import PageLayout from "@views/components/PageLayout";
import ViewPageTitle from "@views/components/ViewPageTitle";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
