import { ReactNode, useContext } from "react";

import ProfileContext from "../contexts/profileContext";
import ProjectContext from "../contexts/projectContext";
import SectionContext from "../contexts/sectionContext";
import { ProjectDetail, Section } from "../types/common";

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
