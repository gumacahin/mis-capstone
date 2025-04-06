import dayjs, { Dayjs } from "dayjs";

import { Profile } from "./types/common";

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name[0],
  };
}

export function getUserDisplayName(user: Profile) {
  const userDisplayName = user.name ?? "Todo User";
  return userDisplayName;
}

export function formatDayOfWeek(date: Date | Dayjs) {
  const givenDate = dayjs(date).startOf("day");
  const today = dayjs().startOf("day");
  const tomorrow = dayjs().add(1, "day").startOf("day");
  if (givenDate.isSame(today)) {
    return "Today";
  }
  if (givenDate.isSame(tomorrow)) {
    return "Tomorrow";
  }
  return dayjs(date).format("dddd");
}
