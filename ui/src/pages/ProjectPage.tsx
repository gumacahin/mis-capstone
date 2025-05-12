import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageLayout from "../components/PageLayout";
import ProjectView from "../components/ProjectView";
import ProjectViewMenu from "../components/ProjectViewMenu";
import SkeletonList from "../components/SkeletonList";
import ViewPageTitle from "../components/ViewPageTitle";
import ProjectContext from "../contexts/projectContext";
import { useProject } from "../hooks/queries";
import useToolbarContext from "../hooks/useToolbarContext";

export default function ProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { isPending, isError, data: project } = useProject(Number(projectId));
  const { setToolbarIcons, setToolbarTitle } = useToolbarContext();

  const projectTitle = project?.title || "";

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
