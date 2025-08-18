import { createContext } from "react";

import type { Section } from "../types/common";

const SectionContext = createContext<Section | null>(null);

export default SectionContext;
