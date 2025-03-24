import { Alert, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { useInboxTasks } from "../api";
import PageLayout from "../components/PageLayout";
import ProjectView from "../components/ProjectView";
import ProjectViewMenu from "../components/ProjectViewMenu";
import SkeletonList from "../components/SkeletonList";

export default function InboxPage() {
  const { isPending, isError, data: project } = useInboxTasks();
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

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
