import { useContext } from "react";

import ProfileContext from "../contexts/profileContext";

export default function useProfileContext() {
  const profile = useContext(ProfileContext);
  return profile;
}
