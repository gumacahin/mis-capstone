import { IProject } from "../types/common";
import ProjectViewBoard from "./ProjectViewBoard";
import ProjectViewList from "./ProjectViewList";

export default function ProjectView({ project }: { project: IProject }) {
  const isListView = project.view === "list";
  return (
    <div>
      {isListView ? (
        <ProjectViewList project={project} />
      ) : (
        <ProjectViewBoard project={project} />
      )}
    </div>
  );
}
