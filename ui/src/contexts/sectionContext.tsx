import { createContext } from "react";

import type { ISection } from "../types/common";

const SectionContext = createContext<ISection | null>(null);

export default SectionContext;
