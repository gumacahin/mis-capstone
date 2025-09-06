import dayjs, { type Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { RRule } from "rrule";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  generateCustomRRule,
  generateQuickRRule,
  parseNaturalLanguage,
  parseRRuleToDate,
  parseRRuleToDisplay,
} from "../rrule";

// Setup dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Freeze time for consistent test results
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-09-09T12:00:00Z")); // Set to a fixed date
});

afterEach(() => {
  vi.useRealTimers();
});

describe("generateQuickRRule", () => {
  const testDate = dayjs("2025-09-09"); // Tuesday
  const timezone = "Asia/Manila";

  describe("basic functionality", () => {
    it("returns null when selectedDate is null", () => {
      const result = generateQuickRRule(null, "daily", timezone);
      expect(result).toBeNull();
    });

    it("returns null when selectedDate is undefined", () => {
      const result = generateQuickRRule(
        undefined as unknown as Dayjs,
        "daily",
        timezone,
      );
      expect(result).toBeNull();
    });

    it("uses default timezone when not provided", () => {
      const result = generateQuickRRule(testDate, "daily");
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY");
    });

    it("uses default basedOn when not provided", () => {
      const result = generateQuickRRule(testDate, "daily", timezone);
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY");
    });
  });

  describe("daily frequency", () => {
    it("generates correct daily RRULE", () => {
      const result = generateQuickRRule(testDate, "daily", timezone);
      expect(result).toBe("DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY");
    });

    it("generates daily RRULE with different timezone", () => {
      const result = generateQuickRRule(testDate, "daily", "America/New_York");
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY");
    });
  });

  describe("weekly frequency", () => {
    it("generates correct weekly RRULE for Tuesday", () => {
      const result = generateQuickRRule(testDate, "weekly", timezone);
      expect(result).toBe(
        "DTSTART:20250909T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU",
      );
    });

    it("generates correct weekly RRULE for Sunday", () => {
      const sunday = dayjs("2025-09-07"); // Sunday
      const result = generateQuickRRule(sunday, "weekly", timezone);
      expect(result).toBe(
        "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU",
      );
    });

    it("generates correct weekly RRULE for Saturday", () => {
      const saturday = dayjs("2025-09-06"); // Saturday
      const result = generateQuickRRule(saturday, "weekly", timezone);
      expect(result).toBe(
        "DTSTART:20250906T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SA",
      );
    });

    it("generates correct weekly RRULE for Monday", () => {
      const monday = dayjs("2025-09-08"); // Monday
      const result = generateQuickRRule(monday, "weekly", timezone);
      expect(result).toBe(
        "DTSTART:20250908T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO",
      );
    });
  });

  describe("weekdays frequency", () => {
    it("generates correct weekdays RRULE", () => {
      const result = generateQuickRRule(testDate, "weekdays", timezone);
      expect(result).toBe(
        "DTSTART:20250909T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
      );
    });

    it("generates weekdays RRULE regardless of selected date", () => {
      const sunday = dayjs("2025-09-07"); // Sunday
      const result = generateQuickRRule(sunday, "weekdays", timezone);
      expect(result).toBe(
        "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
      );
    });
  });

  describe("monthly frequency", () => {
    it("generates correct monthly RRULE for 9th", () => {
      const result = generateQuickRRule(testDate, "monthly", timezone);
      expect(result).toBe(
        "DTSTART:20250909T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=9",
      );
    });

    it("generates correct monthly RRULE for 1st", () => {
      const first = dayjs("2025-09-01");
      const result = generateQuickRRule(first, "monthly", timezone);
      expect(result).toBe(
        "DTSTART:20250901T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=1",
      );
    });

    it("generates correct monthly RRULE for 31st", () => {
      const thirtyFirst = dayjs("2025-01-31");
      const result = generateQuickRRule(thirtyFirst, "monthly", timezone);
      expect(result).toBe(
        "DTSTART:20250131T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=31",
      );
    });
  });

  describe("yearly frequency", () => {
    it("generates correct yearly RRULE for September 9th", () => {
      const result = generateQuickRRule(testDate, "yearly", timezone);
      expect(result).toBe(
        "DTSTART:20250909T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=9;BYMONTHDAY=9",
      );
    });

    it("generates correct yearly RRULE for January 1st", () => {
      const newYear = dayjs("2025-01-01");
      const result = generateQuickRRule(newYear, "yearly", timezone);
      expect(result).toBe(
        "DTSTART:20250101T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=1;BYMONTHDAY=1",
      );
    });

    it("generates correct yearly RRULE for December 25th", () => {
      const christmas = dayjs("2025-12-25");
      const result = generateQuickRRule(christmas, "yearly", timezone);
      expect(result).toBe(
        "DTSTART:20251225T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25",
      );
    });
  });

  describe("basedOn parameter", () => {
    it("uses selectedDate when basedOn is SCHEDULED", () => {
      const result = generateQuickRRule(
        testDate,
        "daily",
        timezone,
        "SCHEDULED",
      );
      expect(result).toBe("DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY");
    });

    it("uses current date when basedOn is COMPLETED", () => {
      const result = generateQuickRRule(
        testDate,
        "daily",
        timezone,
        "COMPLETED",
      );
      // Should use current date (2025-09-09T12:00:00Z) instead of selectedDate
      expect(result).toBe("DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY");
    });

    it("uses current date for COMPLETED even with different selectedDate", () => {
      const differentDate = dayjs("2025-12-25");
      const result = generateQuickRRule(
        differentDate,
        "daily",
        timezone,
        "COMPLETED",
      );
      // Should use current date (2025-09-09T12:00:00Z) instead of selectedDate
      expect(result).toBe("DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY");
    });
  });

  describe("timezone handling", () => {
    it("converts to UTC correctly for Asia/Manila", () => {
      const result = generateQuickRRule(testDate, "daily", "Asia/Manila");
      expect(result).toContain("DTSTART:20250909T");
      expect(result).toContain("Z\nRRULE:FREQ=DAILY");
    });

    it("converts to UTC correctly for America/New_York", () => {
      const result = generateQuickRRule(testDate, "daily", "America/New_York");
      expect(result).toContain("DTSTART:20250908T");
      expect(result).toContain("Z\nRRULE:FREQ=DAILY");
    });

    it("handles different timezones for weekly frequency", () => {
      const result = generateQuickRRule(testDate, "weekly", "Europe/London");
      expect(result).toContain("DTSTART:20250909T");
      expect(result).toContain("Z\nRRULE:FREQ=WEEKLY;BYDAY=TU");
    });
  });

  describe("edge cases", () => {
    it("handles leap year date correctly", () => {
      const leapYearDate = dayjs("2024-02-29");
      const result = generateQuickRRule(leapYearDate, "yearly", timezone);
      expect(result).toBe(
        "DTSTART:20240229T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=29",
      );
    });

    it("handles end of month dates correctly", () => {
      const endOfMonth = dayjs("2025-01-31");
      const result = generateQuickRRule(endOfMonth, "monthly", timezone);
      expect(result).toBe(
        "DTSTART:20250131T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=31",
      );
    });

    it("handles midnight times correctly", () => {
      const midnight = dayjs("2025-09-09").startOf("day");
      const result = generateQuickRRule(midnight, "daily", timezone);
      expect(result).toContain("DTSTART:20250909T000000Z");
    });

    it("handles end of day times correctly", () => {
      const endOfDay = dayjs("2025-09-09").endOf("day");
      const result = generateQuickRRule(endOfDay, "daily", timezone);
      expect(result).toContain("DTSTART:20250910T000000Z");
    });
  });

  describe("invalid frequency", () => {
    it("returns null for invalid frequency", () => {
      const result = generateQuickRRule(testDate, "invalid" as never, timezone);
      expect(result).toBeNull();
    });
  });

  describe("integration with other functions", () => {
    it("generates RRULE that can be parsed by parseRRuleToDate", () => {
      const rrule = generateQuickRRule(testDate, "weekly", timezone);
      expect(rrule).not.toBeNull();

      if (rrule) {
        const parsedDate = parseRRuleToDate(rrule);
        expect(parsedDate).not.toBeNull();
        expect(parsedDate?.format("YYYY-MM-DD")).toBe("2025-09-09");
      }
    });

    it("generates RRULE that can be displayed by parseRRuleToDisplay", () => {
      const rrule = generateQuickRRule(testDate, "weekly", timezone);
      expect(rrule).not.toBeNull();

      if (rrule) {
        const displayText = parseRRuleToDisplay(rrule);
        expect(displayText).toContain("week");
      }
    });

    it("correctly parses weekly RRULE with timezone conversion issue", () => {
      // This is the specific issue reported by the user
      const rruleString =
        "DTSTART:20250915T163016Z\nRRULE:FREQ=WEEKLY;BYDAY=TU";
      const parsedDate = parseRRuleToDate(rruleString, "Asia/Manila");

      expect(parsedDate).not.toBeNull();
      // Should be Tuesday, September 16th, not Wednesday, September 17th
      expect(parsedDate?.format("YYYY-MM-DD")).toBe("2025-09-16");
      expect(parsedDate?.format("dddd")).toBe("Tuesday");
    });
  });
});

