import { ProjectDetail, Section } from "@shared";
import ProjectContext from "@shared/contexts/projectContext";
import SectionContext from "@shared/contexts/sectionContext";
import useInbox from "@shared/hooks/useInbox";
import { ReactNode } from "react";

export default function InboxDefaultSectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { inbox, isLoading, error } = useInbox();

  // Handle loading state
  if (isLoading) {
    return <div>Loading inbox...</div>;
  }

  // Handle errors from useInbox hook
  if (error) {
    console.error("❌ InboxDefaultSectionProvider - useInbox error:", error);
    return <div>Error: {error.message}</div>;
  }

  // Handle case where inbox exists but has no sections
  if (!inbox?.sections || inbox.sections.length === 0) {
    console.error("❌ InboxDefaultSectionProvider - Inbox has no sections!");
    console.error("Inbox project:", inbox);
    return <div>Error: Inbox has no sections</div>;
  }

  // Find the default section
  const inboxDefaultSection = inbox.sections.find((s) => s.is_default);

  if (!inboxDefaultSection) {
    console.error("❌ InboxDefaultSectionProvider - No default section found!");
    console.error(
      "Available sections:",
      inbox.sections.map((s) => ({
        id: s.id,
        title: s.title,
        is_default: s.is_default,
      })),
    );

    // Fallback: use the first section if no default section is found
    const fallbackSection = inbox.sections[0];
    console.warn("🔄 Using fallback section:", fallbackSection);

    return (
      <ProjectContext.Provider value={inbox as unknown as ProjectDetail}>
        <SectionContext.Provider value={fallbackSection as unknown as Section}>
          {children}
        </SectionContext.Provider>
      </ProjectContext.Provider>
    );
  }

  return (
    <ProjectContext.Provider value={inbox as unknown as ProjectDetail}>
      <SectionContext.Provider
        value={inboxDefaultSection as unknown as Section}
      >
        {children}
      </SectionContext.Provider>
    </ProjectContext.Provider>
  );
}
