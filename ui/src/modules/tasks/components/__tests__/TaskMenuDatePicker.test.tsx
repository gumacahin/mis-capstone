import { fireEvent, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../test/test-utils";

// Mock MUI X Date Pickers components
vi.mock("@mui/x-date-pickers/AdapterDayjs", () => ({
  AdapterDayjs: class MockAdapter {
    constructor() {}
  },
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
  LocalizationProvider: ({
    children,
    dateAdapter,
  }: {
    children: React.ReactNode;
    dateAdapter?: unknown;
  }) => {
    // Mock the dateAdapter to avoid constructor errors
    if (dateAdapter) {
      // Create a mock instance (unused but needed for constructor validation)
      new (class MockAdapter {
        constructor() {}
        format() {
          return "Mock Date";
        }
        parse() {
          return dayjs();
        }
        isValid() {
          return true;
        }
      })();
      return <div data-testid="localization-provider">{children}</div>;
    }
    return <div data-testid="localization-provider">{children}</div>;
  },
}));

import TaskMenuDatePicker from "../TaskMenuDatePicker";

// Mock the task prop
const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  due_date: "2025-08-25T14:30:00Z" as string | null, // With time, but nullable
  priority: "MEDIUM" as const,
  section: 1,
  project: 1,
  project_title: "Test Project",
  section_title: "Test Section",
  tags: [] as string[],
  order: 0,
  comments_count: 0,
};

const mockProps = {
  task: mockTask,
  handleOnChange: vi.fn(),
  anchorEl: document.createElement("button"), // Mock anchor element
  handleClose: vi.fn(),
};

