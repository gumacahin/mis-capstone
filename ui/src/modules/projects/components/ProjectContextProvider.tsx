import ProjectContext from "@shared/contexts/projectContext";
import type { ProjectDetail } from "@shared/types/common";

export function ProjectContextProvider({
  children,
  project,
}: {
  children: React.ReactNode;
  project: ProjectDetail;
}) {
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}
