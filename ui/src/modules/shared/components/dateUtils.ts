import dayjs, { Dayjs } from "dayjs";

export interface ParsedDate {
  date: Dayjs | null;
  recurrence: string | null;
  anchorMode: "SCHEDULED" | "COMPLETED";
}

/**
 * Parse natural language input into structured date and recurrence data
 */
export function parseNaturalLanguage(input: string): ParsedDate {
  const normalized = input.toLowerCase().trim();

  if (!normalized) {
    return { date: null, recurrence: null, anchorMode: "SCHEDULED" };
  }

  let date: Dayjs | null = null;
  let recurrence: string | null = null;
  let anchorMode: "SCHEDULED" | "COMPLETED" = "SCHEDULED";

  // Handle anchor mode indicators first
  if (
    normalized.includes("from completion") ||
    normalized.includes("when completed")
  ) {
    anchorMode = "COMPLETED";
  } else if (
    normalized.includes("from schedule") ||
    normalized.includes("when scheduled")
  ) {
    anchorMode = "SCHEDULED";
  }

  // Handle recurrence patterns
  if (normalized.includes("every")) {
    recurrence = parseRecurrencePattern(normalized);

    // Extract date/time from recurrence if present
    const dateTimeMatch = extractDateTimeFromRecurrence(normalized);
    if (dateTimeMatch) {
      date = dateTimeMatch;
    }
  } else {
    // Parse standalone date/time
    date = parseDatePattern(normalized);
  }

  // Special case: if we have a date pattern but no recurrence, check if there's a recurrence pattern
  if (!date && !recurrence) {
    // Try to extract date from patterns like "sept 1 every week"
    const dateMatch = extractMonthDay(normalized);
    if (dateMatch) {
      date = parseMonthDay(dateMatch);
    }

    // Check for recurrence patterns
    if (normalized.includes("every")) {
      recurrence = parseRecurrencePattern(normalized);
    }
  }

  // Special case: if we have recurrence but no date, and the input contains date patterns
  if (recurrence && !date) {
    // Look for date patterns in the input
    const dateMatch = extractMonthDay(normalized);
    if (dateMatch) {
      date = parseMonthDay(dateMatch);
    }
  }

  return { date, recurrence, anchorMode };
}

/**
 * Parse recurrence patterns like "every monday", "every 2 weeks", etc.
 */
function parseRecurrencePattern(input: string): string {
  const normalized = input.toLowerCase();

  // Extract just the recurrence part (before any time/date modifiers)
  const recurrenceMatch = normalized.match(
    /^(every (?:day|week|month|year|weekday|weekend|\d+ (?:day|week|month|year)s?|[a-z]+))/,
  );
  if (recurrenceMatch) {
    return recurrenceMatch[1].trim();
  }

  // Daily patterns
  if (normalized.includes("every day") || normalized.includes("daily")) {
    return "every day";
  }

  if (normalized.includes("every weekday") || normalized.includes("weekdays")) {
    return "every weekday";
  }

  if (normalized.includes("every weekend") || normalized.includes("weekends")) {
    return "every weekend";
  }

  // Weekly patterns
  if (normalized.includes("every week")) {
    const dayMatch = extractDayOfWeek(normalized);
    if (dayMatch) {
      return `every ${dayMatch}`;
    }
    return "every week";
  }

  // Monthly patterns
  if (normalized.includes("every month")) {
    const dayMatch = extractDayOfMonth(normalized);
    if (dayMatch) {
      return `every month on the ${dayMatch}`;
    }
    return "every month";
  }

  // Yearly patterns
  if (normalized.includes("every year") || normalized.includes("yearly")) {
    const monthDayMatch = extractMonthDay(normalized);
    if (monthDayMatch) {
      return `every year on ${monthDayMatch}`;
    }
    return "every year";
  }

  // Custom intervals
  const intervalMatch = input.match(/every (\d+) (day|week|month|year)s?/i);
  if (intervalMatch) {
    const [, interval, unit] = intervalMatch;
    return `every ${interval} ${unit}${parseInt(interval) > 1 ? "s" : ""}`;
  }

  // Fallback: return the original input
  return input;
}

