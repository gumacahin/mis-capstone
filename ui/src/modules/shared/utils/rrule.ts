import * as chrono from "chrono-node";
import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { RRule } from "rrule";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = "Asia/Manila";

/**
 * Generate a single occurrence RRULE string for a given date in user's timezone
 * Format: DTSTART:20240101T090000Z;RRULE:FREQ=DAILY;COUNT=1
 */
export function generateSingleOccurrenceRRule(
  dueDate: Dayjs,
  userTimezone: string = DEFAULT_TIMEZONE,
): string {
  // Ensure the due date is in the user's timezone and preserve the local date
  // We need to use the local date components to avoid timezone conversion issues
  const localDate = dueDate.tz(userTimezone);

  // Use the local date components directly to avoid timezone conversion issues
  // This preserves the original date regardless of timezone
  const year = localDate.year();
  const month = localDate.month() + 1; // dayjs months are 0-based
  const day = localDate.date();
  const dtstart = `${year.toString().padStart(4, "0")}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}T000000Z`;

  return `DTSTART:${dtstart}\nRRULE:FREQ=DAILY;COUNT=1`;
}

/**
 * Convert a recurring RRULE to a single occurrence while preserving the time
 * @param rrule - Existing RRULE string
 * @returns Single occurrence RRULE with preserved time
 */
export function convertToSingleOccurrence(rrule: string): string {
  if (!rrule) return "";

  try {
    // Extract DTSTART from existing RRULE
    const dtstartMatch = rrule.match(/DTSTART:([^;\n]+)/);

    // If no DTSTART, handle RRULEs with only BYHOUR/BYMINUTE by removing frequency
    if (!dtstartMatch) {
      // Remove FREQ and other recurrence fields, keep only BYHOUR/BYMINUTE if present
      const cleanedRRule = rrule
        .replace(/FREQ=[^;]+;?/g, "")
        .replace(/INTERVAL=[^;]+;?/g, "")
        .replace(/COUNT=[^;]+;?/g, "")
        .replace(/UNTIL=[^;]+;?/g, "")
        .replace(/BYDAY=[^;]+;?/g, "")
        .replace(/BYMONTHDAY=[^;]+;?/g, "")
        .replace(/BYMONTH=[^;]+;?/g, "")
        .replace(/^RRULE:;?/, "RRULE:")
        .replace(/;$/, "");

      // If only RRULE: is left (no valid fields), return empty string to indicate no RRULE
      if (cleanedRRule === "RRULE:") {
        return "";
      }

      return cleanedRRule;
    }

    const dtstart = dtstartMatch[1];

    // Parse the existing DTSTART to preserve the time
    const year = parseInt(dtstart.substring(0, 4));
    const month = parseInt(dtstart.substring(4, 6)) - 1; // 0-indexed
    const day = parseInt(dtstart.substring(6, 8));
    const hour = parseInt(dtstart.substring(9, 11));
    const minute = parseInt(dtstart.substring(11, 13));
    const second = parseInt(dtstart.substring(13, 15));

    // Create new DTSTART with the same time but as single occurrence
    const newDtstart = `${year.toString().padStart(4, "0")}${(month + 1).toString().padStart(2, "0")}${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}${minute.toString().padStart(2, "0")}${second.toString().padStart(2, "0")}Z`;

    return `DTSTART:${newDtstart}\nRRULE:FREQ=DAILY;COUNT=1`;
  } catch (error) {
    console.warn("Failed to convert RRULE to single occurrence:", error);
    return rrule;
  }
}

/**
 * Generate a repeat RRULE while preserving the time from an existing RRULE
 * @param existingRRule - Existing RRULE string to preserve time from
 * @param frequency - Repeat frequency
 * @param selectedDate - Selected date for the repeat
 * @param userTimezone - User's timezone
 * @param basedOn - Whether based on scheduled or completed date
 * @returns New RRULE with preserved time and specified frequency
 */
