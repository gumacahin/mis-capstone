import { ProjectDetail } from "../types/common";
import ProjectViewBoard from "./ProjectViewBoard";
import ProjectViewList from "./ProjectViewList";

export default function ProjectView({ project }: { project: ProjectDetail }) {
  // const queryClient = useQueryClient();
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
