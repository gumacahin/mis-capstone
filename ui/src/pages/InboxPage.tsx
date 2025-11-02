import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import ProjectView from "@projects/components/ProjectView";
import ProjectViewMenu from "@projects/components/ProjectViewMenu";
import SkeletonList from "@shared/components/SkeletonList";
import { useInboxTasks } from "@shared/hooks/queries";
import { useInboxTasksList } from "@shared/hooks/queries";
import useInbox from "@shared/hooks/useInbox";
import useToolbarContext from "@shared/hooks/useToolbarContext";
import InboxDefaultSectionProvider from "@views/components/InboxDefaultSectionProvider";
import ViewPageTitle from "@views/components/ViewPageTitle";
import { useEffect, useMemo } from "react";

export default function InboxPage() {
  const { inbox, isLoading: inboxLoading, error: inboxError } = useInbox();
  const {
    isPending: projectPending,
    isError: projectError,
    data: project,
  } = useInboxTasks(inbox?.id);
  const {
    isPending: tasksPending,
    isError: tasksError,
    data: tasksData,
  } = useInboxTasksList();
  const pageTitle = "Inbox";
  const { setToolbarIcons, setToolbarTitle } = useToolbarContext();

  // Combine project structure with tasks
  const projectWithTasks = useMemo(() => {
    if (!project || !tasksData) return project;

    const tasks = tasksData.results || [];

    // Group tasks by section
    const tasksBySection = tasks.reduce(
      (acc, task) => {
        const sectionId = task.section || "default";
        if (!acc[sectionId]) acc[sectionId] = [];
        acc[sectionId].push(task);
        return acc;
      },
      {} as Record<string | number, typeof tasks>,
    );

    // Populate sections with their tasks
    const sectionsWithTasks = project.sections.map((section) => ({
      ...section,
      tasks: tasksBySection[section.id] || [],
    }));

    return {
      ...project,
      sections: sectionsWithTasks,
    };
  }, [project, tasksData]);

  const isPending = inboxLoading || projectPending || tasksPending;
  const isError = projectError || tasksError;

  useEffect(() => {
    setToolbarTitle(<ViewPageTitle title={pageTitle} />);
    setToolbarIcons(<ProjectViewMenu project={inbox} />);
    return () => {
      setToolbarIcons(null);
      setToolbarTitle(null);
    };
  }, [inbox, pageTitle, setToolbarTitle, setToolbarIcons]);

  // Handle inbox-specific errors first
  if (inboxError) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          {inboxError.message || "Failed to load inbox"}
        </Alert>
      </Container>
    );
  }

  // Handle inbox tasks errors
  if (isError) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">Failed to load inbox tasks</Alert>
      </Container>
    );
  }

  // Show loading state while any data is loading
  if (isPending) {
    return (
      <Container maxWidth="lg">
        <SkeletonList count={10} width={300} />
      </Container>
    );
  }

  if (!projectWithTasks) {
    return (
      <Container>
        <Alert severity="error">
          Unable to load inbox project. Please try refreshing the page.
        </Alert>
      </Container>
    );
  }

  return (
    <InboxDefaultSectionProvider>
      <ProjectView project={projectWithTasks} />
    </InboxDefaultSectionProvider>
  );
}
