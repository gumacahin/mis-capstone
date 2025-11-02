import { createContext } from "react";

import type { Profile } from "../../../api/migration-helpers";

const ProfileContext = createContext<Profile | null>(null);

export default ProfileContext;
