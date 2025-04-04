import { createContext } from "react";

import type { Profile } from "../types/common";

const ProfileContext = createContext<Profile | undefined>(undefined);

export default ProfileContext;