/**
 * Parse date patterns like "tomorrow", "sept 1", "next friday", "at 9am", "the 25th"
 */
function parseDatePattern(input: string): Dayjs | null {
  const normalized = input.toLowerCase();
  const now = dayjs();

  // Standalone time patterns
  const timeMatch = normalized.match(/^at (\d{1,2}):?(\d{2})?\s*(am|pm)?$/i);
  if (timeMatch) {
    const [, hour, minute = "00", period] = timeMatch;
    let hourNum = parseInt(hour);

    if (period === "pm" && hourNum < 12) {
      hourNum += 12;
    } else if (period === "am" && hourNum === 12) {
      hourNum = 0;
    }

    return now.hour(hourNum).minute(parseInt(minute)).second(0).millisecond(0);
  }

  // Relative dates
  if (normalized === "today") {
    return now.startOf("day");
  }

  if (normalized === "tomorrow") {
    return now.add(1, "day").startOf("day");
  }

  if (normalized === "yesterday") {
    return now.subtract(1, "day").startOf("day");
  }

  if (normalized.includes("next week")) {
    return now.add(1, "week").startOf("week");
  }

  if (normalized.includes("last week")) {
    return now.subtract(1, "week").startOf("week");
  }

  // Day of week
  const dayMatch = extractDayOfWeek(normalized);
  if (dayMatch) {
    if (normalized.includes("next")) {
      return getNextDayOfWeek(dayMatch);
    } else if (normalized.includes("last") || normalized.includes("previous")) {
      return getPreviousDayOfWeek(dayMatch);
    } else {
      return getNextDayOfWeek(dayMatch);
    }
  }

  // Month and day
  const monthDayMatch = extractMonthDay(normalized);
  if (monthDayMatch) {
    return parseMonthDay(monthDayMatch);
  }

  // Standalone ordinal day (e.g., "the 25th")
  const ordinalMatch = normalized.match(/^the (\d{1,2})(st|nd|rd|th)$/i);
  if (ordinalMatch) {
    const dayNum = parseInt(ordinalMatch[1]);
    const currentMonth = now.month();
    const currentYear = now.year();

    // Try current month first
    let targetDate = dayjs().year(currentYear).month(currentMonth).date(dayNum);

    // If the date has passed this month, try next month
    if (targetDate.isBefore(now, "day")) {
      targetDate = dayjs()
        .year(currentYear)
        .month(currentMonth + 1)
        .date(dayNum);

      // If we went past December, go to next year
      if (targetDate.month() === 0) {
        targetDate = dayjs()
          .year(currentYear + 1)
          .month(0)
          .date(dayNum);
      }
    }

    return targetDate.startOf("day");
  }

  // ISO date format
  if (/^\d{4}-\d{2}-\d{2}/.test(normalized)) {
    return dayjs(normalized);
  }

  // Relative time
  const relativeMatch = input.match(/in (\d+) (day|week|month|year)s?/i);
  if (relativeMatch) {
    const [, amount, unit] = relativeMatch;
    return now.add(parseInt(amount), unit as "day" | "week" | "month" | "year");
  }

  return null;
}

/**
 * Extract time from input and apply to date
 */