export function generateRepeatRRuleWithTime(
  existingRRule: string | null,
  frequency: "daily" | "weekly" | "weekdays" | "monthly" | "yearly",
  selectedDate: Dayjs | null,
  userTimezone: string = DEFAULT_TIMEZONE,
  basedOn: "SCHEDULED" | "COMPLETED" = "SCHEDULED",
): string | null {
  if (!selectedDate) return null;

  // For "COMPLETED" based on, use current date as fallback if no completion date exists
  const anchorDate =
    basedOn === "COMPLETED" ? dayjs().tz(userTimezone) : selectedDate;

  // Ensure the anchor date is in the user's timezone and preserve the local date
  const localDate = anchorDate.tz(userTimezone);

  // Use the local date components directly to avoid timezone conversion issues
  const year = localDate.year();
  const month = localDate.month() + 1; // dayjs months are 0-based
  const day = localDate.date();

  // Extract time from existing RRULE if available
  let hour = 0;
  let minute = 0;
  let second = 0;

  if (existingRRule) {
    try {
      // First try to extract time from DTSTART
      const dtstartMatch = existingRRule.match(/DTSTART:([^;\n]+)/);
      if (dtstartMatch) {
        const dtstart = dtstartMatch[1];
        hour = parseInt(dtstart.substring(9, 11));
        minute = parseInt(dtstart.substring(11, 13));
        second = parseInt(dtstart.substring(13, 15));
      } else {
        // If no DTSTART, try to extract time from BYHOUR and BYMINUTE
        const byHourMatch = existingRRule.match(/BYHOUR=(\d+)/);
        const byMinuteMatch = existingRRule.match(/BYMINUTE=(\d+)/);

        if (byHourMatch) {
          hour = parseInt(byHourMatch[1]);
          minute = byMinuteMatch ? parseInt(byMinuteMatch[1]) : 0;
        }
      }
    } catch (error) {
      console.warn("Failed to parse time from existing RRULE:", error);
    }
  }

  // Create DTSTART with preserved time in user's timezone
  // The time extracted from BYHOUR/BYMINUTE was in user's local time, so preserve it as such
  // Create DTSTART in local time (no timezone conversion)
  const dtstart = `${year.toString().padStart(4, "0")}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}${minute.toString().padStart(2, "0")}${second.toString().padStart(2, "0")}`;

  // Generate the appropriate RRULE based on frequency
  let rrule = "";
  switch (frequency) {
    case "daily":
      rrule = "RRULE:FREQ=DAILY";
      break;
    case "weekly": {
      const dayOfWeek = localDate.day(); // 0 = Sunday, 1 = Monday, etc.
      const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      rrule = `RRULE:FREQ=WEEKLY;BYDAY=${dayNames[dayOfWeek]}`;
      break;
    }
    case "weekdays":
      rrule = "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
      break;
    case "monthly":
      rrule = `RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}`;
      break;
    case "yearly":
      rrule = `RRULE:FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${day}`;
      break;
    default:
      return null;
  }

  return `DTSTART:${dtstart}\n${rrule}`;
}

/**
 * Update RRULE with new date while preserving time and intelligently updating repeat
 * @param existingRRule - Existing RRULE string to preserve time from
 * @param newDate - New date to set
 * @param userTimezone - User's timezone
 * @returns Updated RRULE with new date, preserved time, and updated repeat pattern
 */
export function updateRRuleWithDate(
  existingRRule: string | null,
  newDate: Dayjs,
  userTimezone: string = DEFAULT_TIMEZONE,
): string {
  if (!existingRRule) {
    // If no existing RRULE, create a new single occurrence RRULE
    return generateSingleOccurrenceRRule(newDate, userTimezone);
  }

  try {
    // If the existing RRULE is a single occurrence, preserve that pattern AND the time
    if (isSingleOccurrence(existingRRule)) {
      // Extract time from existing RRULE to preserve it
      const existingTime = parseTimeFromRRule(existingRRule, userTimezone);

      if (existingTime) {
        // Create new RRULE with new date but preserved time
        const localDate = newDate.tz(userTimezone);
        const year = localDate.year();
        const month = localDate.month() + 1; // dayjs months are 0-based
        const day = localDate.date();

        // Use the existing time but with the new date
        const utcTime = existingTime.utc();
        const dtstart = `${year.toString().padStart(4, "0")}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}T${utcTime.format("HHmmss")}Z`;

        return `DTSTART:${dtstart}\nRRULE:FREQ=DAILY;COUNT=1`;
      } else {
        // Fallback to generating a new single occurrence RRULE with midnight
        return generateSingleOccurrenceRRule(newDate, userTimezone);
      }
    }

    // Extract time from existing RRULE (not used in this function but kept for future use)
    // const existingTime = parseTimeFromRRule(existingRRule, userTimezone);

    // Extract repeat pattern from existing RRULE
    const rruleMatch = existingRRule.match(/RRULE:([^\n\r]+)/);
    const existingRRulePart = rruleMatch ? rruleMatch[1] : "";

    // Determine the repeat frequency from existing RRULE
    let frequency: "daily" | "weekly" | "weekdays" | "monthly" | "yearly" =
      "daily";
    if (existingRRulePart.includes("FREQ=WEEKLY")) {
      if (existingRRulePart.includes("BYDAY=MO,TU,WE,TH,FR")) {
        frequency = "weekdays";
      } else {
        frequency = "weekly";
      }
    } else if (existingRRulePart.includes("FREQ=MONTHLY")) {
      frequency = "monthly";
    } else if (existingRRulePart.includes("FREQ=YEARLY")) {
      frequency = "yearly";
    } else if (existingRRulePart.includes("FREQ=DAILY")) {
      frequency = "daily";
    }

    // Generate new RRULE with the new date and preserved time
    const newRRule = generateRepeatRRuleWithTime(
      existingRRule,
      frequency,
      newDate,
      userTimezone,
      "SCHEDULED",
    );

    return newRRule || generateSingleOccurrenceRRule(newDate, userTimezone);
  } catch (error) {
    console.warn("Failed to update RRULE with date:", error);
    // Fallback to generating a new single occurrence RRULE
    return generateSingleOccurrenceRRule(newDate, userTimezone);
  }
}

/**
 * Get ordinal suffix for day numbers (1st, 2nd, 3rd, 4th, etc.)
 */
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

/**
 * Get month name from month number (1-12)
 */
function getMonthName(month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1] || "Unknown";
}

