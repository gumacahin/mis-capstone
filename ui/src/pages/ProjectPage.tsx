import { Alert, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useProject } from "../api";
import PageLayout from "../components/PageLayout";
import ProjectView from "../components/ProjectView";
import ProjectViewMenu from "../components/ProjectViewMenu";
import SkeletonList from "../components/SkeletonList";
import ProjectContext from "../contexts/projectContext";
import useToolbarContext from "../hooks/useToolbarContext";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { isPending, isError, data: project } = useProject(Number(projectId));
  const { setToolbarItems } = useToolbarContext();

  const projectTitle = project?.title || "";

  useEffect(() => {
    setToolbarItems(
      <Stack direction="row" width="100%" justifyContent="space-between">
        <Box>
          <Typography variant={"h5"} component={"h2"} color="text.primary">
            {projectTitle}
          </Typography>
        </Box>
        {project && <ProjectViewMenu project={project} />}
      </Stack>,
    );
    return () => setToolbarItems(null);
  }, [project, projectTitle, setToolbarItems]);

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
