import { createContext } from "react";

import type { Tag } from "../../../api/migration-helpers";

const LabelContext = createContext<Tag | null>(null);

export default LabelContext;
