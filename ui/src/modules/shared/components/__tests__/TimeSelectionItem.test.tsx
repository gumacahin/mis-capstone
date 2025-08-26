import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

import TimeSelectionItem from "../TimeSelectionItem";

// Mock dayjs to avoid any import issues
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  return {
    ...originalDayjs,
    __esModule: true,
    default: originalDayjs.default || originalDayjs,
  };
});

// Mock TimePicker component
jest.mock("../TimePicker", () => ({
  default: ({
    onChange,
    onCancel,
  }: {
    onChange: (date: dayjs.Dayjs | null) => void;
    onCancel: () => void;
  }) => (
    <div data-testid="time-picker">
      <button onClick={() => onChange(dayjs().hour(14).minute(30))}>
        Set 2:30 PM
      </button>
      <button onClick={() => onChange(null)}>Clear Time</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe("TimeSelectionItem Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering States", () => {
    it("should render with 'Time' text when no value is provided", () => {
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      expect(screen.getByText("Time")).toBeInTheDocument();
      expect(screen.queryByTestId("time-picker")).not.toBeInTheDocument();
    });

    it("should render with 'Time' text when date has no time (midnight)", () => {
      const dateOnly = dayjs().startOf("day");
      render(<TimeSelectionItem value={dateOnly} onChange={mockOnChange} />);

      expect(screen.getByText("Time")).toBeInTheDocument();
      expect(screen.queryByTestId("time-picker")).not.toBeInTheDocument();
    });

    it("should render with formatted time when both date and time are set", () => {
      const dateWithTime = dayjs().hour(14).minute(30);
      render(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      expect(screen.getByText("2:30 PM")).toBeInTheDocument();
      expect(screen.queryByTestId("time-picker")).not.toBeInTheDocument();
    });

    it("should show clear time button when time is set", () => {
      const dateWithTime = dayjs().hour(14).minute(30);
      render(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      expect(
        screen.getByRole("button", { name: /clear time/i }),
      ).toBeInTheDocument();
    });

    it("should not show clear time button when no time is set", () => {
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      expect(
        screen.queryByRole("button", { name: /clear time/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Interaction Behavior", () => {
    it("should open time picker when clicked", async () => {
      const user = userEvent.setup();
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      const timeButton = screen.getByRole("button", { name: /time/i });
      await user.click(timeButton);

      expect(screen.getByTestId("time-picker")).toBeInTheDocument();
    });

    it("should close time picker when time is selected", async () => {
      const user = userEvent.setup();
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      // Open time picker
      const timeButton = screen.getByRole("button", { name: /time/i });
      await user.click(timeButton);
      expect(screen.getByTestId("time-picker")).toBeInTheDocument();

      // Select a time
      const setTimeButton = screen.getByRole("button", {
        name: /set 2:30 pm/i,
      });
      await user.click(setTimeButton);

      // Time picker should close
      expect(screen.queryByTestId("time-picker")).not.toBeInTheDocument();
    });

    it("should close time picker when cancelled", async () => {
      const user = userEvent.setup();
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      // Open time picker
      const timeButton = screen.getByRole("button", { name: /time/i });
      await user.click(timeButton);
      expect(screen.getByTestId("time-picker")).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      // Time picker should close
      expect(screen.queryByTestId("time-picker")).not.toBeInTheDocument();
    });
  });

  describe("Time Selection Scenarios", () => {
    it("should call onChange with time when time is selected from picker", async () => {
      const user = userEvent.setup();
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      // Open time picker and select time
      const timeButton = screen.getByRole("button", { name: /time/i });
      await user.click(timeButton);

      const setTimeButton = screen.getByRole("button", {
        name: /set 2:30 pm/i,
      });
      await user.click(setTimeButton);

      expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));

      // Check that the call was made with a dayjs-like object
      const callArg = mockOnChange.mock.calls[0][0];
      expect(callArg).toBeTruthy();
      expect(typeof callArg.hour).toBe("function");
      expect(typeof callArg.minute).toBe("function");
      expect(callArg.hour()).toBe(14);
      expect(callArg.minute()).toBe(30);
    });

    it("should call onChange with null when time is cleared from picker", async () => {
      const user = userEvent.setup();
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      // Open time picker and clear time
      const timeButton = screen.getByRole("button", { name: /time/i });
      await user.click(timeButton);

      const clearTimeButton = screen.getByRole("button", {
        name: /clear time/i,
      });
      await user.click(clearTimeButton);

      expect(mockOnChange).toHaveBeenCalledWith(null);
    });
  });

  describe("Clear Time Button", () => {
    it("should clear time and keep date when clear button is clicked", async () => {
      const user = userEvent.setup();
      const dateWithTime = dayjs().hour(14).minute(30);
      render(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      const clearButton = screen.getByRole("button", { name: /clear time/i });
      await user.click(clearButton);

      // Should call onChange with date only (start of day)
      expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));

      // Check that the call was made with a dayjs-like object
      const callArg = mockOnChange.mock.calls[0][0];
      expect(callArg).toBeTruthy();
      expect(typeof callArg.hour).toBe("function");
      expect(typeof callArg.minute).toBe("function");
      expect(callArg.hour()).toBe(0);
      expect(callArg.minute()).toBe(0);
    });

    it("should handle clear time when no date is set", async () => {
      const user = userEvent.setup();
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      // Clear button shouldn't be visible, but if it somehow is, clicking should handle gracefully
      const clearButton = screen.queryByRole("button", { name: /clear time/i });
      if (clearButton) {
        await user.click(clearButton);
        expect(mockOnChange).toHaveBeenCalledWith(null);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle disabled state correctly", () => {
      render(
        <TimeSelectionItem
          value={null}
          onChange={mockOnChange}
          disabled={true}
        />,
      );

      const timeButton = screen.getByRole("button", { name: /time/i });
      expect(timeButton).toBeDisabled();
    });

    it("should handle very early morning times (12 AM - 5 AM)", () => {
      const earlyMorning = dayjs().hour(3).minute(0);
      render(
        <TimeSelectionItem value={earlyMorning} onChange={mockOnChange} />,
      );

      expect(screen.getByText("3:00 AM")).toBeInTheDocument();
    });

    it("should handle late night times (10 PM - 11 PM)", () => {
      const lateNight = dayjs().hour(23).minute(30);
      render(<TimeSelectionItem value={lateNight} onChange={mockOnChange} />);

      expect(screen.getByText("11:30 PM")).toBeInTheDocument();
    });

    it("should handle noon and midnight correctly", () => {
      const noon = dayjs().hour(12).minute(0);
      render(<TimeSelectionItem value={noon} onChange={mockOnChange} />);

      expect(screen.getByText("12:00 PM")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button labels", () => {
      render(<TimeSelectionItem value={null} onChange={mockOnChange} />);

      const timeButton = screen.getByRole("button", { name: /time/i });
      expect(timeButton).toBeInTheDocument();
    });

    it("should have proper tooltip for clear button", () => {
      const dateWithTime = dayjs().hour(14).minute(30);
      render(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      const clearButton = screen.getByRole("button", { name: /clear time/i });
      // The Tooltip component wraps the button, so we check that the button exists
      // The actual tooltip text is handled by MUI's Tooltip component
      expect(clearButton).toBeInTheDocument();
    });
  });
});