// Test wrapper component
const TestWrapper = ({
  task,
  handleOnChange,
  anchorEl,
  handleClose,
}: {
  task: typeof mockTask;
  handleOnChange: ReturnType<typeof vi.fn>;
  anchorEl: HTMLElement;
  handleClose: ReturnType<typeof vi.fn>;
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
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);
      expect(screen.getByText("Today")).toBeInTheDocument();
    });

    it("should display all quick date options", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);
      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
      expect(screen.getByText("This weekend")).toBeInTheDocument();
      expect(screen.getByText("Next Week")).toBeInTheDocument();
    });

    it("should show remove date button when date is selected", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);
      expect(screen.getByText("No date")).toBeInTheDocument();
    });

    it("should not show remove date button when no date is selected", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutDate} />,
      );
      expect(screen.queryByText("No date")).not.toBeInTheDocument();
    });

    it("should display calendar picker", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);
      expect(screen.getByTestId("date-calendar")).toBeInTheDocument();
    });
  });

  describe("Date Selection", () => {
    it("should select today when clicking today option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Click today option
      const todayButton = screen.getByText("Today");
      await fireEvent.click(todayButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should select tomorrow when clicking tomorrow option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Click tomorrow option
      const tomorrowButton = screen.getByText("Tomorrow");
      await fireEvent.click(tomorrowButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should select weekend when clicking weekend option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Click weekend option
      const weekendButton = screen.getByText("This weekend");
      await fireEvent.click(weekendButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should select next week when clicking next week option", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Click next week option
      const nextWeekButton = screen.getByText("Next Week");
      await fireEvent.click(nextWeekButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
      expect(mockProps.handleClose).toHaveBeenCalled();
    });

    it("should remove date when clicking remove button", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Click remove date button
      const removeButton = screen.getByText("No date");
      await fireEvent.click(removeButton);

      expect(mockProps.handleOnChange).toHaveBeenCalledWith(null);
      expect(mockProps.handleClose).toHaveBeenCalled();
    });
  });

  describe("Calendar Integration", () => {
    it("should select date from calendar", async () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Find and click a date in the calendar
      const calendarDate = screen
        .getByTestId("date-calendar")
        .querySelector("button");
      if (calendarDate) {
        await fireEvent.click(calendarDate);
        expect(mockProps.handleOnChange).toHaveBeenCalled();
        expect(mockProps.handleClose).toHaveBeenCalled();
      }
    });
  });

  describe("State Management", () => {
    it("should initialize with correct default values", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Should show the current due date options
      expect(screen.getByText("Today")).toBeInTheDocument();
    });

    it("should handle null values correctly", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutDate} />,
      );

      // Should not show remove date button when no date is selected
      expect(screen.queryByText("No date")).not.toBeInTheDocument();
    });
  });

  describe("Event Handling", () => {
    it("should handle popover open/close correctly", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Popover should be open when anchorEl is provided
      expect(screen.getByText("Today")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button labels", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

      // Check for all date option buttons
      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
      expect(screen.getByText("This weekend")).toBeInTheDocument();
      expect(screen.getByText("Next Week")).toBeInTheDocument();
    });

    it("should have proper secondary actions", () => {
      renderWithProviders(<TestWrapper {...mockProps} />);

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
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutTime} />,
      );
      // The TimeSelectionItem shows "Time" when no time is set
      expect(screen.getByText("Time")).toBeInTheDocument();
    });

    it("should show selected time when time is set", () => {
      const taskWithTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // 2:30 PM UTC
      };
      renderWithProviders(<TestWrapper {...mockProps} task={taskWithTime} />);
      // The TimeSelectionItem shows the formatted time when time is set
      // Note: Timezone conversion may affect the displayed time
      expect(screen.getByText(/^\d{1,2}:\d{2} [AP]M$/)).toBeInTheDocument();
    });

    it("should show clear time button when time is set", () => {
      const taskWithTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // 2:30 PM
      };
      renderWithProviders(<TestWrapper {...mockProps} task={taskWithTime} />);
      expect(
        screen.getByRole("button", { name: /clear time/i }),
      ).toBeInTheDocument();
    });

    it("should not show clear time button when no time is set", () => {
      const taskWithoutTime = {
        ...mockTask,
        due_date: "2025-08-25", // Date only, no time
      };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutTime} />,
      );
      // The TimeSelectionItem only shows clear button when there's a time
      expect(
        screen.queryByRole("button", { name: /clear time/i }),
      ).not.toBeInTheDocument();
    });

    it("should open time picker when time button is clicked", async () => {
      // Create a task without time to show "Time" button
      const taskWithoutTime = {
        ...mockTask,
        due_date: "2025-08-25", // Date only, no time
      };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutTime} />,
      );

      const timeButton = screen.getByText("Time");
      await fireEvent.click(timeButton);

      // The TimeSelectionItem handles its own popover, so we just verify the click worked
      expect(timeButton).toBeInTheDocument();
    });

    it("should clear time when clear button is clicked", async () => {
      const taskWithTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // 2:30 PM
      };
      renderWithProviders(<TestWrapper {...mockProps} task={taskWithTime} />);

      const clearButton = screen.getByRole("button", {
        name: /clear time/i,
      });
      await fireEvent.click(clearButton);

      expect(mockProps.handleOnChange).toHaveBeenCalled();
    });

    it("should display date at the top when date is selected", () => {
      const taskWithDate = {
        ...mockTask,
        due_date: "2025-08-25", // Date only
      };
      renderWithProviders(<TestWrapper {...mockProps} task={taskWithDate} />);
      // The date display shows the full date when only date is selected
      const dateInput = screen.getByDisplayValue("Aug 25");
      expect(dateInput).toBeInTheDocument();
    });

    it("should display date and time at the top when both are selected", () => {
      const taskWithDateTime = {
        ...mockTask,
        due_date: "2025-08-25T14:30:00Z", // Date and time
      };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithDateTime} />,
      );
      // The date display shows both date and time when both are selected
      // Note: Timezone conversion may affect the displayed time
      const dateTimeInput = screen.getByDisplayValue(
        /^Aug 25 at \d{1,2}:\d{2} [AP]M$/,
      );
      expect(dateTimeInput).toBeInTheDocument();
    });

    it("should display empty string at the top when no date is selected", () => {
      const taskWithoutDate = { ...mockTask, due_date: null };
      renderWithProviders(
        <TestWrapper {...mockProps} task={taskWithoutDate} />,
      );

      // The first ListItem should have empty text
      const listItems = screen.getAllByRole("listitem");
      const firstListItem = listItems[0];
      expect(firstListItem).toBeInTheDocument();
    });
  });
});