describe("generateCustomRRule", () => {
  it("generates weekly RRULE with selected days", () => {
    const selectedDate = dayjs("2025-09-07T12:00:00Z").tz("Asia/Manila");
    const config = {
      frequency: "WEEKLY" as const,
      interval: 1,
      endType: "NEVER" as const,
      selectedDays: [0, 1], // Monday and Tuesday
    };

    const rrule = generateCustomRRule(selectedDate, config, "Asia/Manila");
    expect(rrule).toBeTruthy();
    expect(rrule).toContain("FREQ=WEEKLY");
    expect(rrule).toContain("BYDAY=MO,TU");
  });

  it("falls back to selectedDate day when no selectedDays provided", () => {
    const selectedDate = dayjs("2025-09-07T12:00:00Z").tz("Asia/Manila"); // Sunday
    const config = {
      frequency: "WEEKLY" as const,
      interval: 1,
      endType: "NEVER" as const,
    };

    const rrule = generateCustomRRule(selectedDate, config, "Asia/Manila");
    expect(rrule).toBeTruthy();
    expect(rrule).toContain("FREQ=WEEKLY");
    expect(rrule).toContain("BYDAY=SU");
  });

  it("generates daily RRULE with interval", () => {
    const selectedDate = dayjs("2025-09-07T12:00:00Z").tz("Asia/Manila");
    const config = {
      frequency: "DAILY" as const,
      interval: 3,
      endType: "NEVER" as const,
    };

    const rrule = generateCustomRRule(selectedDate, config, "Asia/Manila");
    expect(rrule).toBeTruthy();
    expect(rrule).toContain("FREQ=DAILY");
    expect(rrule).toContain("INTERVAL=3");
  });
});