function extractDateTimeFromRecurrence(input: string): Dayjs | null {
  const timeMatch = input.match(/at (\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (timeMatch) {
    const [, hour, minute = "00", period] = timeMatch;
    let hourNum = parseInt(hour);

    if (period === "pm" && hourNum < 12) {
      hourNum += 12;
    } else if (period === "am" && hourNum === 12) {
      hourNum = 0;
    }

    const now = dayjs();
    return now.hour(hourNum).minute(parseInt(minute)).second(0).millisecond(0);
  }

  return null;
}

/**
 * Extract day of week from input
 */
function extractDayOfWeek(input: string): string | null {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const shortDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  for (let i = 0; i < days.length; i++) {
    if (input.includes(days[i]) || input.includes(shortDays[i])) {
      return days[i];
    }
  }

  return null;
}

/**
 * Extract day of month from input
 */
function extractDayOfMonth(input: string): string | null {
  const match = input.match(/(\d{1,2})(st|nd|rd|th)/i);
  if (match) {
    return match[1];
  }

  const ordinalMatch = input.match(/the (\d{1,2})(st|nd|rd|th)/i);
  if (ordinalMatch) {
    return ordinalMatch[1];
  }

  return null;
}

/**
 * Extract month and day from input
 */
function extractMonthDay(input: string): string | null {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const shortMonths = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  for (let i = 0; i < months.length; i++) {
    const month = months[i];
    const shortMonth = shortMonths[i];

    if (input.includes(month) || input.includes(shortMonth)) {
      const dayMatch = input.match(/(\d{1,2})(st|nd|rd|th)?/);
      if (dayMatch) {
        return `${month} ${dayMatch[1]}`;
      }
    }
  }

  return null;
}

/**
 * Get next occurrence of a specific day of week
 */
function getNextDayOfWeek(dayName: string): Dayjs {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const targetDay = days.indexOf(dayName);
  const now = dayjs();
  const currentDay = now.day();

  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  return now.add(daysToAdd, "day").startOf("day");
}

/**
 * Get previous occurrence of a specific day of week
 */
function getPreviousDayOfWeek(dayName: string): Dayjs {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const targetDay = days.indexOf(dayName);
  const now = dayjs();
  const currentDay = now.day();

  let daysToSubtract = currentDay - targetDay;
  if (daysToSubtract <= 0) {
    daysToSubtract += 7;
  }

  return now.subtract(daysToSubtract, "day").startOf("day");
}

/**
 * Parse month and day string into Dayjs object
 */
function parseMonthDay(monthDay: string): Dayjs {
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  const [month, day] = monthDay.split(" ");
  const monthIndex = months.indexOf(month.toLowerCase());
  const dayNum = parseInt(day);

  const now = dayjs();
  let year = now.year();

  // If the date has passed this year, use next year
  const targetDate = dayjs().month(monthIndex).date(dayNum);
  if (targetDate.isBefore(now, "day")) {
    year++;
  }

  return dayjs().year(year).month(monthIndex).date(dayNum).startOf("day");
}

/**
 * Format date and recurrence for display
 */
export function formatForDisplay(
  date: Dayjs | null,
  recurrence: string | null,
): string {
  if (!date && !recurrence) {
    return "No due date set";
  }

  let result = "";

  if (date) {
    if (date.hour() === 0 && date.minute() === 0) {
      // Date only
      result = date.format("MMMM D, YYYY");
    } else {
      // Date and time
      result = date.format("MMMM D, YYYY h:mm A");
    }
  }

  if (recurrence) {
    if (result) {
      result += ` (${recurrence})`;
    } else {
      result = recurrence;
    }
  }

  return result;
}

/**
 * Format date and recurrence for editing input
 */
export function formatForEditing(
  date: Dayjs | null,
  recurrence: string | null,
): string {
  if (!date && !recurrence) {
    return "";
  }

  let result = "";

  if (recurrence) {
    result = recurrence;

    if (date) {
      const time =
        date.hour() === 0 && date.minute() === 0
          ? ""
          : ` at ${date.format("h:mm A")}`;
      result += time;
    }
  } else if (date) {
    if (date.hour() === 0 && date.minute() === 0) {
      // Date only - try to format naturally
      const now = dayjs();
      const diff = date.diff(now, "day");

      if (diff === 0) {
        result = "today";
      } else if (diff === 1) {
        result = "tomorrow";
      } else if (diff === -1) {
        result = "yesterday";
      } else if (diff > 0 && diff <= 7) {
        result = `next ${date.format("dddd")}`;
      } else {
        result = date.format("MMM D");
      }
    } else {
      // Date and time
      const time = date.format("h:mm A");
      const now = dayjs();
      if (date.isSame(now, "day")) {
        result = `today at ${time}`;
      } else if (date.isSame(now.add(1, "day"), "day")) {
        result = `tomorrow at ${time}`;
      } else {
        result = `${date.format("MMM D")} at ${time}`;
      }
    }
  }

  return result;
}
