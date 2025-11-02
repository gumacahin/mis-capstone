import { createContext } from "react";

import type { Section } from "../../../api/migration-helpers";

const SectionContext = createContext<Section | null>(null);

export default SectionContext;
