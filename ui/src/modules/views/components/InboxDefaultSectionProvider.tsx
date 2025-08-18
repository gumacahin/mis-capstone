import ProfileContext from "@shared/contexts/profileContext";
import ProjectContext from "@shared/contexts/projectContext";
import SectionContext from "@shared/contexts/sectionContext";
import { ProjectDetail, Section } from "@shared/types/common";
import { ReactNode, useContext } from "react";

export default function InboxDefaultSectionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { projects } = useContext(ProfileContext)!;
  const inbox = projects.find((p) => p.is_default)!;
  const inboxDefaultSection = inbox.sections.find((s) => s.is_default)!;

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
