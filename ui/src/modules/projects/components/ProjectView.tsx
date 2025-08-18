import { ProjectDetail } from "@shared/types/common";

import ProjectViewBoard from "./ProjectViewBoard";
import ProjectViewList from "./ProjectViewList";

export default function ProjectView({ project }: { project: ProjectDetail }) {
  const isListView = project.view === "list";
  return (
    <>
      {isListView ? (
        <ProjectViewList project={project} />
      ) : (
        <ProjectViewBoard project={project} />
      )}
    </>
  );
}
