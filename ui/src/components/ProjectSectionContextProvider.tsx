import SectionContext from "../contexts/sectionContext";
import type { Section } from "../types/common";

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
