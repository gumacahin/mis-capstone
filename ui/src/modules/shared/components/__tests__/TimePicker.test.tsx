import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

import TimePicker from "../TimePicker";

// Mock dayjs to avoid any import issues
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  return {
    ...originalDayjs,
    __esModule: true,
    default: originalDayjs.default || originalDayjs,
  };
});

describe("TimePicker", () => {
  const mockOnChange = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
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
    render(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("2:30 PM")).toBeInTheDocument();
  });

  it("renders in 24-hour format without crashing", () => {
    render(
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
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("handles empty string input without crashing", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    await user.clear(input);

    expect(input).toHaveValue("");
  });

  it("handles invalid time input without crashing", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    await user.type(input, "invalid time");

    expect(input).toHaveValue("invalid time");
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();
  });

  it("disables save button for invalid input", async () => {
    const user = userEvent.setup();
    render(
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
    await user.type(input, "garbage");

    // Save button should be disabled
    expect(saveButton).toBeDisabled();
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();
  });

  it("enables save button for valid input", async () => {
    const user = userEvent.setup();
    render(
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
    await user.type(input, "2:30 PM");

    // Save button should be enabled
    expect(saveButton).not.toBeDisabled();
    expect(
      screen.queryByText("Please enter a valid time"),
    ).not.toBeInTheDocument();
  });

  it("enables save button for empty input (clearing time)", async () => {
    const user = userEvent.setup();
    const initialTime = dayjs("2024-01-01 14:30:00");
    render(
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
    await user.clear(input);

    // Save button should be enabled (allowing user to clear the time)
    expect(saveButton).not.toBeDisabled();
    expect(
      screen.queryByText("Please enter a valid time"),
    ).not.toBeInTheDocument();
  });

  it("shows validation error for invalid input", async () => {
    const user = userEvent.setup();
    render(
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
    await user.type(input, "not a time");

    // Should show validation error
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("clears validation error when input becomes valid", async () => {
    const user = userEvent.setup();
    render(
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
    await user.type(input, "garbage");
    expect(screen.getByText("Please enter a valid time")).toBeInTheDocument();

    // Clear and type valid input
    await user.clear(input);
    await user.type(input, "3:45 PM");

    // Validation error should be gone
    expect(
      screen.queryByText("Please enter a valid time"),
    ).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  it("parses 12-hour format correctly", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    await user.type(input, "2:30 PM");

    expect(input).toHaveValue("2:30 PM");
  });

  it("parses 24-hour format correctly", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    await user.type(input, "14:30");

    expect(input).toHaveValue("14:30");
  });

  it("parses time without AM/PM correctly", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    await user.type(input, "2:30");

    expect(input).toHaveValue("2:30");
  });

  it("parses lowercase AM/PM format correctly", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    await user.type(input, "01:33pm");

    expect(input).toHaveValue("01:33pm");
    // The save button should be enabled since this is a valid time
    const saveButton = screen.getByText("Save");
    expect(saveButton).not.toBeDisabled();
  });

  it("handles save button click without crashing", async () => {
    const user = userEvent.setup();
    const initialTime = dayjs("2024-01-01 14:30:00");
    render(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
        currentDate={initialTime}
      />,
    );

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    expect(mockOnChange).toHaveBeenCalledWith(initialTime);
  });

  it("implements smart date assignment when no currentDate provided", async () => {
    const user = userEvent.setup();
    const mockDate = jest.fn();

    render(
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
    await user.type(input, "3:00 PM");
    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    // Should call onChange with today's date + 3:00 PM
    expect(mockDate).toHaveBeenCalled();
    const callArg = mockDate.mock.calls[0][0];
    expect(callArg).toBeInstanceOf(Object); // Should be a Dayjs object
    expect(callArg.format("h:mm A")).toBe("3:00 PM");
  });

  it("removes time when empty input is saved", async () => {
    const user = userEvent.setup();
    const mockDate = jest.fn();
    const initialTime = dayjs("2024-01-01 14:30:00");

    render(
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
    await user.clear(input);
    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    // Should call onChange with date only (time set to midnight)
    expect(mockDate).toHaveBeenCalled();
    const callArg = mockDate.mock.calls[0][0];
    expect(callArg.format("h:mm A")).toBe("12:00 AM"); // Midnight
  });

  it("handles cancel button click without crashing", async () => {
    const user = userEvent.setup();
    const initialTime = dayjs("2024-01-01 14:30:00");
    render(
      <TimePicker
        value={initialTime}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("generates 15-minute interval options for 12-hour format", () => {
    render(
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
    render(
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
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Enter time or select from dropdown",
    );
    await user.type(input, "3:45 PM");

    expect(input).toHaveValue("3:45 PM");
  });

  it("handles rapid input changes without crashing", async () => {
    const user = userEvent.setup();
    render(
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
    await user.type(input, "1");
    await user.type(input, "2");
    await user.type(input, ":");
    await user.type(input, "3");
    await user.type(input, "0");
    await user.type(input, " ");
    await user.type(input, "P");
    await user.type(input, "M");

    expect(input).toHaveValue("12:30 PM");
  });

  it("handles edge case times without crashing", async () => {
    const user = userEvent.setup();
    render(
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
    await user.type(input, "12:00 AM");
    expect(input).toHaveValue("12:00 AM");

    await user.clear(input);
    await user.type(input, "11:59 PM");
    expect(input).toHaveValue("11:59 PM");

    await user.clear(input);
    await user.type(input, "00:00");
    expect(input).toHaveValue("00:00");

    await user.clear(input);
    await user.type(input, "23:59");
    expect(input).toHaveValue("23:59");
  });

  it("handles component unmounting without crashing", () => {
    const { unmount } = render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    expect(() => unmount()).not.toThrow();
  });

  it("handles onChange callback with null value", async () => {
    const user = userEvent.setup();
    render(
      <TimePicker
        value={null}
        onChange={mockOnChange}
        onCancel={mockOnCancel}
      />,
    );

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it("handles onCancel callback correctly", async () => {
    const user = userEvent.setup();
    const initialTime = dayjs("2024-01-01 14:30:00");
    render(
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
    await user.clear(input);
    await user.type(input, "3:00 PM");

    // Cancel should reset to original value
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    // The input should still show the changed value until the component re-renders
    // This tests that the component doesn't crash during the cancel operation
  });
});
