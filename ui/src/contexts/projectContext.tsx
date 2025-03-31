import { createContext } from "react";

import type { IProjectDetail } from "../types/common";

const ProjectContext = createContext<IProjectDetail | null>(null);

export default ProjectContext;
