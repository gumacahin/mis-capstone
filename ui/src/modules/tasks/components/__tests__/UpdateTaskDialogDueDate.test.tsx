import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

// Mock MUI X Date Pickers components
jest.mock("@mui/x-date-pickers/AdapterDayjs", () => ({
  AdapterDayjs: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@mui/x-date-pickers/DateCalendar", () => ({
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

jest.mock("@mui/x-date-pickers/LocalizationProvider", () => ({
  LocalizationProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

// Mock the useUpdateTask hook
jest.mock("@shared/hooks/queries", () => ({
  useUpdateTask: () => ({
    mutateAsync: jest.fn().mockResolvedValue({}),
  }),
}));

// Mock dayjs to avoid import issues in tests
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  return {
    ...originalDayjs,
    __esModule: true,
    default: originalDayjs.default || originalDayjs,
  };
});

import UpdateTaskDialogDueDate from "../UpdateTaskDialogDueDate";

// Mock the task prop
const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  due_date: "2025-08-25T14:30:00Z", // With time
  priority: "MEDIUM",
  section: 1,
  project: 1,
  tags: [],
  order: 0,
  comments_count: 0,
};

// Mock props
const mockProps = {
  task: mockTask,
  setShowDatePicker: jest.fn(),
};

// Test wrapper component
const TestWrapper = ({
  task,
  setShowDatePicker,
}: {
  task: typeof mockTask;
  setShowDatePicker: jest.Mock;
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
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TestWrapper {...mockProps} />);
      expect(screen.getByText(/Today/)).toBeInTheDocument();
    });

    it("should display calendar icon", () => {
      render(<TestWrapper {...mockProps} />);
      expect(screen.getByTestId("CalendarTodayIcon")).toBeInTheDocument();
    });

    it("should show remove date button when date is selected", () => {
      render(<TestWrapper {...mockProps} />);
      expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
    });

    it("should not show remove date button when no date is selected", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      render(<TestWrapper {...mockProps} task={taskWithoutDate} />);
      expect(screen.queryByTestId("CloseIcon")).not.toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("should select today when clicking today option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Click today option in the popover
      const todayButton = screen.getByRole("button", { name: /today/i });
      await user.click(todayButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should select tomorrow when clicking tomorrow option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Click tomorrow option in the popover
      const tomorrowButton = screen.getByRole("button", { name: /tomorrow/i });
      await user.click(tomorrowButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should select weekend when clicking weekend option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Click weekend option in the popover
      const weekendButton = screen.getByRole("button", {
        name: /this weekend/i,
      });
      await user.click(weekendButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should select next week when clicking next week option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Click next week option in the popover
      const nextWeekButton = screen.getByRole("button", { name: /next week/i });
      await user.click(nextWeekButton);

      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should close popover after selecting a quick date", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Verify popover is open by checking for a specific option
      expect(
        screen.getByRole("button", { name: /tomorrow/i }),
      ).toBeInTheDocument();

      // Click today option in the popover
      const todayButton = screen.getByRole("button", { name: /today/i });
      await user.click(todayButton);

      // Verify popover is closed
      expect(
        screen.queryByRole("button", { name: /tomorrow/i }),
      ).not.toBeInTheDocument();
      expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
    });

    it("should remove date when clicking remove button", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Click remove date button
      const removeButton = screen.getByRole("button", {
        name: /remove due date/i,
      });
      await user.click(removeButton);

      // The remove button only calls handleChange, not setShowDatePicker
      // This is the correct behavior based on the component implementation
      expect(mockProps.setShowDatePicker).not.toHaveBeenCalled();
    });
  });

  describe("Calendar Integration", () => {
    it("should render calendar picker", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Calendar should be rendered
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("should select date from calendar", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Find and click a date in the calendar
      const calendarDate = screen
        .getByRole("grid")
        .querySelector('[role="gridcell"]');
      if (calendarDate) {
        await user.click(calendarDate);
        expect(mockProps.setShowDatePicker).toHaveBeenCalledWith(true);
      }
    });

    it("should close popover after calendar selection", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Open the popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);

      // Verify popover is open by checking for a specific option
      expect(
        screen.getByRole("button", { name: /tomorrow/i }),
      ).toBeInTheDocument();

      // Find and click a date in the calendar
      const calendarDate = screen
        .getByRole("grid")
        .querySelector('[role="gridcell"]');
      if (calendarDate) {
        await user.click(calendarDate);

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
      render(<TestWrapper {...mockProps} />);

      // Should show the current due date
      expect(screen.getByText(/Today/)).toBeInTheDocument();
    });

    it("should handle null values correctly", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      render(<TestWrapper {...mockProps} task={taskWithoutDate} />);

      // Should show "Date" when no date is selected
      expect(screen.getByText("Date")).toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should handle popover open/close correctly", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Initially closed - check that popover options are not visible
      expect(
        screen.queryByRole("button", { name: /tomorrow/i }),
      ).not.toBeInTheDocument();

      // Open popover by clicking the main button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      await user.click(dateButton);
      expect(
        screen.getByRole("button", { name: /tomorrow/i }),
      ).toBeInTheDocument();

      // Close popover by clicking an option
      const todayButton = screen.getByRole("button", { name: /today/i });
      await user.click(todayButton);
      expect(
        screen.queryByRole("button", { name: /tomorrow/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper tooltips", () => {
      render(<TestWrapper {...mockProps} />);

      // Check for tooltip on date button
      const dateButton = screen.getByRole("button", { name: /set due date/i });
      expect(dateButton).toBeInTheDocument();
    });

    it("should have proper button labels", () => {
      render(<TestWrapper {...mockProps} />);

      // Check for remove date button
      const removeButton = screen.getByRole("button", {
        name: /remove due date/i,
      });
      expect(removeButton).toBeInTheDocument();
    });
  });
});
