import { createContext } from "react";

import { DEFAULT_TIMEZONE } from "../constants/ui";

type TimezoneContextType = string;

const TimezoneContext = createContext<TimezoneContextType>(DEFAULT_TIMEZONE);

export default TimezoneContext;