/**
 * Parse RRULE string to get the end date in user's timezone
 * Returns null for COUNT-based RRULEs (indicating "forever")
 */
export function parseRRuleEndDate(
  rruleString: string | null | undefined,
  timezone: string = DEFAULT_TIMEZONE,
): Dayjs | null {
  if (!rruleString || typeof rruleString !== "string") {
    return null;
  }

  try {
    const rule = RRule.fromString(rruleString);
    if (!rule) {
      return null;
    }

    // Check if there's an UNTIL date
    if (rule.options.until) {
      const untilDate = new Date(rule.options.until);
      return dayjs(untilDate).tz(timezone);
    }

    // For COUNT-based RRULEs, we don't support showing end dates
    // Return null to indicate "forever"
    if (rule.options.count) {
      return null;
    }

    // No end date specified
    return null;
  } catch (error) {
    console.debug("Failed to parse RRULE for end date:", error);
    return null;
  }
}

/**
 * Parse RRULE string to get the first occurrence date in user's timezone
 * Used for display purposes
 */
export function parseRRuleToDate(
  rruleString: string,
  userTimezone: string = DEFAULT_TIMEZONE,
): Dayjs | null {
  try {
    const rule = RRule.fromString(rruleString);

    // Check if the RRULE has time components (BYHOUR, BYMINUTE, BYSECOND)
    const hasTimeComponents =
      rruleString.includes("BYHOUR") ||
      rruleString.includes("BYMINUTE") ||
      rruleString.includes("BYSECOND");
    const hasHourOnly =
      rruleString.includes("BYHOUR") &&
      !rruleString.includes("BYMINUTE") &&
      !rruleString.includes("BYSECOND");

    // For single occurrence (COUNT=1), get the first occurrence
    if (isSingleOccurrence(rruleString)) {
      const occurrences = rule.all();
      if (occurrences.length === 0) return null;
      return dayjs(occurrences[0]).tz(userTimezone);
    }

    // For recurring rules, get the first occurrence that matches the pattern
    // Start from DTSTART date to ensure we get the correct first occurrence
    const dtstartMatch = rruleString.match(/DTSTART:(\d{8}T\d{6}Z)/);
    let startDate: Date;

    if (dtstartMatch) {
      // Use DTSTART as the start date
      const dtstartStr = dtstartMatch[1];
      const year = parseInt(dtstartStr.substring(0, 4));
      const month = parseInt(dtstartStr.substring(4, 6)) - 1; // Month is 0-indexed
      const day = parseInt(dtstartStr.substring(6, 8));
      const hour = parseInt(dtstartStr.substring(9, 11));
      const minute = parseInt(dtstartStr.substring(11, 13));
      const second = parseInt(dtstartStr.substring(13, 15));
      startDate = new Date(Date.UTC(year, month, day, hour, minute, second));
    } else {
      // Fallback to current date
      const now = new Date();
      if (hasTimeComponents) {
        // If RRULE has time components, use current time
        startDate = now;
      } else {
        // If RRULE has no time components, use midnight (00:00:00)
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
        );
      }
    }

    const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from start
    const occurrences = rule.between(
      startDate,
      endDate,
      true,
      (_date, i) => i < 1,
    );

    if (occurrences.length === 0) return null;

    // For display purposes, we want to show the date in the user's timezone
    // but we need to be careful about timezone conversion affecting the day
    const utcOccurrence = occurrences[0];

    // Extract the UTC date and time components to avoid timezone conversion issues
    const utcYear = utcOccurrence.getUTCFullYear();
    const utcMonth = utcOccurrence.getUTCMonth() + 1; // Convert from 0-indexed to 1-indexed
    const utcDay = utcOccurrence.getUTCDate();
    const utcHour = utcOccurrence.getUTCHours();
    const utcMinute = utcOccurrence.getUTCMinutes();
    const utcSecond = utcOccurrence.getUTCSeconds();

    // Create a dayjs object in the user's timezone
    let result: Dayjs;
    if (hasTimeComponents) {
      if (hasHourOnly) {
        // If RRULE has only hour (no minutes or seconds), force minutes and seconds to 0
        result = dayjs.tz(
          `${utcYear}-${utcMonth.toString().padStart(2, "0")}-${utcDay.toString().padStart(2, "0")} ${utcHour.toString().padStart(2, "0")}:00:00`,
          userTimezone,
        );
      } else {
        // If RRULE has time components, preserve the time
        result = dayjs.tz(
          `${utcYear}-${utcMonth.toString().padStart(2, "0")}-${utcDay.toString().padStart(2, "0")} ${utcHour.toString().padStart(2, "0")}:${utcMinute.toString().padStart(2, "0")}:${utcSecond.toString().padStart(2, "0")}`,
          userTimezone,
        );
      }
    } else {
      // If RRULE has no time components, force midnight (00:00:00)
      result = dayjs.tz(
        `${utcYear}-${utcMonth.toString().padStart(2, "0")}-${utcDay.toString().padStart(2, "0")} 00:00:00`,
        userTimezone,
      );
    }

    return result;
  } catch (error) {
    console.error("Error parsing RRULE:", error);
    return null;
  }
}

/**
 * Get current time in user's timezone
 */
