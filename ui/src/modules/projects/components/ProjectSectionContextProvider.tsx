import SectionContext from "@shared/contexts/sectionContext";
import type { Section } from "@shared/types/common";

export function ProjectSectionContextProvider({
  children,
  section,
}: {
  children: React.ReactNode;
  section: Section;
}) {
  return (
    <SectionContext.Provider value={section}>
      {children}
    </SectionContext.Provider>
  );
}
