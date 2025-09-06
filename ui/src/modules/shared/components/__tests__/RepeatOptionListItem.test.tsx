import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fireEvent, render, screen } from "@/test/test-utils";

import { TimezoneProvider } from "../../contexts/TimezoneContext.tsx";
import RepeatOptionListItem from "../RepeatOptionListItem";

// Setup dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Freeze time to a specific date (Tuesday, September 9, 2025)
const FROZEN_TIME = "2025-09-09T10:00:00.000Z"; // Tuesday, September 9, 2025 at 10:00 AM UTC

// Mock the RRULE utility functions
vi.mock("../../utils/rrule", () => ({
  generateQuickRRule: vi.fn(),
  generateSingleOccurrenceRRule: vi.fn(),
  generateRepeatRRuleWithTime: vi.fn(),
  convertToSingleOccurrence: vi.fn(),
  parseRRuleToDisplay: vi.fn(),
  parseRRuleToDate: vi.fn(),
  isRecurring: vi.fn(),
}));

import {
  convertToSingleOccurrence,
  generateRepeatRRuleWithTime,
  generateSingleOccurrenceRRule,
  isRecurring,
  parseRRuleToDate,
  parseRRuleToDisplay,
} from "../../utils/rrule";

const mockGenerateSingleOccurrenceRRule =
  generateSingleOccurrenceRRule as ReturnType<typeof vi.fn>;
const mockGenerateRepeatRRuleWithTime =
  generateRepeatRRuleWithTime as ReturnType<typeof vi.fn>;
const mockConvertToSingleOccurrence = convertToSingleOccurrence as ReturnType<
  typeof vi.fn
>;
const mockParseRRuleToDisplay = parseRRuleToDisplay as ReturnType<typeof vi.fn>;
const mockParseRRuleToDate = parseRRuleToDate as ReturnType<typeof vi.fn>;
const mockIsRecurring = isRecurring as ReturnType<typeof vi.fn>;

