import { Alert, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { useInboxTasks, useProfile } from "../api";
import InboxDefaultSectionProvider from "../components/InboxDefaultSectionProvider";
import PageLayout from "../components/PageLayout";
import ProjectView from "../components/ProjectView";
import ProjectViewMenu from "../components/ProjectViewMenu";
import SkeletonList from "../components/SkeletonList";
import { Project } from "../types/common";

export default function InboxPage() {
  const { data } = useProfile();
  const inbox = data?.projects.find((p: Project) => p.is_default);
  const { isPending, isError, data: project } = useInboxTasks(inbox?.id);
  const pageTitle = "Inbox";

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
  console.log("inbox", project);

  return (
    <PageLayout>
      <InboxDefaultSectionProvider>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box display={"flex"} alignItems={"center"}>
              <Typography fontSize={32} variant={"h1"}>
                {pageTitle}
              </Typography>
            </Box>
            <ProjectViewMenu project={project} />
          </Box>
          <Box
            sx={[
              project.view === "list" && {
                mx: 6,
              },
            ]}
          >
            <ProjectView project={project} />
          </Box>
        </Stack>
      </InboxDefaultSectionProvider>
    </PageLayout>
  );
}
