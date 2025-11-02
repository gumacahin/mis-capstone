import { createContext } from "react";

import type { ProjectDetail } from "../../../api/migration-helpers";

const ProjectContext = createContext<ProjectDetail | null>(null);

export default ProjectContext;
