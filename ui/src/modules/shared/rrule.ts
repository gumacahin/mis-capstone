import dayjs, { Dayjs } from "dayjs";

import { RepeatOption } from "./types/common";

/**
 * Generate a recurrence rule string (RRULE) from user options.
 *
 * @param rrule existing rule or null
 * @param option        "daily" | "weekly" | "weekdays" | "monthly" | "yearly"
 * @param date wall-clock datetime chosen by user (string | Date | dayjs)
 * @param timezone      IANA zone string (not embedded here, used elsewhere)
 * @param basedOn       optional hint ("SCHEDULED" | "COMPLETED")
 */
export function generateRrule(
  rrule: string | null,
  option: RepeatOption,
  date: Dayjs,
): string {
  // Interpret the effective date (keeps full wall-clock datetime)
  const local = dayjs(date);

  // Extract date + time separately
  const weekdayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const weekday = weekdayNames[local.day()]; // 0=Sun..6=Sat
  const monthday = local.date(); // 1..31
  const month = local.month() + 1; // 1..12

  // Build the rule core
  let ruleCore = "";
  switch (option) {
    case "daily":
      ruleCore = "FREQ=DAILY";
      break;
    case "weekly":
      ruleCore = `FREQ=WEEKLY;BYDAY=${weekday}`;
      break;
    case "weekdays":
      ruleCore = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
      break;
    case "monthly":
      ruleCore = `FREQ=MONTHLY;BYMONTHDAY=${monthday}`;
      break;
    case "yearly":
      ruleCore = `FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${monthday}`;
      break;
  }

  return ruleCore;
}
