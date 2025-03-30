import { createContext } from "react";

import type { Profile } from "../types/common";

const ProfileContext = createContext<Profile | null>(null);

export default ProfileContext;
