import * as chrono from "chrono-node";
import dayjs, { Dayjs } from "dayjs";
import timezonePlugin from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { RRule } from "rrule";

import { Profile, RepeatOption } from "./types/common";

dayjs.extend(utc);
dayjs.extend(timezonePlugin);

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

export function formatDayOfWeek(
  date: Date | Dayjs,
  defaultFormat = "MMM D YYYY",
) {
  const givenDate = dayjs(date).startOf("day");
  const yesterday = dayjs().subtract(1, "day").startOf("day");
  const today = dayjs().startOf("day");
  const tomorrow = dayjs().add(1, "day").startOf("day");
  if (givenDate.isSame(yesterday)) {
    return "Yesterday";
  }
  if (givenDate.isSame(today)) {
    return "Today";
  }
  if (givenDate.isSame(tomorrow)) {
    return "Tomorrow";
  }
  return dayjs(date).format(defaultFormat);
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

export function generateTaskLink(taskId: number): string {
  return `/task/${taskId}`;
}

export function rruleToDayjsDay(rruleWeekday: number): number {
  // RRule: 0=Monday, 1=Tuesday, ..., 6=Sunday
  // dayjs: 0=Sunday, 1=Monday, ..., 6=Saturday
  return (rruleWeekday + 1) % 7;
}

export function dayjsToRRuleDay(dayjsDay: Dayjs): number {
  // dayjs: 0=Sunday, 1=Monday, ..., 6=Saturday
  // RRule: 0=Monday, 1=Tuesday, ..., 6=Sunday
  return (dayjsDay.day() + 6) % 7;
}

export function generateRrule(option: RepeatOption, date: Dayjs): string {
  // Interpret the effective date (keeps full wall-clock datetime)
  const local = dayjs(date);

  // Extract date + time separately
  const weekdayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const weekday = weekdayNames[local.day()]; // 0=Sun..6=Sat
  const monthday = local.date(); // 1..31
  const month = local.month() + 1; // 1..12

  switch (option) {
    case "daily":
      return "FREQ=DAILY";
    case "weekly":
      return `FREQ=WEEKLY;BYDAY=${weekday}`;
    case "weekdays":
      return "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
    case "monthly":
      return `FREQ=MONTHLY;BYMONTHDAY=${monthday}`;
    case "yearly":
      return `FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${monthday}`;
  }
}

export type NLParserResult = {
  rrule: string | null;
  date: Dayjs;
} | null;

export function parseNaturalLanguage(
  input: string,
  timezone: string,
): NLParserResult {
  const [dateOrRepeatText, untilText] = input.split(/\buntil\b/i);

  try {
    const base = RRule.fromText(dateOrRepeatText);
    if (!base.toString() && !untilText) {
      const parsedDate = parseDate(dateOrRepeatText, timezone);
      if (parsedDate) {
        return { rrule: null, date: dayjs.tz(parsedDate, timezone) };
      }
      return null;
    }

    // If the base rrule failed to parse and there is until text, the string
    // is malformed and we return null.
    if (!base.toString() && untilText) {
      return null;
    }

    const nextOccurrence = getNextOccurrence(base, dateOrRepeatText, timezone);

    if (base.toString() && !untilText) {
      return {
        rrule: getRepeatOnly(base),
        date: nextOccurrence,
      };
    }

    const parsed = parseDate(untilText, timezone);
    // If the until text failed to parse the text is malformed so we return null.
    if (!parsed) {
      return null;
    }
    const baseStr = getRepeatOnly(base);
    const untilStr = dayjs(parsed)
      .tz(timezone)
      .endOf("day")
      .utc()
      .format("YYYYMMDDTHHmmss[Z]");

    return {
      rrule: baseStr + ";UNTIL=" + untilStr,
      date: nextOccurrence,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function parseDate(text: string, timezone: string): Date | null {
  const refDate = dayjs.tz(dayjs(), timezone).utc().toDate();
  const results = chrono.parse(text, refDate, { forwardDate: true });
  if (results.length === 0) return null;

  const result = results[0];
  const date = result.start.date();

  // If the hour wasn't explicitly specified by the user, force midnight.
  // (Chrono "implies" a time when absent; we override that implication.)
  if (!result.start.isCertain("hour")) {
    date.setHours(0, 0, 0, 0);
  }

  return date;
}

function getRepeatOnly(fullRRule: RRule): string {
  // Split into lines, drop DTSTART, then clean the RRULE
  const repeatOnly = fullRRule
    .toString()
    .split("\n")
    .filter((line) => !line.startsWith("DTSTART")) // remove DTSTART
    .map((line) => {
      if (line.startsWith("RRULE:")) {
        // remove any BYHOUR, BYMINUTE, BYSECOND parts
        const parts = line
          .slice("RRULE:".length)
          .split(";")
          .filter(
            (p) =>
              !p.startsWith("BYHOUR") &&
              !p.startsWith("BYMINUTE") &&
              !p.startsWith("BYSECOND"),
          );
        return "RRULE:" + parts.join(";");
      }
      return line;
    })
    .join("\n");

  return repeatOnly;
}

export function getNextOccurrence(
  base: RRule,
  dateOrRepeatText: string,
  timezone: string,
) {
  const nowLocal = dayjs().tz(timezone);

  let hasTime = false;
  let hour = 0;
  let minute = 0;
  const parsed = chrono.parse(dateOrRepeatText);
  if (parsed.length && parsed[0].start.isCertain("hour")) {
    hasTime = true;
    hour = parsed[0].start.get("hour") ?? 0;
    minute = parsed[0].start.get("minute") ?? 0;
  }

  // Anchor DTSTART at *local noon* so UTC conversion preserves the local weekday
  const localNoon = nowLocal.hour(12).minute(0).second(0).millisecond(0);

  // Strip any time constraints; we’ll stamp the wall time ourselves
  const baseNoTime = new RRule({
    ...base.options,
    byhour: undefined,
    byminute: undefined,
    bysecond: undefined,
    dtstart: localNoon.utc().toDate(),
  });

  // Ask for the next matching rule day relative to the same noon-based reference (UTC)
  let nextUtc = baseNoTime.after(localNoon.utc().toDate(), true);
  if (!nextUtc) return dayjs(NaN);

  let nextLocalDay = dayjs.tz(nextUtc, timezone).startOf("day");
  let candidateLocal = nextLocalDay
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0);

  // If user specified a time and "today @ time" would be in the past, push to the following rule day
  if (hasTime && !candidateLocal.isAfter(nowLocal)) {
    const followingNoon = localNoon.add(1, "day");
    nextUtc = baseNoTime.after(followingNoon.utc().toDate(), true);
    if (!nextUtc) return dayjs(NaN);
    nextLocalDay = dayjs.tz(nextUtc, timezone).startOf("day");
    candidateLocal = nextLocalDay
      .hour(hour)
      .minute(minute)
      .second(0)
      .millisecond(0);
  }

  return candidateLocal.utc();
}

export function getPostponeDate(
  base: RRule,
  datetime: Dayjs | null,
  timezone: string,
): Dayjs {
  if (!base || !datetime) return dayjs(NaN);

  // Use current selection as the local reference
  const localRef = dayjs(datetime).tz(timezone);

  // Anchor rule to *local* midnight to avoid UTC day drift
  const localStartTodayUtc = localRef.endOf("day").utc().toDate();

  // Remove time constraints; let the rule choose only the *date*
  const baseNoTime = new RRule({
    ...base.options,
    byhour: undefined,
    byminute: undefined,
    bysecond: undefined,
    dtstart: localStartTodayUtc,
  });

  // Next rule hit (date-wise), evaluated relative to the same instant
  const nextDateUtc = baseNoTime.after(localRef.toDate(), true);
  if (!nextDateUtc) return dayjs(NaN);

  // Get the *local wall time* from the selection (NOT from UTC)
  const wall = dayjs(datetime).tz(timezone);
  const wallHour = wall.hour();
  const wallMinute = wall.minute();

  // Stamp that wall time on the next local rule day
  const nextLocalDay = dayjs.tz(nextDateUtc, timezone).startOf("day");
  let candidateLocal = nextLocalDay
    .hour(wallHour)
    .minute(wallMinute)
    .second(0)
    .millisecond(0);

  // If that timestamp isn't strictly in the future vs the reference,
  // jump to the following rule day and stamp the same wall time.
  if (!candidateLocal.isAfter(localRef)) {
    const followingDateUtc = baseNoTime.after(
      nextLocalDay.endOf("day").utc().toDate(),
      false,
    );
    if (!followingDateUtc) return dayjs(NaN);

    const followingLocalDay = dayjs
      .tz(followingDateUtc, timezone)
      .startOf("day");
    candidateLocal = followingLocalDay
      .hour(wallHour)
      .minute(wallMinute)
      .second(0)
      .millisecond(0);
  }

  return candidateLocal.utc();
}

export function getRepeatDates(
  rrule: RRule,
  start: Dayjs,
  end: Dayjs,
  timezone: string,
): Dayjs[] {
  const dates = rrule.between(start.toDate(), end.toDate(), true);
  return dates.map((date) => dayjs.tz(date, timezone));
}

export function findNextValidOccurrence(
  rrule: RRule,
  referenceDate: Dayjs,
  timezone: string,
): Dayjs {
  if (!rrule || !referenceDate) return referenceDate;

  // Use current selection as the local reference
  const localRef = dayjs(referenceDate).tz(timezone);

  // Anchor rule to *local* midnight to avoid UTC day drift
  const localStartTodayUtc = localRef.endOf("day").utc().toDate();

  // Remove time constraints; let the rule choose only the *date*
  const baseNoTime = new RRule({
    ...rrule.options,
    byhour: undefined,
    byminute: undefined,
    bysecond: undefined,
    dtstart: localStartTodayUtc,
  });

  // Next rule hit (date-wise), evaluated relative to the same instant
  const nextDateUtc = baseNoTime.after(localRef.toDate(), true);
  if (!nextDateUtc) return referenceDate;

  // Get the *local wall time* from the selection (NOT from UTC)
  const wall = dayjs(referenceDate).tz(timezone);
  const wallHour = wall.hour();
  const wallMinute = wall.minute();

  // Stamp that wall time on the next local rule day
  const nextLocalDay = dayjs.tz(nextDateUtc, timezone).startOf("day");
  const candidateLocal = nextLocalDay
    .hour(wallHour)
    .minute(wallMinute)
    .second(0)
    .millisecond(0);

  return candidateLocal.utc();
}