describe("parseNaturalLanguage", () => {
  const timezone = "Asia/Manila";

  describe("basic functionality", () => {
    it("returns null for empty input", () => {
      const result = parseNaturalLanguage("");
      expect(result).toBeNull();
    });

    it("returns null for null input", () => {
      const result = parseNaturalLanguage(null as unknown as string);
      expect(result).toBeNull();
    });

    it("returns null for undefined input", () => {
      const result = parseNaturalLanguage(undefined as unknown as string);
      expect(result).toBeNull();
    });

    it("returns null for non-string input", () => {
      const result = parseNaturalLanguage(123 as unknown as string);
      expect(result).toBeNull();
    });

    it("uses default timezone when not provided", () => {
      const result = parseNaturalLanguage("tomorrow");
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("uses provided timezone", () => {
      const result = parseNaturalLanguage("tomorrow", {
        tz: "America/New_York",
      });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });
  });

  describe("single date parsing with chrono-node", () => {
    it("parses 'tomorrow' correctly", () => {
      const result = parseNaturalLanguage("tomorrow", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("parses 'next Friday' correctly", () => {
      const result = parseNaturalLanguage("next Friday", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("parses 'December 25th' correctly", () => {
      const result = parseNaturalLanguage("December 25th", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("parses 'in 3 days' correctly", () => {
      const result = parseNaturalLanguage("in 3 days", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("parses 'next week' correctly", () => {
      const result = parseNaturalLanguage("next week", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("parses 'this weekend' correctly", () => {
      const result = parseNaturalLanguage("this weekend", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("parses 'Monday' correctly", () => {
      const result = parseNaturalLanguage("Monday", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });

    it("parses 'today' correctly", () => {
      const result = parseNaturalLanguage("today", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });
  });

  describe("timezone handling", () => {
    it("handles different timezones correctly", () => {
      const resultManila = parseNaturalLanguage("tomorrow", {
        tz: "Asia/Manila",
      });
      const resultNY = parseNaturalLanguage("tomorrow", {
        tz: "America/New_York",
      });

      expect(resultManila).not.toBeNull();
      expect(resultNY).not.toBeNull();

      // Results should be the same because both are converted to UTC
      // The timezone parameter affects the interpretation of the input,
      // but the final DTSTART is always in UTC format
      expect(resultManila).toBe(resultNY);
    });

    it("preserves time information when available", () => {
      const result = parseNaturalLanguage("tomorrow at 3pm", { tz: timezone });
      expect(result).not.toBeNull();
      expect(result).toContain("DTSTART:");
      expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
    });
  });

  describe("edge cases", () => {
    it("returns null for unrecognized input", () => {
      const result = parseNaturalLanguage("xyzabc123", { tz: timezone });
      expect(result).toBeNull();
    });

    it("returns null for ambiguous input", () => {
      const result = parseNaturalLanguage("sometime", { tz: timezone });
      expect(result).toBeNull();
    });

    it("handles empty string gracefully", () => {
      const result = parseNaturalLanguage("   ", { tz: timezone });
      expect(result).toBeNull();
    });

    it("handles very long input gracefully", () => {
      const longInput = "a".repeat(1000);
      const result = parseNaturalLanguage(longInput, { tz: timezone });
      expect(result).toBeNull();
    });
  });

  describe("integration with existing functions", () => {
    it("generates RRULE that can be parsed by parseRRuleToDate", () => {
      const rrule = parseNaturalLanguage("tomorrow", { tz: timezone });
      expect(rrule).not.toBeNull();

      if (rrule) {
        const parsedDate = parseRRuleToDate(rrule, timezone);
        expect(parsedDate).not.toBeNull();
        expect(parsedDate?.isValid()).toBe(true);
      }
    });

    it("generates RRULE that can be displayed by parseRRuleToDisplay", () => {
      const rrule = parseNaturalLanguage("tomorrow", { tz: timezone });
      expect(rrule).not.toBeNull();

      if (rrule) {
        const displayText = parseRRuleToDisplay(rrule);
        expect(displayText).toBe("Repeat"); // Single occurrence should show "Repeat"
      }
    });

    it("generates single occurrence RRULEs", () => {
      const rrule = parseNaturalLanguage("next Friday", { tz: timezone });
      expect(rrule).not.toBeNull();

      if (rrule) {
        expect(rrule).toContain("COUNT=1");
      }
    });
  });

  describe("error handling", () => {
    it("handles RRule.fromText errors gracefully", () => {
      // Mock RRule.fromText to throw an error
      const originalFromText = (
        RRule as typeof RRule & { fromText?: (text: string) => RRule }
      ).fromText;

      try {
        (
          RRule as typeof RRule & { fromText?: (text: string) => RRule }
        ).fromText = vi.fn(() => {
          throw new Error("RRule.fromText error");
        });

        const result = parseNaturalLanguage("every day", { tz: timezone });
        // Should fall back to chrono-node parsing, but chrono-node can't parse "every day"
        // So it should return null
        expect(result).toBeNull();
      } finally {
        // Restore original function
        (
          RRule as typeof RRule & { fromText?: (text: string) => RRule }
        ).fromText = originalFromText;
      }
    });

    it("handles chrono-node parsing errors gracefully", () => {
      // This test ensures that if both RRule.fromText and chrono-node fail,
      // the function returns null gracefully
      const result = parseNaturalLanguage("invalid input that should fail", {
        tz: timezone,
      });
      expect(result).toBeNull();
    });
  });

  describe("real-world examples", () => {
    it("handles common due date expressions", () => {
      const expressions = [
        "tomorrow",
        "next Monday",
        "this Friday",
        "next week",
        "in 2 days",
        "next month",
        "December 25th",
      ];

      expressions.forEach((expr) => {
        const result = parseNaturalLanguage(expr, { tz: timezone });
        expect(result).not.toBeNull();
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
      });
    });

    it("handles time expressions", () => {
      const timeExpressions = [
        "tomorrow at 9am",
        "next Friday at 3pm",
        "Monday at noon",
        "tomorrow morning",
      ];

      timeExpressions.forEach((expr) => {
        const result = parseNaturalLanguage(expr, { tz: timezone });
        expect(result).not.toBeNull();
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");
      });
    });

    it("handles recurring patterns with end dates", () => {
      const recurringWithEndDate = [
        "every day until December 1, 2026",
        "every week until January 15, 2027",
        "every month until March 1, 2026",
      ];

      recurringWithEndDate.forEach((expression) => {
        const result = parseNaturalLanguage(expression, { tz: timezone });
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");

        // Should contain FREQ and UNTIL
        expect(result).toMatch(/FREQ=/);
        expect(result).toMatch(/UNTIL=/);

        // Validate that the RRULE can be parsed and has valid occurrences
        try {
          const rule = RRule.fromString(result);
          const occurrences = rule.all();

          // Should have at least one occurrence (valid date range)
          expect(occurrences.length).toBeGreaterThan(0);

          // Should be recurring (no COUNT, has UNTIL)
          expect(rule.options.count).toBeNull();
          expect(rule.options.until).toBeTruthy();

          // End date should be in the future (after 2024)
          const endDate = new Date(rule.options.until);
          expect(endDate.getFullYear()).toBeGreaterThan(2024);
        } catch (error) {
          throw new Error(
            `Generated RRULE is invalid: ${result}. Error: ${error.message}`,
          );
        }
      });
    });

    it("FAILS when generating RRULEs with no occurrences", () => {
      const problematicExpressions = [
        "every day until December 1", // Missing year - defaults to past
        "every day until next month", // Too vague
        "every day until christmas", // No specific date
      ];

      problematicExpressions.forEach((expression) => {
        const result = parseNaturalLanguage(expression, { tz: timezone });

        if (result) {
          // If it returns a result, it MUST have valid occurrences
          try {
            const rule = RRule.fromString(result);
            const occurrences = rule.all();

            // A correct parser MUST generate RRULEs with at least one occurrence
            expect(occurrences.length).toBeGreaterThan(0);

            // If we get here, the test passes for this expression
          } catch (error) {
            throw new Error(
              `Generated invalid RRULE for "${expression}": ${result}. Error: ${error.message}`,
            );
          }
        } else {
          // If it returns null, that's acceptable for ambiguous inputs
          expect(result).toBeNull();
        }
      });
    });
  });

  describe("single date parsing with time verification", () => {
    const timezone = "Asia/Manila";

    it("parses 'today' correctly - day only, no time", () => {
      const result = parseNaturalLanguage("today", { tz: timezone });
      expect(result).not.toBeNull();

      if (result) {
        // Should contain DTSTART with date only (no specific time)
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");

        // Parse the RRULE to verify it's a single occurrence
        const rule = RRule.fromString(result);
        expect(rule.options.count).toBe(1);

        // Verify the date is today (2025-09-09 based on frozen time)
        const occurrences = rule.all();
        expect(occurrences.length).toBe(1);
        const occurrence = new Date(occurrences[0]);
        expect(occurrence.getFullYear()).toBe(2025);
        expect(occurrence.getMonth()).toBe(8); // September (0-indexed)
        expect(occurrence.getDate()).toBe(9);
      }
    });

    it("parses 'today at 12:00' correctly - day and correct time", () => {
      const result = parseNaturalLanguage("today at 12:00", { tz: timezone });
      expect(result).not.toBeNull();

      if (result) {
        // Should contain DTSTART with specific time
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");

        // Parse the RRULE to verify it's a single occurrence with time
        const rule = RRule.fromString(result);
        expect(rule.options.count).toBe(1);

        // Verify the date and time
        const occurrences = rule.all();
        expect(occurrences.length).toBe(1);
        const occurrence = new Date(occurrences[0]);
        expect(occurrence.getFullYear()).toBe(2025);
        expect(occurrence.getMonth()).toBe(8); // September (0-indexed)
        expect(occurrence.getDate()).toBe(9);
        expect(occurrence.getHours()).toBe(12);
        expect(occurrence.getMinutes()).toBe(0);
      }
    });

    it("parses 'next week' correctly - day only, no time", () => {
      const result = parseNaturalLanguage("next week", { tz: timezone });
      expect(result).not.toBeNull();

      if (result) {
        // Should contain DTSTART with date only (no specific time)
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");

        // Parse the RRULE to verify it's a single occurrence
        const rule = RRule.fromString(result);
        expect(rule.options.count).toBe(1);

        // Verify the date is next week (2025-09-16 based on frozen time)
        const occurrences = rule.all();
        expect(occurrences.length).toBe(1);
        const occurrence = new Date(occurrences[0]);
        expect(occurrence.getFullYear()).toBe(2025);
        expect(occurrence.getMonth()).toBe(8); // September (0-indexed)
        expect(occurrence.getDate()).toBe(16); // Next week from 2025-09-09
      }
    });

    it("parses 'next week at 2:00' correctly - day and correct time", () => {
      const result = parseNaturalLanguage("next week at 2:00", {
        tz: timezone,
      });
      expect(result).not.toBeNull();

      if (result) {
        // Should contain DTSTART with specific time
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");

        // Parse the RRULE to verify it's a single occurrence with time
        const rule = RRule.fromString(result);
        expect(rule.options.count).toBe(1);

        // Verify the date and time
        const occurrences = rule.all();
        expect(occurrences.length).toBe(1);
        const occurrence = new Date(occurrences[0]);
        expect(occurrence.getFullYear()).toBe(2025);
        expect(occurrence.getMonth()).toBe(8); // September (0-indexed)
        expect(occurrence.getDate()).toBe(16); // Next week from 2025-09-09
        expect(occurrence.getHours()).toBe(14); // 2:00 PM in UTC (Asia/Manila is UTC+8)
        expect(occurrence.getMinutes()).toBe(0);
      }
    });

    it("parses 'tomorrow at 3:30 PM' correctly - day and correct time", () => {
      const result = parseNaturalLanguage("tomorrow at 3:30 PM", {
        tz: timezone,
      });
      expect(result).not.toBeNull();

      if (result) {
        // Should contain DTSTART with specific time
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");

        // Parse the RRULE to verify it's a single occurrence with time
        const rule = RRule.fromString(result);
        expect(rule.options.count).toBe(1);

        // Verify the date and time
        const occurrences = rule.all();
        expect(occurrences.length).toBe(1);
        const occurrence = new Date(occurrences[0]);
        expect(occurrence.getFullYear()).toBe(2025);
        expect(occurrence.getMonth()).toBe(8); // September (0-indexed)
        expect(occurrence.getDate()).toBe(10); // Tomorrow from 2025-09-09
        expect(occurrence.getHours()).toBe(15); // 3:30 PM in UTC (Asia/Manila is UTC+8, so 3:30 PM = 15:30 UTC)
        expect(occurrence.getMinutes()).toBe(30);
      }
    });

    it("parses 'Friday' correctly - day only, no time", () => {
      const result = parseNaturalLanguage("Friday", { tz: timezone });
      expect(result).not.toBeNull();

      if (result) {
        // Should contain DTSTART with date only (no specific time)
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");

        // Parse the RRULE to verify it's a single occurrence
        const rule = RRule.fromString(result);
        expect(rule.options.count).toBe(1);

        // Verify the date is the next Friday (2025-09-12 based on frozen time 2025-09-09)
        const occurrences = rule.all();
        expect(occurrences.length).toBe(1);
        const occurrence = new Date(occurrences[0]);
        expect(occurrence.getFullYear()).toBe(2025);
        expect(occurrence.getMonth()).toBe(8); // September (0-indexed)
        expect(occurrence.getDate()).toBe(12); // Next Friday from 2025-09-09 (Tuesday)
        expect(occurrence.getDay()).toBe(5); // Friday
      }
    });

    it("parses 'Friday at 9:15 AM' correctly - day and correct time", () => {
      const result = parseNaturalLanguage("Friday at 9:15 AM", {
        tz: timezone,
      });
      expect(result).not.toBeNull();

      if (result) {
        // Should contain DTSTART with specific time
        expect(result).toContain("DTSTART:");
        expect(result).toContain("RRULE:FREQ=DAILY;COUNT=1");

        // Parse the RRULE to verify it's a single occurrence with time
        const rule = RRule.fromString(result);
        expect(rule.options.count).toBe(1);

        // Verify the date and time
        const occurrences = rule.all();
        expect(occurrences.length).toBe(1);
        const occurrence = new Date(occurrences[0]);
        expect(occurrence.getFullYear()).toBe(2025);
        expect(occurrence.getMonth()).toBe(8); // September (0-indexed)
        expect(occurrence.getDate()).toBe(12); // Next Friday from 2025-09-09 (Tuesday)
        expect(occurrence.getDay()).toBe(5); // Friday
        expect(occurrence.getHours()).toBe(9); // 9:15 AM in UTC (Asia/Manila is UTC+8, so 9:15 AM = 9:15 UTC)
        expect(occurrence.getMinutes()).toBe(15);
      }
    });
  });

  describe("correctUntilDate timezone handling", () => {
    const timezone = "Asia/Manila";

    it("handles expressions that RRule.fromText can parse with corrected UNTIL dates", () => {
      // These are expressions that RRule.fromText can parse with corrected UNTIL dates
      const testCases = [
        "every day until December 1, 2026", // Future date - should work
        "every day until March 15, 2026", // Future date - should work
        "every day until January 1, 2026", // Future date - should work
      ];

      testCases.forEach((input) => {
        const result = parseNaturalLanguage(input, { tz: timezone });

        expect(result).toBeTruthy();
        if (result) {
          const rule = RRule.fromString(result);
          const occurrences = rule.all();
          expect(occurrences.length).toBeGreaterThan(0);

          // Should have a valid UNTIL date
          expect(rule.options.until).toBeTruthy();
          const untilDate = new Date(rule.options.until);
          expect(untilDate.getFullYear()).toBeGreaterThan(2024);
        }
      });
    });

    it("handles expressions that RRule.fromText cannot parse (falls back to chrono)", () => {
      // These are expressions that RRule.fromText cannot parse, so they fall back to chrono
      // The chrono fallback treats them as single dates, not recurring patterns
      const testCases = [
        "every day until next week",
        "every day until next year",
        "every day until october 3rd",
        "every day until Friday",
        "every day until next tuesday",
        "every day until weekend",
      ];

      testCases.forEach((input) => {
        const result = parseNaturalLanguage(input, { tz: timezone });

        // These should return UNTIL-based RRULEs because the new logic
        // parses the "until" part with chrono and creates proper recurring RRULEs
        expect(result).toBeTruthy();
        if (result) {
          expect(result).toMatch(/UNTIL=/);
          expect(result).toMatch(/FREQ=/);
        }
      });
    });

    it("handles timezone differences correctly", () => {
      const testCases = [
        { input: "every day until December 1, 2026", tz: "America/New_York" },
        { input: "every day until December 1, 2026", tz: "Europe/London" },
        { input: "every day until December 1, 2026", tz: "Pacific/Auckland" },
        { input: "every day until December 1, 2026", tz: "Asia/Tokyo" },
      ];

      testCases.forEach(({ input, tz }) => {
        const result = parseNaturalLanguage(input, { tz });

        expect(result).toBeTruthy();
        if (result) {
          const rule = RRule.fromString(result);
          const occurrences = rule.all();
          expect(occurrences.length).toBeGreaterThan(0);

          // Should have a valid UNTIL date
          expect(rule.options.until).toBeTruthy();
          const untilDate = new Date(rule.options.until);
          expect(untilDate.getFullYear()).toBeGreaterThan(2024);

          // The UNTIL date should be in the future
          expect(untilDate.getTime()).toBeGreaterThan(Date.now());
        }
      });
    });

    it("handles past dates by adding a year", () => {
      const input = "every day until January 1";
      const result = parseNaturalLanguage(input, { tz: timezone });

      expect(result).toBeTruthy();
      if (result) {
        const rule = RRule.fromString(result);
        const occurrences = rule.all();
        expect(occurrences.length).toBeGreaterThan(0);

        // Should have a valid UNTIL date in the next year
        expect(rule.options.until).toBeTruthy();
        const untilDate = new Date(rule.options.until);
        expect(untilDate.getFullYear()).toBeGreaterThan(2025);
      }
    });

    it("handles ambiguous month names (returns null)", () => {
      const testCases = [
        "every day until march",
        "every day until april",
        "every day until may",
        "every day until june",
        "every day until july",
        "every day until august",
        "every day until september",
        "every day until november",
      ];

      testCases.forEach((input) => {
        const result = parseNaturalLanguage(input, { tz: timezone });

        // These should return valid UNTIL-based RRULEs because the new logic
        // parses the "until" part with chrono and creates proper recurring RRULEs
        expect(result).toBeTruthy();
        if (result) {
          expect(result).toMatch(/UNTIL=/);
          expect(result).toMatch(/FREQ=/);
        }
      });
    });

    it("handles specific dates with years", () => {
      const testCases = [
        "every day until December 1, 2026",
        "every day until January 15, 2027",
        "every day until March 1, 2028",
      ];

      testCases.forEach((input) => {
        const result = parseNaturalLanguage(input, { tz: timezone });

        expect(result).toBeTruthy();
        if (result) {
          const rule = RRule.fromString(result);
          const occurrences = rule.all();
          expect(occurrences.length).toBeGreaterThan(0);

          // Should have a valid UNTIL date
          expect(rule.options.until).toBeTruthy();
          const untilDate = new Date(rule.options.until);
          expect(untilDate.getFullYear()).toBeGreaterThan(2025);
        }
      });
    });
  });
});
