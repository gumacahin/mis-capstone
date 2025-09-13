import { useContext } from "react";

import { DEFAULT_TIMEZONE } from "../constants/ui";
import ProfileContext from "../contexts/profileContext";
import TimezoneContext from "../contexts/timezoneContext";

export function TimezoneContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useContext(ProfileContext);
  const timezone = profile?.timezone ?? DEFAULT_TIMEZONE;
  return (
    <TimezoneContext.Provider value={timezone}>
      {children}
    </TimezoneContext.Provider>
  );
}
