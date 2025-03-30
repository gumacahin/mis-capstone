import ProjectContext from "../contexts/projectContext";
import type { ProjectDetail } from "../types/common";

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
