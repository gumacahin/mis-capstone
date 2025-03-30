import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { useEffect } from "react";

import InboxDefaultSectionProvider from "../components/InboxDefaultSectionProvider";
import ProjectView from "../components/ProjectView";
import ProjectViewMenu from "../components/ProjectViewMenu";
import SkeletonList from "../components/SkeletonList";
import ViewPageTitle from "../components/ViewPageTitle";
import { useInboxTasks, useProfile } from "../hooks/queries";
import useToolbarContext from "../hooks/useToolbarContext";
import { Project } from "../types/common";

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