export function getCurrentTimeInTimezone(
  userTimezone: string = DEFAULT_TIMEZONE,
): Dayjs {
  return dayjs().tz(userTimezone);
}

/**
 * Convert a date to user's timezone for display
 */
export function toUserTimezone(
  date: string | Date | Dayjs,
  userTimezone: string = DEFAULT_TIMEZONE,
): Dayjs {
  return dayjs(date).tz(userTimezone);
}

/**
 * Check if an RRULE represents a single occurrence (non-recurring)
 */
export function isSingleOccurrence(
  rruleString: string | null | undefined,
): boolean {
  if (!rruleString) return true;
  try {
    return rruleString.includes("COUNT=1");
  } catch {
    return true;
  }
}

/**
 * Check if an RRULE represents a recurring task
 */
export function isRecurring(rruleString: string | null | undefined): boolean {
  return !isSingleOccurrence(rruleString);
}

/**
 * Parse RRULE to display text (e.g., "Every day", "Every week")
 */
export function parseRRuleToDisplay(
  rruleString: string | null | undefined,
): string {
  if (!rruleString || isSingleOccurrence(rruleString)) {
    return "Repeat";
  }

  try {
    const rule = RRule.fromString(rruleString);
    const freq = rule.options.freq;
    const interval = rule.options.interval || 1;
    const byday = rule.options.byweekday;

    switch (freq) {
      case RRule.DAILY:
        return interval === 1 ? "Every day" : `Every ${interval} days`;
      case RRule.WEEKLY:
        if (byday && byday.length === 5) {
          return "Every weekday";
        }
        if (byday && byday.length === 1) {
          // RRule library uses: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday
          const dayNames = [
            "Monday", // 0
            "Tuesday", // 1
            "Wednesday", // 2
            "Thursday", // 3
            "Friday", // 4
            "Saturday", // 5
            "Sunday", // 6
          ];

          const dayName = dayNames[byday[0]];
          return interval === 1
            ? `Every week on ${dayName}`
            : `Every ${interval} weeks on ${dayName}`;
        }
        return interval === 1 ? "Every week" : `Every ${interval} weeks`;
      case RRule.MONTHLY: {
        const bymonthday = rule.options.bymonthday;
        if (bymonthday && bymonthday.length === 1) {
          const day = bymonthday[0];
          const daySuffix = getDaySuffix(day);
          return interval === 1
            ? `Every month on the ${day}${daySuffix}`
            : `Every ${interval} months on the ${day}${daySuffix}`;
        }
        return interval === 1 ? "Every month" : `Every ${interval} months`;
      }
      case RRule.YEARLY: {
        const bymonth = rule.options.bymonth;
        const bymonthdayYearly = rule.options.bymonthday;
        if (
          bymonth &&
          bymonth.length === 1 &&
          bymonthdayYearly &&
          bymonthdayYearly.length === 1
        ) {
          const month = bymonth[0];
          const day = bymonthdayYearly[0];
          const monthName = getMonthName(month);
          const daySuffix = getDaySuffix(day);
          return interval === 1
            ? `Every year on ${monthName} ${day}${daySuffix}`
            : `Every ${interval} years on ${monthName} ${day}${daySuffix}`;
        }
        return interval === 1 ? "Every year" : `Every ${interval} years`;
      }
      default:
        return "Repeat";
    }
  } catch (error) {
    console.error("Error parsing RRULE for display:", error);
    return "Repeat";
  }
}

/**
 * Generate RRULE for quick repeat options
 */
export function generateQuickRRule(
  selectedDate: Dayjs | null,
  frequency: "daily" | "weekly" | "weekdays" | "monthly" | "yearly",
  userTimezone: string = DEFAULT_TIMEZONE,
  basedOn: "SCHEDULED" | "COMPLETED" = "SCHEDULED",
): string | null {
  if (!selectedDate) return null;

  // For "COMPLETED" based on, use current date as fallback if no completion date exists
  const anchorDate =
    basedOn === "COMPLETED" ? dayjs().tz(userTimezone) : selectedDate;

  // Ensure the anchor date is in the user's timezone and preserve the local date
  // We need to use the local date components to avoid timezone conversion issues
  const localDate = anchorDate.tz(userTimezone);

  // Use the local date components directly to avoid timezone conversion issues
  // This preserves the original date regardless of timezone
  const year = localDate.year();
  const month = localDate.month() + 1; // dayjs months are 0-based
  const day = localDate.date();
  const dtstart = `${year.toString().padStart(4, "0")}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}T000000Z`;
  let rrule = "";

  switch (frequency) {
    case "daily": {
      rrule = "FREQ=DAILY";
      break;
    }
    case "weekly": {
      const dayOfWeek = selectedDate.day();
      // The RRule library has a different day mapping than standard RRULE
      // We need to adjust the mapping to match what the library expects
      const rruleDayCodes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      const dayCode = rruleDayCodes[dayOfWeek];
      rrule = `FREQ=WEEKLY;BYDAY=${dayCode}`;
      break;
    }
    case "weekdays": {
      rrule = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
      break;
    }
    case "monthly": {
      const dayOfMonth = selectedDate.date();
      rrule = `FREQ=MONTHLY;BYMONTHDAY=${dayOfMonth}`;
      break;
    }
    case "yearly": {
      const month = selectedDate.month() + 1;
      const dayOfMonthYearly = selectedDate.date();
      rrule = `FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${dayOfMonthYearly}`;
      break;
    }
    default:
      return null;
  }

  return `DTSTART:${dtstart}\nRRULE:${rrule}`;
}

