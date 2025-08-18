import { useContext } from "react";

import ProjectContext from "../contexts/projectContext";

export default function useProjectContext() {
  const project = useContext(ProjectContext);
  if (!project) {
    throw new Error(
      "useProjectContext must be used within a ProjectContextProvider",
    );
  }
  return project;
}
