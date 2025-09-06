import dayjs from "dayjs";
import { createContext } from "react";

export interface TimezoneContextType {
  timezone: string;
  setTimezone: (tz: string) => void;
  getCurrentTime: () => dayjs.Dayjs;
  toUserTimezone: (date: string | Date | dayjs.Dayjs) => dayjs.Dayjs;
}

export const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined,
);
