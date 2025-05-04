import { createContext } from "react";

import type { Tag } from "../types/common";

const LabelContext = createContext<Tag | null>(null);

export default LabelContext;
