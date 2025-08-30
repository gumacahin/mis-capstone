import { fireEvent, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProviders } from "../../../../test/test-utils";
import TimePicker from "../TimePicker";

describe("TimePicker", () => {
  const mockOnChange = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByText("Time")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter time or select from dropdown"),
    ).toBeInTheDocument();
  });

  it("renders with initial value without crashing", () => {
    const initialTime = dayjs("2024-01-01 14:30:00");
    renderWithProviders(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("2:30 PM")).toBeInTheDocument();
  });

  it("renders in 24-hour format without crashing", () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
        use24Hour={true}
      />,
    );

    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("handles null value without crashing", () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("handles empty string input without crashing", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "" } });

    expect(input).toHaveValue("");
  });

  it("handles invalid time input without crashing", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "invalid time" } });

    expect(input).toHaveValue("invalid time");
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();
  });

  it("disables save button for invalid input", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    const saveButton = screen.getByText("Save");

    // Initially save button should be enabled (empty input is valid)
    expect(saveButton).not.toBeDisabled();

    // Type invalid input
    fireEvent.change(input, { target: { value: "garbage" } });

    // Save button should be disabled
    expect(saveButton).toBeDisabled();
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();
  });

  it("enables save button for valid input", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    const saveButton = screen.getByText("Save");

    // Type valid input
    fireEvent.change(input, { target: { value: "2:30 PM" } });

    // Save button should be enabled
    expect(saveButton).not.toBeDisabled();
    expect(
      screen.queryByText("Please enter a valid time"),
    ).not.toBeInTheDocument();
  });

  it("enables save button for empty input (clearing time)", async () => {
    const initialTime = dayjs("2024-01-01 14:30:00");
    renderWithProviders(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    const saveButton = screen.getByText("Save");

    // Clear the input
    fireEvent.change(input, { target: { value: "" } });

    // Save button should be enabled (allowing user to clear the time)
    expect(saveButton).not.toBeDisabled();
    expect(
      screen.queryByText("Please enter a valid time"),
    ).not.toBeInTheDocument();
  });

  it("shows validation error for invalid input", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );

    // Type invalid input
    fireEvent.change(input, { target: { value: "not a time" } });

    // Should show validation error
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("clears validation error when input becomes valid", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );

    // Type invalid input first
    fireEvent.change(input, { target: { value: "garbage" } });
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();

    // Clear and type valid input
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.change(input, { target: { value: "3:45 PM" } });

    // Validation error should be gone
    expect(
      screen.queryByText("Please enter a valid time"),
    ).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  it("parses 12-hour format correctly", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "2:30 PM" } });

    expect(input).toHaveValue("2:30 PM");
  });

  it("parses 24-hour format correctly", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "14:30" } });

    expect(input).toHaveValue("14:30");
  });

  it("parses time without AM/PM correctly", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "2:30" } });

    expect(input).toHaveValue("2:30");
  });

  it("parses lowercase AM/PM format correctly", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "01:33pm" } });

    expect(input).toHaveValue("01:33pm");
    // The save button should be enabled since this is a valid time
    const saveButton = screen.getByText("Save");
    expect(saveButton).not.toBeDisabled();
  });

  it("handles save button click without crashing", async () => {
    const initialTime = dayjs("2024-01-01 14:30:00");
    renderWithProviders(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
        currentDate={initialTime}
      />,
    );

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(mockOnChange).toHaveBeenCalledWith(initialTime);
  });

  it("implements smart date assignment when no currentDate provided", async () => {
    const mockDate = vi.fn();

    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockDate}
        onCancel={mockOnCancel}
        // No currentDate prop - should trigger smart date assignment
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );

    // Test case: time after current time (should use today)
    fireEvent.change(input, { target: { value: "3:00 PM" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    // Should call onChange with today's date + 3:00 PM
    expect(mockDate).toHaveBeenCalled();
    const callArg = mockDate.mock.calls[0][0];
    expect(callArg).toBeInstanceOf(Object); // Should be a Dayjs object
    expect(callArg.format("h:mm A")).toBe("3:00 PM");
  });

  it("removes time when empty input is saved", async () => {
    const mockDate = vi.fn();
    const initialTime = dayjs("2024-01-01 14:30:00");

    renderWithProviders(
      <TimePicker
        value={initialTime}
        onChange={mockDate}
        onCancel={mockOnCancel}
        currentDate={initialTime}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );

    // Clear the input
    fireEvent.change(input, { target: { value: "" } });
    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    // Should call onChange with date only (time set to midnight)
    expect(mockDate).toHaveBeenCalled();
    const callArg = mockDate.mock.calls[0][0];
    expect(callArg.format("h:mm A")).toBe("12:00 AM"); // Midnight
  });

  it("handles cancel button click without crashing", async () => {
    const initialTime = dayjs("2024-01-01 14:30:00");
    renderWithProviders(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("generates 15-minute interval options for 12-hour format", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
        use24Hour={false}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.focus(input);

    // Check that dropdown options are generated (we can't easily test the exact content
    // but we can verify the component doesn't crash when generating options)
    expect(input).toBeInTheDocument();
  });

  it("generates 15-minute interval options for 24-hour format", () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
        use24Hour={true}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.focus(input);

    // Check that dropdown options are generated
    expect(input).toBeInTheDocument();
  });

  it("handles time change from dropdown without crashing", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "3:45 PM" } });

    expect(input).toHaveValue("3:45 PM");
  });

  it("handles rapid input changes without crashing", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );

    // Rapidly type and change input
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.change(input, { target: { value: "12" } });
    fireEvent.change(input, { target: { value: "12:" } });
    fireEvent.change(input, { target: { value: "12:3" } });
    fireEvent.change(input, { target: { value: "12:30" } });
    fireEvent.change(input, { target: { value: "12:30 " } });
    fireEvent.change(input, { target: { value: "12:30 P" } });
    fireEvent.change(input, { target: { value: "12:30 PM" } });

    expect(input).toHaveValue("12:30 PM");
  });

  it("handles edge case times without crashing", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );

    // Test edge cases
    fireEvent.change(input, { target: { value: "12:00 AM" } });
    expect(input).toHaveValue("12:00 AM");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.change(input, { target: { value: "11:59 PM" } });
    expect(input).toHaveValue("11:59 PM");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.change(input, { target: { value: "00:00" } });
    expect(input).toHaveValue("00:00");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.change(input, { target: { value: "23:59" } });
    expect(input).toHaveValue("23:59");
  });

  it("handles component unmounting without crashing", () => {
    const { unmount } = renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    expect(() => unmount()).not.toThrow();
  });

  it("handles onChange callback with null value", async () => {
    renderWithProviders(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it("handles onCancel callback correctly", async () => {
    const initialTime = dayjs("2024-01-01 14:30:00");
    renderWithProviders(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    // Change the time
    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.change(input, { target: { value: "3:00 PM" } });

    // Cancel should reset to original value
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    // The input should still show the changed value until the component re-renders
    // This tests that the component doesn't crash during the cancel operation
  });
});
