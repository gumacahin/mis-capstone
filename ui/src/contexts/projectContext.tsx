import { createContext } from "react";

import type { IProject } from "../types/common";

const ProjectContext = createContext<IProject | null>(null);

export default ProjectContext;