/**
 * Generate RRULE for custom repeat configuration
 */
export function generateCustomRRule(
  selectedDate: Dayjs | null,
  config: {
    frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
    interval: number;
    endType: "NEVER" | "ON_DATE";
    endDate?: Dayjs | null;
    basedOn?: "SCHEDULED" | "COMPLETED";
    selectedDays?: number[]; // For weekly frequency: array of day indices (0=Monday, 6=Sunday)
  },
  userTimezone: string = DEFAULT_TIMEZONE,
  existingRRule?: string | null,
): string | null {
  if (!selectedDate) return null;

  // For "COMPLETED" based on, use current date as fallback if no completion date exists
  const anchorDate =
    config.basedOn === "COMPLETED" ? dayjs().tz(userTimezone) : selectedDate;

  console.log("=== generateCustomRRule Debug ===");
  console.log("Based on:", config.basedOn);
  console.log("Selected date:", selectedDate?.format("YYYY-MM-DD dddd"));
  console.log("Anchor date:", anchorDate.format("YYYY-MM-DD dddd"));

  // Ensure the anchor date is in the user's timezone and preserve the local date
  // We need to use the local date components to avoid timezone conversion issues
  const localDate = anchorDate.tz(userTimezone);

  // Use the local date components directly to avoid timezone conversion issues
  // This preserves the original date regardless of timezone
  const year = localDate.year();
  const month = localDate.month() + 1; // dayjs months are 0-based
  const day = localDate.date();

  // Extract time from existing RRULE if available
  let hour = 0;
  let minute = 0;
  let second = 0;

  if (existingRRule) {
    try {
      // First try to extract time from DTSTART
      const dtstartMatch = existingRRule.match(/DTSTART:([^;\n]+)/);
      if (dtstartMatch) {
        const dtstart = dtstartMatch[1];
        hour = parseInt(dtstart.substring(9, 11));
        minute = parseInt(dtstart.substring(11, 13));
        second = parseInt(dtstart.substring(13, 15));
      } else {
        // If no DTSTART, try to extract time from BYHOUR and BYMINUTE
        const byHourMatch = existingRRule.match(/BYHOUR=(\d+)/);
        const byMinuteMatch = existingRRule.match(/BYMINUTE=(\d+)/);

        if (byHourMatch) {
          hour = parseInt(byHourMatch[1]);
          minute = byMinuteMatch ? parseInt(byMinuteMatch[1]) : 0;
        }
      }
    } catch (error) {
      console.warn("Failed to parse time from existing RRULE:", error);
    }
  }

  // Create DTSTART with preserved time in local timezone (no Z suffix)
  const dtstart = `${year.toString().padStart(4, "0")}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}${minute.toString().padStart(2, "0")}${second.toString().padStart(2, "0")}`;
  let rrule = `FREQ=${config.frequency}`;

  if (config.interval > 1) {
    rrule += `;INTERVAL=${config.interval}`;
  }

  // Add frequency-specific rules
  if (config.frequency === "WEEKLY") {
    if (config.selectedDays && config.selectedDays.length > 0) {
      // Use selected days from checkboxes
      const weekdays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]; // 0=Monday, 6=Sunday
      const selectedDayCodes = config.selectedDays.map(
        (dayIndex) => weekdays[dayIndex],
      );
      rrule += `;BYDAY=${selectedDayCodes.join(",")}`;
    } else {
      // Fallback to selectedDate day of week
      const dayOfWeek = selectedDate.day();
      const weekdays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      rrule += `;BYDAY=${weekdays[dayOfWeek]}`;
    }
  } else if (config.frequency === "MONTHLY") {
    const dayOfMonth = selectedDate.date();
    rrule += `;BYMONTHDAY=${dayOfMonth}`;
  } else if (config.frequency === "YEARLY") {
    const month = selectedDate.month() + 1;
    const dayOfMonth = selectedDate.date();
    rrule += `;BYMONTH=${month};BYMONTHDAY=${dayOfMonth}`;
  }

  // Add end conditions
  if (config.endType === "ON_DATE" && config.endDate) {
    // Use the same date-only approach for UNTIL date
    const untilLocalDate = config.endDate.tz(userTimezone);
    const untilYear = untilLocalDate.year();
    const untilMonth = untilLocalDate.month() + 1; // dayjs months are 0-based
    const untilDay = untilLocalDate.date();
    const until = `${untilYear.toString().padStart(4, "0")}${untilMonth.toString().padStart(2, "0")}${untilDay.toString().padStart(2, "0")}T235959Z`;
    rrule += `;UNTIL=${until}`;
  }

  return `DTSTART:${dtstart}\nRRULE:${rrule}`;
}

/**
 * Generate RRULE for common due date patterns
 */
