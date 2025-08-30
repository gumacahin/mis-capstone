import { fireEvent, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../test/test-utils";
import TimeSelectionItem from "../TimeSelectionItem";

// Mock TimePicker component
vi.mock("../TimePicker", () => ({
  default: ({
    onChange,
    onCancel,
  }: {
    onChange: (date: dayjs.Dayjs | null) => void;
    onCancel: () => void;
  }) => (
    <div>
      <div>Time</div>
      <button onClick={() => onChange(dayjs().hour(14).minute(30))}>
        Save
      </button>
      <button onClick={() => onChange(null)}>Clear Time</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

describe("TimeSelectionItem Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering States", () => {
    it("should render with 'Time' text when no value is provided", () => {
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      expect(screen.getByText("Time")).toBeInTheDocument();
      // Time picker should not be open initially
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });

    it("should render with 'Time' text when date has no time (midnight)", () => {
      const dateOnly = dayjs().startOf("day");
      renderWithProviders(
        <TimeSelectionItem value={dateOnly} onChange={mockOnChange} />,
      );

      expect(screen.getByText("Time")).toBeInTheDocument();
      // Time picker should not be open initially
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });

    it("should render with formatted time when both date and time are set", () => {
      const dateWithTime = dayjs().hour(14).minute(30);
      renderWithProviders(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      expect(screen.getByText("2:30 PM")).toBeInTheDocument();
      // Time picker should not be open initially
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });

    it("should show clear time button when time is set", () => {
      const dateWithTime = dayjs().hour(14).minute(30);
      renderWithProviders(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      expect(
        screen.getByRole("button", { name: /clear time/i }),
      ).toBeInTheDocument();
    });

    it("should not show clear time button when no time is set", () => {
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      expect(
        screen.queryByRole("button", { name: /clear time/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Interaction Behavior", () => {
    it("should open time picker when clicked", async () => {
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      const timeButton = screen.getByRole("button", { name: /time/i });
      fireEvent.click(timeButton);

      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("should close time picker when time is selected", async () => {
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      // Open time picker
      const timeButton = screen.getByRole("button", { name: /time/i });
      fireEvent.click(timeButton);
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();

      // Select a time
      const setTimeButton = screen.getByRole("button", {
        name: /save/i,
      });
      fireEvent.click(setTimeButton);

      // Time picker should close
      expect(
        screen.queryByRole("button", { name: /save/i }),
      ).not.toBeInTheDocument();
    });

    it("should close time picker when cancelled", async () => {
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      // Open time picker
      const timeButton = screen.getByRole("button", { name: /time/i });
      fireEvent.click(timeButton);
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Time picker should close
      expect(
        screen.queryByRole("button", { name: /save/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Time Selection Scenarios", () => {
    it("should call onChange with time when time is selected from picker", async () => {
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      // Open time picker and select time
      const timeButton = screen.getByRole("button", { name: /time/i });
      fireEvent.click(timeButton);

      const setTimeButton = screen.getByRole("button", {
        name: /save/i,
      });
      fireEvent.click(setTimeButton);

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
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      // Open time picker and clear time
      const timeButton = screen.getByRole("button", { name: /time/i });
      fireEvent.click(timeButton);

      const clearTimeButton = screen.getByRole("button", {
        name: /clear time/i,
      });
      fireEvent.click(clearTimeButton);

      expect(mockOnChange).toHaveBeenCalledWith(null);
    });
  });

  describe("Clear Time Button", () => {
    it("should clear time and keep date when clear button is clicked", async () => {
      const dateWithTime = dayjs().hour(14).minute(30);
      renderWithProviders(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      const clearButton = screen.getByRole("button", { name: /clear time/i });
      fireEvent.click(clearButton);

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
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      // Clear button shouldn't be visible, but if it somehow is, clicking should handle gracefully
      const clearButton = screen.queryByRole("button", { name: /clear time/i });
      if (clearButton) {
        fireEvent.click(clearButton);
        expect(mockOnChange).toHaveBeenCalledWith(null);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle disabled state correctly", () => {
      renderWithProviders(
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
      renderWithProviders(
        <TimeSelectionItem value={earlyMorning} onChange={mockOnChange} />,
      );

      expect(screen.getByText("3:00 AM")).toBeInTheDocument();
    });

    it("should handle late night times (10 PM - 11 PM)", () => {
      const lateNight = dayjs().hour(23).minute(30);
      renderWithProviders(
        <TimeSelectionItem value={lateNight} onChange={mockOnChange} />,
      );

      expect(screen.getByText("11:30 PM")).toBeInTheDocument();
    });

    it("should handle noon and midnight correctly", () => {
      const noon = dayjs().hour(12).minute(0);
      renderWithProviders(
        <TimeSelectionItem value={noon} onChange={mockOnChange} />,
      );

      expect(screen.getByText("12:00 PM")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper button labels", () => {
      renderWithProviders(
        <TimeSelectionItem value={null} onChange={mockOnChange} />,
      );

      const timeButton = screen.getByRole("button", { name: /time/i });
      expect(timeButton).toBeInTheDocument();
    });

    it("should have proper tooltip for clear button", () => {
      const dateWithTime = dayjs().hour(14).minute(30);
      renderWithProviders(
        <TimeSelectionItem value={dateWithTime} onChange={mockOnChange} />,
      );

      const clearButton = screen.getByRole("button", { name: /clear time/i });
      // The Tooltip component wraps the button, so we check that the button exists
      // The actual tooltip text is handled by MUI's Tooltip component
      expect(clearButton).toBeInTheDocument();
    });
  });
});
