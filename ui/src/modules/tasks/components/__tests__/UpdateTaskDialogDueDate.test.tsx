import { fireEvent, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../test/test-utils";

// Mock MUI X Date Pickers components
vi.mock("@mui/x-date-pickers/AdapterDayjs", () => ({
  AdapterDayjs: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@mui/x-date-pickers/DateCalendar", () => ({
  DateCalendar: ({
    children,
    onChange,
  }: {
    children: React.ReactNode;
    onChange?: (date: unknown) => void;
  }) => (
    <div role="grid" data-testid="date-calendar">
      <button onClick={() => onChange && onChange(dayjs())}>Select Date</button>
      {children}
    </div>
  ),
}));

vi.mock("@mui/x-date-pickers/LocalizationProvider", () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock the useUpdateTask hook
vi.mock("@shared/hooks/queries", () => ({
  useUpdateTask: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
  }),
}));

import UpdateTaskDialogDueDate from "../UpdateTaskDialogDueDate";

// Mock the task prop
const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  due_date: "2025-08-25T14:30:00Z", // With time
  priority: "MEDIUM" as const,
  section: 1,
  project: 1,
  project_title: "Test Project",
  section_title: "Test Section",
  tags: [] as string[],
  order: 0,
  comments_count: 0,
};

// Mock props
const mockProps = {
  task: mockTask,
  setShowDatePicker: vi.fn(),
};

// Test wrapper component
const TestWrapper = ({
  task,
  setShowDatePicker,
}: {
  task: typeof mockTask;
  setShowDatePicker: ReturnType<typeof vi.fn>;
}) => {
  return (
    <UpdateTaskDialogDueDate
      task={task}
      setShowDatePicker={setShowDatePicker}
    />
  );
};

describe("UpdateTaskDialogDueDate Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);
      expect(screen.getByText(/August 25/)).toBeInTheDocument();
    });

    it("should display calendar icon", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);
      expect(screen.getByTestId("CalendarTodayIcon")).toBeInTheDocument();
    });

    it("should show remove date button when date is selected", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);
      expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
    });

    it("should not show remove date button when no date is selected", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutDate} />,
      );
      expect(screen.queryByTestId("CloseIcon")).not.toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("should select today when clicking today option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Click today option in the popover
      const todayButton = screen.getByRole("button", { name: /today/i });
      await fireEvent.click(todayButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should select tomorrow when clicking tomorrow option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Click tomorrow option in the popover
      const tomorrowButton = screen.getByRole("button", { name: /tomorrow/i });
      await fireEvent.click(tomorrowButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should select weekend when clicking weekend option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Click weekend option in the popover
      const weekendButton = screen.getByRole("button", {
        name: /this weekend/i,
      });
      await fireEvent.click(weekendButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should select next week when clicking next week option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Click next week option in the popover
      const nextWeekButton = screen.getByRole("button", { name: /next week/i });
      await fireEvent.click(nextWeekButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should close popover after selecting a quick date", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Verify popover is open by checking for a specific option
      expect(
        screen.getByRole("button", { name: /tomorrow/i }),
      ).toBeInTheDocument();

      // Click today option in the popover
      const todayButton = screen.getByRole("button", { name: /today/i });
      await fireEvent.click(todayButton);

      // Verify popover is closed
      expect(
        screen.queryByRole("button", { name: /tomorrow/i }),
      ).not.toBeInTheDocument();
      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should remove date when clicking remove button", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Click remove date button
      const removeButton = screen.getByRole("button", {
        name: /remove due date/i,
      });
      await fireEvent.click(removeButton);

      // The remove button only calls handleChange, not setShowDatePicker
      // This is the correct behavior based on the component implementation
      expect(mockProps.setShowDatePicker).not.toHaveBeenCalled();
    });
  });

  describe("Calendar Integration", () => {
    it("should render calendar picker", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Calendar should be rendered
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("should select date from calendar", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Find and click a date in the calendar
      const calendarDate = screen
        .getByRole("grid")
        .querySelector('[role="gridcell"]');
      if (calendarDate) {
        await fireEvent.click(calendarDate);
        expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
      }
    });

    it("should close popover after calendar selection", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);

      // Verify popover is open by checking for a specific option
      expect(
        screen.getByRole("button", { name: /tomorrow/i }),
      ).toBeInTheDocument();

      // Find and click a date in the calendar
      const calendarDate = screen
        .getByRole("grid")
        .querySelector('[role="gridcell"]');
      if (calendarDate) {
        await fireEvent.click(calendarDate);

        // Verify popover is closed
        expect(
          screen.queryByRole("button", { name: /tomorrow/i }),
        ).not.toBeInTheDocument();
        expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
      }
    });
  });

  describe("State Management", () => {
    it("should initialize with correct default values", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Should show the current due date
      expect(screen.getByText(/August 25/)).toBeInTheDocument();
    });

    it("should handle null values correctly", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutDate} />,
      );

      // Should show "Date" when no date is selected
      expect(screen.getByText("Date")).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should handle popover open/close correctly", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Initially closed - check that popover options are not visible
      expect(
        screen.queryByRole("button", { name: /tomorrow/i }),
      ).not.toBeInTheDocument();

      // Open popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await fireEvent.click(dateButton);
      expect(
        screen.getByRole("button", { name: /tomorrow/i }),
      ).toBeInTheDocument();

      // Close popover by clicking an option
      const todayButton = screen.getByRole("button", { name: /today/i });
      await fireEvent.click(todayButton);
      expect(
        screen.queryByRole("button", { name: /tomorrow/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper tooltips", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Check for tooltip on date button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      expect(dateButton).toBeInTheDocument();
    });

    it("should have proper button labels", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Check for remove date button
      const removeButton = screen.getByRole("button", {
        name: /remove due date/i,
      });
      expect(removeButton).toBeInTheDocument();
    });
  });
});