export const RRuleHelpers = {
  /**
   * Generate RRULE for today
   */
  today: (userTimezone: string = DEFAULT_TIMEZONE) => {
    return generateSingleOccurrenceRRule(
      dayjs().tz(userTimezone),
      userTimezone,
    );
  },

  /**
   * Generate RRULE for tomorrow
   */
  tomorrow: (userTimezone: string = DEFAULT_TIMEZONE) => {
    return generateSingleOccurrenceRRule(
      dayjs().tz(userTimezone).add(1, "day"),
      userTimezone,
    );
  },

  /**
   * Generate RRULE for next weekend
   */
  nextWeekend: (userTimezone: string = DEFAULT_TIMEZONE) => {
    const today = dayjs().tz(userTimezone);
    const comingWeekend =
      today.day() >= 6 ? today.add(1, "week").day(6) : today.day(6);
    return generateSingleOccurrenceRRule(comingWeekend, userTimezone);
  },

  /**
   * Generate RRULE for a specific date
   */
  specificDate: (date: Dayjs, userTimezone: string = DEFAULT_TIMEZONE) => {
    return generateSingleOccurrenceRRule(date, userTimezone);
  },

  /**
   * Generate empty RRULE (no due date)
   */
  none: () => "",
};

/**
 * Parse time from RRULE DTSTART
 * @param rrule - RRULE string
 * @param timezone - User's timezone
 * @returns Dayjs object with time, or null if no time found
 */
export function parseTimeFromRRule(
  rrule: string | null,
  timezone: string = DEFAULT_TIMEZONE,
): Dayjs | null {
  if (!rrule) return null;

  try {
    // First try to extract time from DTSTART
    const dtstartMatch = rrule.match(/DTSTART:([^;\n]+)/);
    if (dtstartMatch) {
      const dtstart = dtstartMatch[1];

      // Parse DTSTART (format: YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMZ)
      const year = parseInt(dtstart.substring(0, 4));
      const month = parseInt(dtstart.substring(4, 6)) - 1; // 0-indexed
      const day = parseInt(dtstart.substring(6, 8));

      // Check if DTSTART has Z suffix (UTC time) or not (local time)
      const isUTC = dtstart.endsWith("Z");
      const dtstartWithoutZ = isUTC ? dtstart.slice(0, -1) : dtstart;

      // Handle both formats: with and without seconds
      let hour, minute, second;
      if (dtstartWithoutZ.length === 15) {
        // YYYYMMDDTHHMMSS
        hour = parseInt(dtstartWithoutZ.substring(9, 11));
        minute = parseInt(dtstartWithoutZ.substring(11, 13));
        second = parseInt(dtstartWithoutZ.substring(13, 15));
      } else if (dtstartWithoutZ.length === 13) {
        // YYYYMMDDTHHMM
        hour = parseInt(dtstartWithoutZ.substring(9, 11));
        minute = parseInt(dtstartWithoutZ.substring(11, 13));
        second = 0; // Default to 0 seconds
      } else {
        return null;
      }

      // If the time is midnight, consider it as "no time set"
      if (hour === 0 && minute === 0 && second === 0) {
        return null;
      }

      // Create the time object
      if (isUTC) {
        // DTSTART is in UTC, convert to user's timezone
        return dayjs
          .utc(
            `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`,
          )
          .tz(timezone);
      } else {
        // DTSTART is in local time, treat as local time
        return dayjs.tz(
          `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`,
          timezone,
        );
      }
    }

    // If no DTSTART, try to extract time from BYHOUR and BYMINUTE
    const byHourMatch = rrule.match(/BYHOUR=(\d+)/);
    const byMinuteMatch = rrule.match(/BYMINUTE=(\d+)/);

    if (byHourMatch) {
      const hour = parseInt(byHourMatch[1]);
      const minute = byMinuteMatch ? parseInt(byMinuteMatch[1]) : 0;

      // If the time is midnight, consider it as "no time set"
      if (hour === 0 && minute === 0) {
        return null;
      }

      // Use today's date with the extracted time
      const today = dayjs().tz(timezone);
      return today.hour(hour).minute(minute).second(0).millisecond(0);
    }

    return null;
  } catch (error) {
    console.warn("Failed to parse time from RRULE:", error);
    return null;
  }
}

/**
 * Update RRULE with new time
 * @param rrule - Existing RRULE string
 * @param newTime - New time to set (null for midnight)
 * @param timezone - User's timezone
 * @returns Updated RRULE string
 */
