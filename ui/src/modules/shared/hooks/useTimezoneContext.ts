import { useContext } from "react";

import TimezoneContext from "../contexts/timezoneContext";

export default function useTimezoneContext() {
  const timezone = useContext(TimezoneContext);
  return timezone;
}
