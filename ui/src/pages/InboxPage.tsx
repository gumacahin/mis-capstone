import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import ProjectView from "@projects/components/ProjectView";
import ProjectViewMenu from "@projects/components/ProjectViewMenu";
import SkeletonList from "@shared/components/SkeletonList";
import { useInboxTasks, useProfile } from "@shared/hooks/queries";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import { Project } from "@shared/types/common";
import InboxDefaultSectionProvider from "@views/components/InboxDefaultSectionProvider";
import ViewPageTitle from "@views/components/ViewPageTitle";
import { useEffect } from "react";

export default function InboxPage() {
  const { data } = useProfile();
  const inbox = data?.projects.find((p: Project) => p.is_default);
  const { isPending, isError, data: project } = useInboxTasks(inbox?.id);
  const pageTitle = "Inbox";
  const { setToolbarIcons, setToolbarTitle } = useToolbarContext();

  useEffect(() => {
    setToolbarTitle(<ViewPageTitle title={pageTitle} />);
    setToolbarIcons(<ProjectViewMenu project={inbox} />);
    return () => {
      setToolbarIcons(null);
      setToolbarTitle(null);
    };
  }, [inbox, pageTitle, setToolbarTitle, setToolbarIcons]);

  if (isError) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Failed to load inbox</Alert>
      </Container>
    );
  }

  if (isPending) {
    return (
      <Container maxWidth="lg">
        <SkeletonList count={10} width={300} />
      </Container>
    );
  }

  return (
    <InboxDefaultSectionProvider>
      <ProjectView project={project} />
    </InboxDefaultSectionProvider>
  );
}