export function updateRRuleWithTime(
  rrule: string,
  newTime: Dayjs | null,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  if (!rrule) return "";

  try {
    // Extract date from existing DTSTART
    const dtstartMatch = rrule.match(/DTSTART:([^;\n]+)/);

    // If no DTSTART, handle RRULEs with only BYHOUR/BYMINUTE
    if (!dtstartMatch) {
      if (newTime === null) {
        // Clear time by removing BYHOUR and BYMINUTE fields
        return rrule
          .replace(/;BYHOUR=\d+/g, "")
          .replace(/;BYMINUTE=\d+/g, "")
          .replace(/^RRULE:/, "RRULE:")
          .replace(/;$/, "");
      } else {
        // Add BYHOUR and BYMINUTE fields
        let updatedRRule = rrule
          .replace(/;BYHOUR=\d+/g, "")
          .replace(/;BYMINUTE=\d+/g, "");
        updatedRRule += `;BYHOUR=${newTime.hour()}`;
        if (newTime.minute() !== 0) {
          updatedRRule += `;BYMINUTE=${newTime.minute()}`;
        }
        return updatedRRule;
      }
    }

    // Set time to midnight if newTime is null, otherwise use newTime
    let timeToUse;
    if (newTime) {
      // Extract the existing date from DTSTART to preserve it
      const dtstart = dtstartMatch[1];
      const year = parseInt(dtstart.substring(0, 4));
      const month = parseInt(dtstart.substring(4, 6)) - 1; // 0-indexed
      const day = parseInt(dtstart.substring(6, 8));

      // Create a new datetime with the existing date but new time
      // Convert newTime to UTC first to get the correct hour/minute values
      const utcTime = newTime.utc();
      timeToUse = dayjs
        .utc()
        .year(year)
        .month(month)
        .date(day)
        .hour(utcTime.hour())
        .minute(utcTime.minute())
        .second(utcTime.second());
    } else {
      // When clearing time, we need to preserve the display date (not the DTSTART date)
      // First, parse the current RRULE to get the display date
      const currentDisplayDate = parseRRuleToDate(rrule, timezone);
      if (currentDisplayDate) {
        // Create the display date at midnight UTC
        // This ensures the display date stays the same
        timeToUse = dayjs
          .utc()
          .year(currentDisplayDate.year())
          .month(currentDisplayDate.month())
          .date(currentDisplayDate.date())
          .hour(0)
          .minute(0)
          .second(0);
      } else {
        // Fallback to DTSTART date if parsing fails
        const dtstart = dtstartMatch[1];
        const year = parseInt(dtstart.substring(0, 4));
        const month = parseInt(dtstart.substring(4, 6)) - 1; // 0-indexed
        const day = parseInt(dtstart.substring(6, 8));
        timeToUse = dayjs
          .utc()
          .year(year)
          .month(month)
          .date(day)
          .hour(0)
          .minute(0)
          .second(0);
      }
    }

    // Format new DTSTART (timeToUse is already in UTC)
    const newDtstart = `DTSTART:${timeToUse.format("YYYYMMDDTHHmmss")}Z`;

    // Replace DTSTART in RRULE (only the DTSTART part, not the RRULE part)
    return rrule.replace(/DTSTART:[^;\n\r]+/, newDtstart);
  } catch (error) {
    console.warn("Failed to update RRULE with time:", error);
    return rrule;
  }
}

/**
 * Generate RRULE with time only (for when date is not set yet)
 * @param time - Time to set
 * @param timezone - User's timezone
 * @returns RRULE string with time but no date
 */
export function generateTimeOnlyRRule(
  time: Dayjs,
  timezone: string = DEFAULT_TIMEZONE,
): string {
  try {
    // Use current date as placeholder, but this will be updated when date is selected
    const currentDate = dayjs().tz(timezone);

    // Create the datetime with the current date and selected time in local timezone
    // This preserves the time as selected (e.g., 2:45 PM stays as 2:45 PM local time)
    const localTime = currentDate
      .hour(time.hour())
      .minute(time.minute())
      .second(time.second());

    return `DTSTART:${localTime.format("YYYYMMDDTHHmmss")};RRULE:FREQ=DAILY;COUNT=1`;
  } catch (error) {
    console.warn("Failed to generate time-only RRULE:", error);
    return "";
  }
}

/**
 * Parse natural language input and convert to RRULE format
 * @param input - Natural language string (e.g., "every Monday", "tomorrow", "next Friday")
 * @param opts - Optional configuration with timezone
 * @returns RRULE string or null if parsing fails
 */