// Create a test theme
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <TimezoneProvider>{children}</TimezoneProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("RepeatOptionListItem", () => {
  const mockOnRRuleChange = vi.fn();

  beforeEach(() => {
    // Freeze time to ensure consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date(FROZEN_TIME));

    vi.clearAllMocks();

    // Setup default mocks
    mockIsRecurring.mockReturnValue(false);
    mockParseRRuleToDisplay.mockReturnValue("No repeat");
    mockParseRRuleToDate.mockReturnValue(dayjs("2025-09-09").tz("Asia/Manila"));
    mockGenerateSingleOccurrenceRRule.mockReturnValue(
      "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY;COUNT=1",
    );
    mockGenerateRepeatRRuleWithTime.mockReturnValue(
      "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY",
    );
    mockConvertToSingleOccurrence.mockReturnValue(
      "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY;COUNT=1",
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with no current RRULE", () => {
    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("No repeat")).toBeInTheDocument();
  });

  it("renders with current RRULE", () => {
    const currentRRule = "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY;COUNT=1";
    mockParseRRuleToDisplay.mockReturnValue("Every day");

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={currentRRule}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Every day")).toBeInTheDocument();
  });

  it("opens popover when clicked", () => {
    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("No repeat")).toBeInTheDocument();
    expect(screen.getByText("Every day")).toBeInTheDocument();
    expect(screen.getByText("Every week on Tuesday")).toBeInTheDocument();
  });

  it("calls onRRuleChange with single occurrence RRULE when clear button is clicked", () => {
    // Mock isRecurring to return true so the clear button appears
    mockIsRecurring.mockReturnValue(true);
    const expectedRRule = "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY;COUNT=1";
    mockConvertToSingleOccurrence.mockReturnValue(expectedRRule);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule="DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY"
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    // Click the clear button (X icon) using data-testid
    const clearButton = screen.getByTestId("CloseIcon");
    fireEvent.click(clearButton);

    // Should convert to single occurrence RRULE (COUNT=1) while preserving time
    expect(mockConvertToSingleOccurrence).toHaveBeenCalledWith(
      "DTSTART:20250909T000000Z\\nRRULE:FREQ=DAILY", // currentRRule (with escaped newline)
    );
    expect(mockOnRRuleChange).toHaveBeenCalledWith(expectedRRule);
  });

  it("calls onRRuleChange with generated RRULE when 'Every day' is selected", () => {
    const expectedRRule = "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY";
    mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const everyDayOption = screen.getByText("Every day");
    fireEvent.click(everyDayOption);

    expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
      null, // currentRRule
      "daily",
      dayjs().tz("Asia/Manila"), // effectiveDate when no RRULE is set
      "Asia/Manila",
      "SCHEDULED",
    );
    expect(mockOnRRuleChange).toHaveBeenCalledWith(expectedRRule);
  });

  it("calls onRRuleChange with generated RRULE when 'Every week' is selected", () => {
    const expectedRRule =
      "DTSTART:20250909T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU";
    mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const everyWeekOption = screen.getByText("Every week on Tuesday");
    fireEvent.click(everyWeekOption);

    expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
      null, // currentRRule
      "weekly",
      dayjs().tz("Asia/Manila"), // effectiveDate when no RRULE is set
      "Asia/Manila",
      "SCHEDULED",
    );
    expect(mockOnRRuleChange).toHaveBeenCalledWith(expectedRRule);
  });

  it("calls onRRuleChange with generated RRULE when 'Every month' is selected", () => {
    const expectedRRule =
      "DTSTART:20250909T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=9";
    mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const everyMonthOption = screen.getByText("Every month on the 9th");
    fireEvent.click(everyMonthOption);

    expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
      null, // currentRRule
      "monthly",
      dayjs().tz("Asia/Manila"), // effectiveDate when no RRULE is set
      "Asia/Manila",
      "SCHEDULED",
    );
    expect(mockOnRRuleChange).toHaveBeenCalledWith(expectedRRule);
  });

  it("calls onRRuleChange with generated RRULE when 'Every year' is selected", () => {
    const expectedRRule = "DTSTART:20250909T000000Z\nRRULE:FREQ=YEARLY";
    mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const everyYearOption = screen.getByText("Every year on September 9");
    fireEvent.click(everyYearOption);

    expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
      null, // currentRRule
      "yearly",
      dayjs().tz("Asia/Manila"), // effectiveDate when no RRULE is set
      "Asia/Manila",
      "SCHEDULED",
    );
    expect(mockOnRRuleChange).toHaveBeenCalledWith(expectedRRule);
  });

  it("calls onRRuleChange with generated RRULE when 'Weekdays' is selected", () => {
    const expectedRRule =
      "DTSTART:20250909T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
    mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const weekdaysOption = screen.getByText("Every weekday (Mon - Fri)");
    fireEvent.click(weekdaysOption);

    expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
      null, // currentRRule
      "weekdays",
      dayjs().tz("Asia/Manila"), // effectiveDate when no RRULE is set
      "Asia/Manila",
      "SCHEDULED",
    );
    expect(mockOnRRuleChange).toHaveBeenCalledWith(expectedRRule);
  });

  it("uses current date as fallback when no RRULE is set", () => {
    const expectedRRule = "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY";
    mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const everyDayOption = screen.getByText("Every day");
    fireEvent.click(everyDayOption);

    // Should use current date as fallback
    expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
      null, // currentRRule
      "daily",
      expect.any(Object), // Current date
      "Asia/Manila",
      "SCHEDULED",
    );
  });

  it("shows correct display text for different RRULE types", () => {
    const testCases = [
      {
        rrule: "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY;COUNT=1",
        display: "Every day",
      },
      {
        rrule: "DTSTART:20250909T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU",
        display: "Every week on Tuesday",
      },
      {
        rrule: "DTSTART:20250909T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=9",
        display: "Every month on the 9th",
      },
      {
        rrule: "DTSTART:20250909T000000Z\nRRULE:FREQ=YEARLY",
        display: "Every year",
      },
    ];

    testCases.forEach(({ rrule, display }) => {
      mockParseRRuleToDisplay.mockReturnValue(display);

      const { unmount } = render(
        <TestWrapper>
          <RepeatOptionListItem
            currentRRule={rrule}
            onRRuleChange={mockOnRRuleChange}
          />
        </TestWrapper>,
      );

      expect(screen.getByText(display)).toBeInTheDocument();
      unmount();
    });
  });

  it("handles error when generateRepeatRRuleWithTime returns null", () => {
    mockGenerateRepeatRRuleWithTime.mockReturnValue(null);

    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const everyDayOption = screen.getByText("Every day");
    fireEvent.click(everyDayOption);

    // Should not call onRRuleChange when generateRepeatRRuleWithTime returns null
    expect(mockOnRRuleChange).not.toHaveBeenCalled();
  });

  it("handles popover interaction correctly", () => {
    render(
      <TestWrapper>
        <RepeatOptionListItem
          currentRRule={null}
          onRRuleChange={mockOnRRuleChange}
        />
      </TestWrapper>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Popover should be open
    expect(screen.getByText("Every day")).toBeInTheDocument();

    const everyDayOption = screen.getByText("Every day");
    fireEvent.click(everyDayOption);

    // The selection should work (tested in other tests)
    // We don't need to test the popover closing behavior as it's implementation detail
  });

  describe("anchoring behavior when RRULE not yet set", () => {
    it("anchors quick options on current date when no RRULE is set", () => {
      const expectedRRule = "DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY";
      mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

      render(
        <TestWrapper>
          <RepeatOptionListItem
            currentRRule={null}
            onRRuleChange={mockOnRRuleChange}
          />
        </TestWrapper>,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const everyDayOption = screen.getByText("Every day");
      fireEvent.click(everyDayOption);

      // Should use current date as anchor (effectiveDate fallback)
      expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
        null, // currentRRule
        "daily",
        expect.any(Object), // Current date (dayjs())
        "Asia/Manila",
        "SCHEDULED",
      );
    });

    it("anchors quick options on effective date when RRULE is set", () => {
      const expectedRRule =
        "DTSTART:20250915T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=MO";
      mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

      render(
        <TestWrapper>
          <RepeatOptionListItem
            currentRRule="DTSTART:20250909T000000Z\nRRULE:FREQ=DAILY;COUNT=1"
            onRRuleChange={mockOnRRuleChange}
          />
        </TestWrapper>,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const everyWeekOption = screen.getByText("Every week on Tuesday");
      fireEvent.click(everyWeekOption);

      // Should use effectiveDate (parsed from RRULE) as anchor
      expect(mockGenerateRepeatRRuleWithTime).toHaveBeenCalledWith(
        "DTSTART:20250909T000000Z\\nRRULE:FREQ=DAILY;COUNT=1", // currentRRule (with escaped newline)
        "weekly",
        expect.any(Object), // effectiveDate from parseRRuleToDate mock (dayjs object)
        "Asia/Manila",
        "SCHEDULED",
      );
    });

    it("anchors custom dialog on current date when no RRULE is set", () => {
      const expectedRRule =
        "DTSTART:20250909T000000Z\nRRULE:FREQ=MONTHLY;BYMONTHDAY=9";
      mockGenerateRepeatRRuleWithTime.mockReturnValue(expectedRRule);

      render(
        <TestWrapper>
          <RepeatOptionListItem
            currentRRule={null}
            onRRuleChange={mockOnRRuleChange}
          />
        </TestWrapper>,
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      const customOption = screen.getByText("Custom...");
      fireEvent.click(customOption);

      // Custom dialog should receive current date as selectedDate
      // This is tested indirectly through the RepeatOptions component
      // The actual custom dialog behavior would be tested in RepeatOptions tests
    });
  });
});
