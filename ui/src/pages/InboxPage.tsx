import { Alert, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";

import { useInboxTasks, useProfile } from "../api";
import InboxDefaultSectionProvider from "../components/InboxDefaultSectionProvider";
import PageLayout from "../components/PageLayout";
import ProjectView from "../components/ProjectView";
import ProjectViewMenu from "../components/ProjectViewMenu";
import SkeletonList from "../components/SkeletonList";
import useToolbarContext from "../hooks/useToolbarContext";
import { Project } from "../types/common";

export default function InboxPage() {
  const { data } = useProfile();
  const inbox = data?.projects.find((p: Project) => p.is_default);
  const { isPending, isError, data: project } = useInboxTasks(inbox?.id);
  const pageTitle = "Inbox";
  const { setToolbarItems } = useToolbarContext();

  useEffect(() => {
    setToolbarItems(
      <Stack direction="row" width="100%" justifyContent="space-between">
        <Box>
          <Typography variant={"h5"} component={"h2"} color="text.primary">
            {pageTitle}
          </Typography>
        </Box>
        <ProjectViewMenu project={inbox} />
      </Stack>,
    );
    return () => setToolbarItems(null);
  }, [inbox, pageTitle, setToolbarItems]);

  if (isError) {
    return (
      <PageLayout>
        <Alert severity="error">Failed to load inbox</Alert>
      </PageLayout>
    );
  }

  if (isPending) {
    return (
      <PageLayout>
        <SkeletonList count={5} width={250} />
      </PageLayout>
    );
  }

  return (
    <InboxDefaultSectionProvider>
      <ProjectView project={project} />
    </InboxDefaultSectionProvider>
  );
}
