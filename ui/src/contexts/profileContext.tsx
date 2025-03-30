import { createContext } from "react";

import type { IProfile } from "../types/common";

const ProfileContext = createContext<IProfile | null>(null);

export default ProfileContext;
