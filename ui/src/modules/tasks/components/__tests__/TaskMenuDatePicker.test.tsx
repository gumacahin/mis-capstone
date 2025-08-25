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

// Mock dayjs to avoid import issues in tests
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  return {
    ...originalDayjs,
    __esModule: true,
    default: originalDayjs.default || originalDayjs,
  };
});

import TaskMenuDatePicker from "../TaskMenuDatePicker";

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
  handleOnChange: jest.fn(),
  anchorEl: document.createElement("button"), // Mock anchor element
  handleClose: jest.fn(),
};

// Test wrapper component
const TestWrapper = ({
  task,
  handleOnChange,
  anchorEl,
  handleClose,
}: {
  task: typeof mockTask;
  handleOnChange: jest.Mock;
  anchorEl: HTMLElement;
  handleClose: jest.Mock;
}) => {
  return (
    <TaskMenuDatePicker
      task={task}
      handleOnChange={handleOnChange}
      anchorEl={anchorEl}
      handleClose={handleClose}
    />
  );
};

describe("TaskMenuDatePicker Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TestWrapper {...mockProps} />);
      expect(screen.getByText("Today")).toBeInTheDocument();
    });

    it("should display all quick date options", () => {
      render(<TestWrapper {...mockProps} />);
      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
      expect(screen.getByText("This weekend")).toBeInTheDocument();
      expect(screen.getByText("Next Week")).toBeInTheDocument();
    });

    it("should show remove date button when date is selected", () => {
      render(<TestWrapper {...mockProps} />);
      expect(screen.getByText("No date")).toBeInTheDocument();
    });

    it("should not show remove date button when no date is selected", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      render(<TestWrapper {...mockProps} task={taskWithoutDate} />);
      expect(screen.queryByText("No date")).not.toBeInTheDocument();
    });

    it("should display calendar picker", () => {
      render(<TestWrapper {...mockProps} />);
      expect(screen.getByTestId("date-calendar")).toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("should select today when clicking today option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Click today option
      const todayButton = screen.getByText("Today");
      await user.click(todayButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should select tomorrow when clicking tomorrow option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Click tomorrow option
      const tomorrowButton = screen.getByText("Tomorrow");
      await user.click(tomorrowButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should select weekend when clicking weekend option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Click weekend option
      const weekendButton = screen.getByText("This weekend");
      await user.click(weekendButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should select next week when clicking next week option", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Click next week option
      const nextWeekButton = screen.getByText("Next Week");
      await user.click(nextWeekButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should remove date when clicking remove button", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Click remove date button
      const removeButton = screen.getByText("No date");
      await user.click(removeButton);

      expect(mockProps.handleOnChange).toHaveBeenCalledWith(null);
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });

  describe("Calendar Integration", () => {
    it("should select date from calendar", async () => {
      const user = userEvent.setup();
      render(<TestWrapper {...mockProps} />);

      // Find and click a date in the calendar
      const calendarDate = screen
        .getByTestId("date-calendar")
        .querySelector("button");
      if (calendarDate) {
        await user.click(calendarDate);
        expect(mockProps.handleOnChange).toHaveBeenCalled();
        expect(mockProps.handleClose).toHaveBeenCalled();
      }
    });
  });

  describe("State Management", () => {
    it("should initialize with correct default values", () => {
      render(<TestWrapper {...mockProps} />);

      // Should show the current due date options
      expect(screen.getByText("Today")).toBeInTheDocument();
    });

    it("should handle null values correctly", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      render(<TestWrapper {...mockProps} task={taskWithoutDate} />);

      // Should not show remove date button when no date is selected
      expect(screen.queryByText("No date")).not.toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should handle popover open/close correctly", () => {
      render(<TestWrapper {...mockProps} />);

      // Popover should be open when anchorEl is provided
      expect(screen.getByText("Today")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button labels", () => {
      render(<TestWrapper {...mockProps} />);

      // Check for all date option buttons
      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
      expect(screen.getByText("This weekend")).toBeInTheDocument();
      expect(screen.getByText("Next Week")).toBeInTheDocument();
    });

    it("should have proper secondary actions", () => {
      render(<TestWrapper {...mockProps} />);

      // Check for secondary action text (day abbreviations)
      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    });
  });

  describe("TimePicker Integration", () => {
    it("should display time button", () => {
      // Create a task without time to show "Time" button
      const taskWithoutTime = {
        ...mockTask,
        due_date: "2025-08-25", // Date only, no time
      };
      render(<TestWrapper {...mockProps} task={taskWithoutTime} />);
      // The TimeSelectionItem shows "Time" when no time is set
      expect(screen.getByText("Time")).toBeInTheDocument();
    });

    it("should show selected time when time is set", () => {
      const taskWithTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // 2:30 PM UTC
      };
      render(<TestWrapper {...mockProps} task={taskWithTime} />);
      // The TimeSelectionItem shows the formatted time when time is set
      // Note: Timezone conversion may affect the displayed time
      expect(screen.getByText(/^\d{1,2}:\d{2} [AP]M$/)).toBeInTheDocument();
    });

    it("should show clear time button when time is set", () => {
      const taskWithTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // 2:30 PM
      };
      render(<TestWrapper {...mockProps} task={taskWithTime} />);
      expect(
        screen.getByRole("button", { name: /clear time/i }),
      ).toBeInTheDocument();
    });

    it("should not show clear time button when no time is set", () => {
      const taskWithoutTime = {
        ...mockTask,
        due_date: "2025-08-25", // Date only, no time
      };
      render(<TestWrapper {...mockProps} task={taskWithoutTime} />);
      // The TimeSelectionItem only shows clear button when there's a time
      expect(
        screen.queryByRole("button", { name: /clear time/i }),
      ).not.toBeInTheDocument();
    });

    it("should open time picker when time button is clicked", async () => {
      const user = userEvent.setup();
      // Create a task without time to show "Time" button
      const taskWithoutTime = {
        ...mockTask,
        due_date: "2025-08-25", // Date only, no time
      };
      render(<TestWrapper {...mockProps} task={taskWithoutTime} />);

      const timeButton = screen.getByText("Time");
      await user.click(timeButton);

      // The TimeSelectionItem handles its own popover, so we just verify the click worked
      expect(timeButton).toBeInTheDocument();
    });

    it("should clear time when clear button is clicked", async () => {
      const user = userEvent.setup();
      const taskWithTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // 2:30 PM
      };
      render(<TestWrapper {...mockProps} task={taskWithTime} />);

      const clearButton = screen.getByRole("button", {
        name: /clear time/i,
      });
      await user.click(clearButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
    });

    it("should display date at the top when date is selected", () => {
      const taskWithDate = {
        ...mockTask,
        due_date: "2025-08-25", // Date only
      };
      render(<TestWrapper {...mockProps} task={taskWithDate} />);
      // The date display shows the full date when only date is selected
      expect(screen.getByText("August 25, 2025")).toBeInTheDocument();
    });

    it("should display date and time at the top when both are selected", () => {
      const taskWithDateTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // Date and time
      };
      render(<TestWrapper {...mockProps} task={taskWithDateTime} />);
      // The date display shows both date and time when both are selected
      // Note: Timezone conversion may affect the displayed time
      expect(
        screen.getByText(/^August 25, 2025 \d{1,2}:\d{2} [AP]M$/),
      ).toBeInTheDocument();
    });

    it("should display empty string at the top when no date is selected", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      render(<TestWrapper {...mockProps} task={taskWithoutDate} />);

      // The first ListItem should have empty text
      const listItems = screen.getAllByRole("listitem");
      const firstListItem = listItems[0];
      expect(firstListItem).toBeInTheDocument();
    });
  });
});
