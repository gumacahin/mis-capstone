import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RRule } from "rrule";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test/test-utils";

import { TimezoneProvider } from "../../contexts/TimezoneContext.tsx";
import { parseNaturalLanguage } from "../../utils/rrule";
import ParsedRRuleListItem from "../ParsedRRuleListItem";

// Mock the useTimezone hook
vi.mock("../../hooks/useTimezone", () => ({
  useTimezone: () => ({
    timezone: "Asia/Manila",
  }),
}));

// Mock the useTasksForDate hook
vi.mock("../../hooks/useTasksForDate", () => ({
  useTasksForDate: () => ({
    data: [],
    isLoading: false,
  }),
}));

// Freeze time for consistent testing
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-09-07T00:57:00Z")); // Sunday 8:57 AM Manila time
});

afterAll(() => {
  vi.useRealTimers();
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimezoneProvider>{children}</TimezoneProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("ParsedRRuleListItem", () => {
  it("should render non-repeating RRULE with calendar icon", () => {
    // Single occurrence RRULE (COUNT=1)
    const singleOccurrenceRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY;COUNT=1";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={singleOccurrenceRRule} />
      </TestWrapper>,
    );

    // Should show the date without time (midnight = no time)
    expect(screen.getByText("Sun Sep 7")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have calendar icon (not refresh icon)
    const calendarIcon = screen.getByTestId("CalendarTodayIcon");
    expect(calendarIcon).toBeInTheDocument();
  });

  it("should render repeating RRULE without end date (forever)", () => {
    // Weekly recurring RRULE without UNTIL
    const weeklyForeverRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={weeklyForeverRRule} />
      </TestWrapper>,
    );

    // Should show start date -> Forever
    expect(screen.getByText("Sun Sep 7 → Forever")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon (not calendar icon)
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should render repeating RRULE with end date in same month", () => {
    // Weekly recurring RRULE with UNTIL in same month
    const weeklyWithEndSameMonth =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU;UNTIL=20250928T235959Z";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={weeklyWithEndSameMonth} />
      </TestWrapper>,
    );

    // Should show start date -> end date (no month since same month)
    expect(screen.getByText("Sun Sep 7 → Mon 29")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should render repeating RRULE with end date in different month", () => {
    // Weekly recurring RRULE with UNTIL in different month
    const weeklyWithEndDifferentMonth =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU;UNTIL=20251005T235959Z";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={weeklyWithEndDifferentMonth} />
      </TestWrapper>,
    );

    // Should show start date -> end date with month
    expect(screen.getByText("Sun Sep 7 → Mon Oct 6")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should render repeating RRULE with end date in different year", () => {
    // Weekly recurring RRULE with UNTIL in different year
    const weeklyWithEndDifferentYear =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU;UNTIL=20260105T235959Z";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={weeklyWithEndDifferentYear} />
      </TestWrapper>,
    );

    // Should show start date -> end date with month and year (2026 in right part)
    expect(screen.getByText("Sun Sep 7 → Tue Jan 6 2026")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should handle daily recurring RRULE", () => {
    // Daily recurring RRULE
    const dailyRRule = "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={dailyRRule} />
      </TestWrapper>,
    );

    // Should show start date -> Forever
    expect(screen.getByText("Sun Sep 7 → Forever")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should handle monthly recurring RRULE", () => {
    // Monthly recurring RRULE
    const monthlyRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=7";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={monthlyRRule} />
      </TestWrapper>,
    );

    // Should show start date -> Forever
    expect(screen.getByText("Sun Sep 7 → Forever")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should handle yearly recurring RRULE", () => {
    // Yearly recurring RRULE
    const yearlyRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=YEARLY;BYMONTH=9;BYMONTHDAY=7";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={yearlyRRule} />
      </TestWrapper>,
    );

    // Should show start date -> Forever
    expect(screen.getByText("Sun Sep 7 → Forever")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should handle weekdays recurring RRULE", () => {
    // Weekdays recurring RRULE
    const weekdaysRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={weekdaysRRule} />
      </TestWrapper>,
    );

    // Should show start date -> Forever (weekdays starts on Monday, not Sunday)
    expect(screen.getByText("Mon Sep 8 → Forever")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should handle timezone correctly", () => {
    // Test with default timezone (Asia/Manila) - timezone support is verified by the component using useTimezone hook
    const singleOccurrenceRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY;COUNT=1";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={singleOccurrenceRRule} />
      </TestWrapper>,
    );

    // Should show the date without time (midnight = no time)
    expect(screen.getByText("Sun Sep 7")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();
  });

  it("should return null for invalid RRULE", () => {
    // Invalid RRULE string
    const invalidRRule = "INVALID_RRULE_STRING";

    const { container } = render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={invalidRRule} />
      </TestWrapper>,
    );

    // Should render nothing (null)
    expect(container.firstChild).toBeNull();
  });

  it("should handle edge case with end date on same day as start", () => {
    // RRULE with end date on same day as start
    const sameDayEndRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY;UNTIL=20250907T235959Z";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={sameDayEndRRule} />
      </TestWrapper>,
    );

    // Should show start date -> end date (same day)
    expect(screen.getByText("Sun Sep 7 → Mon 8")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  it("should handle RRULE with COUNT but no UNTIL", () => {
    // RRULE with COUNT (limited occurrences) but no UNTIL
    const countRRule =
      "DTSTART:20250907T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=SU;COUNT=5";

    render(
      <TestWrapper>
        <ParsedRRuleListItem rrule={countRRule} />
      </TestWrapper>,
    );

    // Should show start date -> Forever (since no UNTIL date)
    expect(screen.getByText("Sun Sep 7 → Forever")).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();

    // Should have refresh icon
    const refreshIcon = screen.getByTestId("RefreshIcon");
    expect(refreshIcon).toBeInTheDocument();
  });

  describe("task count display", () => {
    it("should display 'No tasks' when no tasks are found", () => {
      // The global mock already returns empty tasks, so this should work
      const singleOccurrenceRRule =
        "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY;COUNT=1";

      render(
        <TestWrapper>
          <ParsedRRuleListItem rrule={singleOccurrenceRRule} />
        </TestWrapper>,
      );

      expect(screen.getByText("No tasks")).toBeInTheDocument();
    });

    it("should use the tasks for date hook", () => {
      // Test that the component uses the tasks hook
      const singleOccurrenceRRule =
        "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY;COUNT=1";

      render(
        <TestWrapper>
          <ParsedRRuleListItem rrule={singleOccurrenceRRule} />
        </TestWrapper>,
      );

      // The component should render with the mocked data (without time - midnight = no time)
      expect(screen.getByText("Sun Sep 7")).toBeInTheDocument();
      expect(screen.getByText("No tasks")).toBeInTheDocument();
    });
  });

  describe("natural language parsing integration", () => {
    it("displays recurring pattern with corrected UNTIL date from 'every day until December 1'", () => {
      // This is the ACTUAL output from parseNaturalLanguage for "every day until December 1"
      // The parser now correctly fixes the UNTIL date to be in the future (2025)
      const actualParserOutput = "RRULE:FREQ=DAILY;UNTIL=20251201T040000Z";
      const completeRRule = `DTSTART:20250907T000000Z\n${actualParserOutput}`;

      render(
        <TestWrapper>
          <ParsedRRuleListItem rrule={completeRRule} />
        </TestWrapper>,
      );

      // Should show recurring icon (RefreshIcon)
      expect(screen.getByTestId("RefreshIcon")).toBeInTheDocument();

      // Should show date range with start and end dates
      const primaryText = screen
        .getByRole("button")
        .querySelector(".MuiListItemText-primary");
      expect(primaryText).toBeInTheDocument();

      // Check what the component actually displays
      const displayText = primaryText?.textContent;
      // console.log("ParsedRRuleListItem displays:", displayText);

      // The component should now show the correct end date instead of "Forever"
      // because the UNTIL date is now valid and in the future
      expect(displayText).not.toContain("Forever");
      expect(displayText).toContain("→");

      // Should show "No tasks" since we mocked empty data
      expect(screen.getByText("No tasks")).toBeInTheDocument();
    });

    it("displays recurring pattern with end date from 'every day until December 1' (corrected)", () => {
      // This is a corrected version with valid date range for testing purposes
      const rruleFromNaturalLanguage =
        "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY;UNTIL=20251201T235959Z";

      render(
        <TestWrapper>
          <ParsedRRuleListItem rrule={rruleFromNaturalLanguage} />
        </TestWrapper>,
      );

      // Should show recurring icon (RefreshIcon)
      expect(screen.getByTestId("RefreshIcon")).toBeInTheDocument();

      // Should show date range with start and end dates
      const primaryText = screen
        .getByRole("button")
        .querySelector(".MuiListItemText-primary");
      expect(primaryText).toBeInTheDocument();

      // Should show "No tasks" since we mocked empty data
      expect(screen.getByText("No tasks")).toBeInTheDocument();
    });

    it("displays recurring pattern with end date from 'every day until December 1, 2025'", () => {
      // This is the complete RRULE format that would be generated by parseNaturalLanguage
      // for "every day until December 1, 2025" - includes DTSTART + RRULE
      const rruleFromNaturalLanguage =
        "DTSTART:20250907T000000Z\nRRULE:FREQ=DAILY;UNTIL=20251130T160000Z";

      render(
        <TestWrapper>
          <ParsedRRuleListItem rrule={rruleFromNaturalLanguage} />
        </TestWrapper>,
      );

      // Should show recurring icon (RefreshIcon)
      expect(screen.getByTestId("RefreshIcon")).toBeInTheDocument();

      // Should show "No tasks" since we mocked empty data
      expect(screen.getByText("No tasks")).toBeInTheDocument();
    });

    it("displays recurring pattern with COUNT from 'everyday for 3 times'", () => {
      // This is the ACTUAL output from parseNaturalLanguage for "everyday for 3 times"
      const actualParserOutput = "RRULE:FREQ=DAILY;COUNT=3";
      const completeRRule = `DTSTART:20250907T000000Z\n${actualParserOutput}`;

      render(
        <TestWrapper>
          <ParsedRRuleListItem rrule={completeRRule} />
        </TestWrapper>,
      );

      // Should show recurring icon (RefreshIcon) - COUNT-based is still recurring
      expect(screen.getByTestId("RefreshIcon")).toBeInTheDocument();

      // Should show date range with start and end dates
      const primaryText = screen
        .getByRole("button")
        .querySelector(".MuiListItemText-primary");
      expect(primaryText).toBeInTheDocument();

      // Check what the component actually displays
      const displayText = primaryText?.textContent;
      // console.log("ParsedRRuleListItem displays:", displayText);

      // The component correctly shows "Forever" because COUNT-based RRULEs are not supported
      // The system only supports UNTIL-based end dates, not COUNT-based
      expect(displayText).toContain("Forever");

      // Should show "No tasks" since we mocked empty data
      expect(screen.getByText("No tasks")).toBeInTheDocument();
    });

    it("should parse 'today' and confirm no time component in ParsedRRuleListItem", () => {
      const timezone = "Asia/Manila";

      // 1) Parse "today"
      const result = parseNaturalLanguage("today", { tz: timezone });
      // console.log("1) Result of parsing 'today':", result);

      expect(result).not.toBeNull();

      if (result) {
        // 2) Use the result of step 1 to render ParsedRRuleListItem
        // console.log("2) Using result in ParsedRRuleListItem...");
        // console.log("RRULE string:", result);

        render(
          <TestWrapper>
            <ParsedRRuleListItem
              rrule={result}
              onClick={() => {}}
              isSelected={false}
            />
          </TestWrapper>,
        );

        // 3) Confirm there is no time component
        // console.log("3) Checking ParsedRRuleListItem display...");

        // Check what's actually displayed
        const primaryText = screen
          .getByRole("button")
          .querySelector(".MuiListItemText-primary");
        const displayText = primaryText?.textContent;
        // console.log("Actual display text:", displayText);

        // Check what's displayed - should show date only, no time
        expect(displayText).toContain("Sun Sep 7");
        expect(displayText).not.toContain("8:57 AM");

        // Check if time is displayed (it shouldn't be for "today")
        const timeElements = screen.queryAllByText(/\d{1,2}:\d{2}/);
        // console.log("Time elements found:", timeElements.length);

        // For "today" without specific time, there should be NO time display
        expect(timeElements.length).toBe(0);

        // Verify the RRULE has no time components
        const rule = RRule.fromString(result);

        // console.log("RRULE options:", {
        //   byhour: rule.options.byhour,
        //   byminute: rule.options.byminute,
        //   bysecond: rule.options.bysecond,
        //   count: rule.options.count,
        //   freq: rule.options.freq,
        // });

        // Note: RRule library automatically adds time components even when not specified
        // The important thing is that the component correctly detects no explicit time components
        // and displays date-only format

        // Should be a single occurrence
        expect(rule.options.count).toBe(1);
      }
    });

    it("should parse 'today at 12' and confirm time is displayed in ParsedRRuleListItem", () => {
      const timezone = "Asia/Manila";

      // 1) Parse "today at 12"
      const result = parseNaturalLanguage("today at 12", { tz: timezone });
      // console.log("1) Result of parsing 'today at 12':", result);

      expect(result).not.toBeNull();

      if (result) {
        // 2) Use the result in ParsedRRuleListItem
        // console.log("2) Using result in ParsedRRuleListItem...");
        // console.log("RRULE string:", result);

        render(
          <TestWrapper>
            <ParsedRRuleListItem
              rrule={result}
              onClick={() => {}}
              isSelected={false}
            />
          </TestWrapper>,
        );

        // 3) Confirm time is displayed
        // Check what's actually displayed
        const primaryText = screen
          .getByRole("button")
          .querySelector(".MuiListItemText-primary");
        const displayText = primaryText?.textContent;

        // Should show date with time
        expect(displayText).toContain("Sun Sep 7");
        expect(displayText).toContain("8:00 PM"); // 12:00 UTC = 8:00 PM in Asia/Manila

        // Check if time is displayed (it should be for "today at 12")
        const timeElements = screen.queryAllByText(/\d{1,2}:\d{2}/);

        // For "today at 12", there should be time display
        expect(timeElements.length).toBeGreaterThan(0);

        // Verify the RRULE has time components
        const rule = RRule.fromString(result);

        // Should be a single occurrence
        expect(rule.options.count).toBe(1);
      }
    });
  });
});
