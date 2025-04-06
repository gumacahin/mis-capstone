import { useContext } from "react";

import ProfileContext from "../contexts/profileContext";

export default function useProjectContext() {
  const profile = useContext(ProfileContext);
  if (!profile) {
    throw new Error(
      "useProfileContext must be used within a ProfileContextProvider",
    );
  }
  return profile;
}
