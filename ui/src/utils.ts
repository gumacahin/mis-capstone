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

export function getWeekDatesFromDate(date: Date | Dayjs, weekExtension = 0) {
  const startOfWeek = dayjs(date).startOf("week");
  const today = dayjs();
  const dates = [];
  const daysCount = 7 * (weekExtension + 1);
  for (let i = 0; i < daysCount; i++) {
    const currentDate = startOfWeek.add(i, "day");
    if (currentDate.isAfter(today, "day") || currentDate.isSame(today, "day")) {
      dates.push(currentDate);
    }
  }
  return dates;
}

// https://gist.github.com/codeguy/6684588?permalink_comment_id=4030834#gistcomment-4030834
export function slugify(str: string) {
  return str
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[-\s]+/g, "-");
}
