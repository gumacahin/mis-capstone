import * as chrono from "chrono-node";
import dayjs, { Dayjs } from "dayjs";

export interface ParsedDate {
  date: Dayjs | null;
  recurrence: string | null;
  anchorMode: "SCHEDULED" | "COMPLETED";
}

/**
 * Parse natural language input into structured date and recurrence data using chrono-node
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

  // Use chrono-node to parse the input
  const results = chrono.parse(normalized);

  if (results.length > 0) {
    const result = results[0];

    // Extract date from chrono result
    if (result.start) {
      const startDate = result.start.date();
      date = dayjs(startDate);

      // If it's a date-only result (no time), set to start of day
      if (!result.start.get("hour") && !result.start.get("minute")) {
        date = date.startOf("day");
      }
    }

    // Extract recurrence pattern if present
    if (result.text.includes("every")) {
      recurrence = extractRecurrencePattern(result.text);
    }
  }

  // Special handling for recurrence patterns that chrono might not catch
  if (!recurrence && normalized.includes("every")) {
    recurrence = extractRecurrencePattern(normalized);
  }

  // If we have a recurrence but no date, try to extract a date from the input
  if (recurrence && !date) {
    // Remove the recurrence part and try to parse the remaining text
    const dateText = normalized.replace(/every\s+\w+/, "").trim();
    if (dateText) {
      const dateResults = chrono.parse(dateText);
      if (dateResults.length > 0 && dateResults[0].start) {
        const startDate = dateResults[0].start.date();
        date = dayjs(startDate);
        if (
          !dateResults[0].start.get("hour") &&
          !dateResults[0].start.get("minute")
        ) {
          date = date.startOf("day");
        }
      }
    }
  }

  return { date, recurrence, anchorMode };
}

/**
 * Extract recurrence patterns from text using chrono-node and custom logic
 */
function extractRecurrencePattern(input: string): string {
  const normalized = input.toLowerCase();

  // Look for recurrence indicators in the text
  if (normalized.includes("every")) {
    // Extract the "every" pattern
    const everyMatch = normalized.match(/every\s+([^,\s]+(?:\s+[^,\s]+)*)/);
    if (everyMatch) {
      return `every ${everyMatch[1].trim()}`;
    }
  }

  // Handle specific recurrence patterns
  if (normalized.includes("daily") || normalized.includes("every day")) {
    return "every day";
  }

  if (normalized.includes("weekly") || normalized.includes("every week")) {
    // Check for specific day of week
    const dayMatch = extractDayOfWeek(normalized);
    if (dayMatch) {
      return `every ${dayMatch}`;
    }
    return "every week";
  }

  if (normalized.includes("monthly") || normalized.includes("every month")) {
    const dayMatch = extractDayOfMonth(normalized);
    if (dayMatch) {
      return `every month on the ${dayMatch}`;
    }
    return "every month";
  }

  if (normalized.includes("yearly") || normalized.includes("every year")) {
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
      const now = dayjs().startOf("day");
      const dateStart = date.startOf("day");
      const diff = dateStart.diff(now, "day");

      if (diff === 0) {
        result = "today";
      } else if (diff === 1) {
        result = "tomorrow";
      } else if (diff === -1) {
        result = "yesterday";
      } else if (diff > 0 && diff <= 7) {
        // Check if it's the next occurrence of a day of week
        // For dates within 7 days, check if it's actually the next occurrence
        const dayOfWeek = date.format("dddd").toLowerCase();

        // Check if this is the next occurrence of this day of the week
        // by looking for the same day of week in the next 7 days
        let isNextOccurrence = false;
        for (let i = 1; i <= 7; i++) {
          const checkDate = now.add(i, "day");
          if (checkDate.format("dddd").toLowerCase() === dayOfWeek) {
            if (checkDate.isSame(date, "day")) {
              isNextOccurrence = true;
            }
            break;
          }
        }

        if (isNextOccurrence) {
          result = `next ${dayOfWeek}`;
        } else {
          // Otherwise, use the specific date format
          result = date.format("MMM D");
        }
      } else {
        // For dates beyond 7 days, use the specific date format
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
