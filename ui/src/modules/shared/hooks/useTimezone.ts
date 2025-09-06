import { useContext } from "react";

import { TimezoneContext } from "../contexts/TimezoneContext";

export function useTimezone() {
  const context = useContext(TimezoneContext);
  if (context === undefined) {
    throw new Error("useTimezone must be used within a TimezoneProvider");
  }
  return context;
}
