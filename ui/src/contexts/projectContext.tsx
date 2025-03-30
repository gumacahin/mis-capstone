import { createContext } from "react";

import type { ProjectDetail } from "../types/common";

const ProjectContext = createContext<ProjectDetail | null>(null);

export default ProjectContext;
