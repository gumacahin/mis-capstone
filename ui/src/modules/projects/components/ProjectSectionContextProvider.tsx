import type { Section } from "@shared";
import SectionContext from "@shared/contexts/sectionContext";

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
