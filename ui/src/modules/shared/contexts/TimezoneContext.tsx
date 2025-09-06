import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import { TimezoneContext } from "./TimezoneContext";

const DEFAULT_TIMEZONE = "Asia/Manila";

export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [timezone, setTimezone] = useState<string>(DEFAULT_TIMEZONE);

  // Load timezone from user profile or localStorage
  useEffect(() => {
    const savedTimezone = localStorage.getItem("user-timezone");
    if (savedTimezone) {
      setTimezone(savedTimezone);
    }
  }, []);

  // Save timezone to localStorage when changed
  const handleSetTimezone = (tz: string) => {
    setTimezone(tz);
    localStorage.setItem("user-timezone", tz);
  };

  const getCurrentTime = () => dayjs().tz(timezone);
  const toUserTimezone = (date: string | Date | dayjs.Dayjs) =>
    dayjs(date).tz(timezone);

  return (
    <TimezoneContext.Provider
      value={{
        timezone,
        setTimezone: handleSetTimezone,
        getCurrentTime,
        toUserTimezone,
      }}
    >
      {children}
    </TimezoneContext.Provider>
  );
}