export function parseNaturalLanguage(
  input: string,
  opts?: { tz?: string },
): string | null {
  if (!input || typeof input !== "string" || input.trim() === "") {
    return null;
  }

  const timezone = opts?.tz || DEFAULT_TIMEZONE;
  let correctedInput = input;

  // 1) Check if there is an "until" in the input text
  const untilMatch = input.match(/until\s+(.+)$/i);
  if (untilMatch) {
    const untilPart = untilMatch[1].trim();

    // 2) Feed it to chrono to get a proper date string
    const parsedUntilDate = chrono.parseDate(untilPart);
    if (parsedUntilDate) {
      // 3) In the input text replace everything after "until" with the date
      correctedInput = input.replace(
        /until\s+.+$/i,
        `until ${dayjs(parsedUntilDate).format("MMMM D, YYYY")}`,
      );
    }
  }

  // 4) Try RRule.fromText with corrected input
  try {
    const rule = RRule.fromText(correctedInput);
    if (rule) {
      const result = rule.toString();
      if (result && result.trim() !== "") {
        // 5) Check if we have an "until" clause but RRule.fromText didn't include it
        // OR if we have a time expression that was parsed incorrectly
        const timeMatch = correctedInput.match(
          /(?:every\s+day|daily|everyday)\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i,
        );

        // Check if we need custom RRULE for time parsing issues
        let needsCustomRRULE = untilMatch && !result.includes("UNTIL=");

        if (timeMatch) {
          const hour = parseInt(timeMatch[1]);
          const ampm = timeMatch[3];

          // Check if RRule.fromText parsed the time incorrectly
          const hasTimeIssues =
            // Missing minutes when they should be present
            (timeMatch[2] && !result.includes("BYMINUTE=")) ||
            // AM/PM conversion issues
            (ampm &&
              ampm.toUpperCase() === "PM" &&
              hour !== 12 &&
              !result.includes(`BYHOUR=${hour + 12}`)) ||
            (ampm &&
              ampm.toUpperCase() === "AM" &&
              hour === 12 &&
              !result.includes("BYHOUR=0"));

          needsCustomRRULE = needsCustomRRULE || hasTimeIssues;
        }

        if (needsCustomRRULE) {
          let customRRULE = "FREQ=DAILY";

          // Handle time parsing
          if (timeMatch) {
            let hour = parseInt(timeMatch[1]);
            const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            const ampm = timeMatch[3];

            // Convert to 24-hour format
            if (ampm) {
              if (ampm.toUpperCase() === "PM" && hour !== 12) {
                hour += 12;
              } else if (ampm.toUpperCase() === "AM" && hour === 12) {
                hour = 0;
              }
            }

            customRRULE += `;BYHOUR=${hour}`;
            if (minute > 0 || timeMatch[2]) {
              customRRULE += `;BYMINUTE=${minute}`;
            }
          } else {
            // Use the time from RRule.fromText result
            const timeOptions = rule.options;
            if (timeOptions.byhour && timeOptions.byhour.length > 0) {
              customRRULE += `;BYHOUR=${timeOptions.byhour.join(",")}`;
            }
            if (timeOptions.byminute && timeOptions.byminute.length > 0) {
              customRRULE += `;BYMINUTE=${timeOptions.byminute.join(",")}`;
            }
          }

          // Add UNTIL if present
          if (untilMatch) {
            const parsedUntilDate = chrono.parseDate(untilMatch[1].trim());
            if (parsedUntilDate) {
              const untilDate = dayjs(parsedUntilDate).tz(timezone);
              const untilUTC = untilDate.utc();
              const untilString = untilUTC.format("YYYYMMDDTHHmmss[Z]");
              customRRULE += `;UNTIL=${untilString}`;
            }
          }

          return customRRULE;
        }

        // Return the result if it's a valid RRULE format
        return result;
      }
    }
  } catch (error) {
    console.debug("RRule.fromText failed:", error);
  }

  // 4.5) Handle cases where RRule.fromText returns empty string for time expressions
  // Try to parse time expressions manually
  const timeMatch = correctedInput.match(
    /(?:every\s+day|daily|everyday)\s+at\s+(\d{1,2}):(\d{2})\s*(AM|PM)?/i,
  );
  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const ampm = timeMatch[3];

    // Convert to 24-hour format
    if (ampm) {
      if (ampm.toUpperCase() === "PM" && hour !== 12) {
        hour += 12;
      } else if (ampm.toUpperCase() === "AM" && hour === 12) {
        hour = 0;
      }
    }

    let customRRULE = "FREQ=DAILY";
    customRRULE += `;BYHOUR=${hour}`;
    customRRULE += `;BYMINUTE=${minute}`;

    // Add UNTIL if present
    if (untilMatch) {
      const parsedUntilDate = chrono.parseDate(untilMatch[1].trim());
      if (parsedUntilDate) {
        const untilDate = dayjs(parsedUntilDate).tz(timezone);
        const untilUTC = untilDate.utc();
        const untilString = untilUTC.format("YYYYMMDDTHHmmss[Z]");
        customRRULE += `;UNTIL=${untilString}`;
      }
    }

    return customRRULE;
  }

  // 5) Fallback: if it looks like a single date/time, build RRULE with COUNT=1
  try {
    const parsed = chrono.parseDate(input);
    if (parsed) {
      // Convert to dayjs for consistent timezone handling
      const parsedDate = dayjs(parsed).tz(timezone);

      // Convert to UTC for proper DTSTART format
      const utcDate = parsedDate.utc();

      // Check if time was explicitly specified in the input (not just current time)
      const hasExplicitTime = /at\s+\d|:\d|am|pm|noon|midnight/i.test(input);

      // Create a single occurrence RRULE using UTC components
      const year = utcDate.year();
      const month = utcDate.month() + 1; // dayjs months are 0-based
      const day = utcDate.date();

      // Use explicit time if specified, otherwise use midnight (00:00:00)
      const hour = hasExplicitTime ? utcDate.hour() : 0;
      const minute = hasExplicitTime ? utcDate.minute() : 0;
      const second = hasExplicitTime ? utcDate.second() : 0;

      const dtstart = `${year.toString().padStart(4, "0")}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}${minute.toString().padStart(2, "0")}${second.toString().padStart(2, "0")}Z`;

      let rrule = "FREQ=DAILY;COUNT=1";
      if (hasExplicitTime) {
        // Add time components to RRULE when time is specified
        rrule += `;BYHOUR=${hour};BYMINUTE=${minute}`;
        if (second !== 0) {
          rrule += `;BYSECOND=${second}`;
        }
      }

      return `DTSTART:${dtstart}\nRRULE:${rrule}`;
    }
  } catch (error) {
    console.debug("chrono-node parsing failed:", error);
  }

  // 3) Give up: caller can handle unknown text
  return null;
}
