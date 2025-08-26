import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

import { SmartDateTimeField } from "../SmartDateTimeField";

// Mock the dateUtils module to avoid dayjs complexity
jest.mock("../dateUtils", () => ({
  formatForDisplay: jest.fn((date, recurrence) => {
    if (!date && !recurrence) {
      return "No due date set";
    }

    let result = "";
    if (date) {
      if (date.hour === 0 && date.minute === 0) {
        result = "August 27, 2025";
      } else {
        result = "August 27, 2025 2:30 PM";
      }
    }

    if (recurrence) {
      if (result) {
        result += ` (${recurrence})`;
      } else {
        result = recurrence;
      }
    }

    return result;
  }),

  formatForEditing: jest.fn((date, recurrence) => {
    if (!date && !recurrence) {
      return "";
    }

    if (recurrence) {
      return recurrence;
    }

    if (date) {
      if (date.hour === 0 && date.minute === 0) {
        return "August 27, 2025";
      } else {
        return "August 27, 2025 2:30 PM";
      }
    }

    return "";
  }),

  parseNaturalLanguage: jest.fn((input) => {
    const normalized = input.toLowerCase().trim();

    if (!normalized) {
      return { date: null, recurrence: null, anchorMode: "SCHEDULED" };
    }

    // Check anchor mode indicators first
    if (
      normalized.includes("from completion") ||
      normalized.includes("when completed")
    ) {
      return {
        date: {
          hour: 9,
          minute: 0,
          format: () => "9:00 AM",
        } as unknown as dayjs.Dayjs,
        recurrence: null,
        anchorMode: "COMPLETED",
      };
    }

    if (
      normalized.includes("from schedule") ||
      normalized.includes("when scheduled")
    ) {
      return {
        date: {
          hour: 9,
          minute: 0,
          format: () => "9:00 AM",
        } as unknown as dayjs.Dayjs,
        recurrence: null,
        anchorMode: "SCHEDULED",
      };
    }

    if (normalized.includes("every")) {
      // Check if this also has anchor mode indicators
      if (
        normalized.includes("from completion") ||
        normalized.includes("when completed")
      ) {
        return {
          date: null,
          recurrence: normalized,
          anchorMode: "COMPLETED",
        };
      }

      return {
        date: null,
        recurrence: normalized,
        anchorMode: "SCHEDULED",
      };
    }

    // For invalid input, throw an error to simulate parsing failure
    if (normalized.includes("invalid")) {
      throw new Error("Invalid input");
    }

    // Default case - return a mock date
    return {
      date: {
        hour: 9,
        minute: 0,
        format: () => "9:00 AM",
      } as unknown as dayjs.Dayjs,
      recurrence: null,
      anchorMode: "SCHEDULED",
    };
  }),
}));

describe("SmartDateTimeField", () => {
  const mockOnChange = jest.fn();
  const mockOnRecurrenceChange = jest.fn();
  const mockOnAnchorModeChange = jest.fn();

  // Mock date objects for testing
  const mockDateOnly = { hour: 0, minute: 0 } as unknown as dayjs.Dayjs;
  const mockDateWithTime = { hour: 14, minute: 30 } as unknown as dayjs.Dayjs;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Input Field Behavior", () => {
    it("should render empty input when no value is provided", () => {
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("");
    });

    it("should render input with date value when date is provided", () => {
      render(
        <SmartDateTimeField
          value={mockDateOnly}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("August 27, 2025");
    });

    it("should render input with date and time when time is set", () => {
      render(
        <SmartDateTimeField
          value={mockDateWithTime}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("August 27, 2025 2:30 PM");
    });

    it("should render input with recurrence value when recurrence is set", () => {
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence="every monday"
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("every monday");
      expect(screen.getByText("Repeats")).toBeInTheDocument();
    });

    it("should render input with date and recurrence when both are set", () => {
      render(
        <SmartDateTimeField
          value={mockDateWithTime}
          onChange={mockOnChange}
          recurrence="every monday"
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("every monday");
      expect(screen.getByText("Repeats")).toBeInTheDocument();
    });

    it("should be enabled when not disabled", () => {
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).not.toBeDisabled();
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
          disabled={true}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });
  });

  describe("Input Interaction", () => {
    it("should allow typing in the input field", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "tomorrow");

      expect(input).toHaveValue("tomorrow");
    });

    it("should show preview when typing valid input", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "tomorrow");

      // The preview should show what was parsed
      expect(screen.getByText("✓ 9:00 AM")).toBeInTheDocument();
    });

    it("should show error when typing invalid input", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "invalid");

      // The error should show
      expect(screen.getByText("Invalid input")).toBeInTheDocument();
    });

    it("should save changes on Enter key", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "tomorrow");
      await user.keyboard("{Enter}");

      expect(mockOnChange).toHaveBeenCalledWith(
        { hour: 9, minute: 0, format: () => "9:00 AM" },
        null,
      );
    });

    it("should save changes on blur", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "tomorrow");
      input.blur();

      // Wait for the blur handler to execute
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          { hour: 9, minute: 0, format: () => "9:00 AM" },
          null,
        );
      });
    });

    it("should clear value when input is emptied", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={mockDateOnly}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);

      expect(mockOnChange).toHaveBeenCalledWith(null, null);
    });
  });

  describe("Natural Language Parsing", () => {
    it("should parse 'tomorrow' correctly", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "tomorrow");

      expect(input).toHaveValue("tomorrow");
      expect(screen.getByText("✓ 9:00 AM")).toBeInTheDocument();
    });

    it("should parse 'every monday' correctly", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "every monday");

      expect(input).toHaveValue("every monday");
      expect(screen.getByText("✓ every monday")).toBeInTheDocument();
    });

    it("should parse 'sept 1 at 9am' correctly", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "sept 1 at 9am");

      expect(input).toHaveValue("sept 1 at 9am");
      expect(screen.getByText("✓ 9:00 AM")).toBeInTheDocument();
    });

    it("should show error for invalid input", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "invalid");

      expect(screen.getByText("Invalid input")).toBeInTheDocument();
    });
  });

  describe("Recurrence Handling", () => {
    it("should call onRecurrenceChange when recurrence is parsed", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
          onRecurrenceChange={mockOnRecurrenceChange}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "every monday");
      input.blur();

      await waitFor(() => {
        expect(mockOnRecurrenceChange).toHaveBeenCalledWith("every monday");
      });
    });

    it("should call onAnchorModeChange when anchor mode is parsed", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
          onAnchorModeChange={mockOnAnchorModeChange}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "from completion");
      input.blur();

      await waitFor(() => {
        expect(mockOnAnchorModeChange).toHaveBeenCalledWith("COMPLETED");
      });
    });
  });

  describe("Accessibility", () => {
    it("should not have placeholder text", () => {
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).not.toHaveAttribute("placeholder");
    });

    it("should show error state when there's an error", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.type(input, "invalid");

      expect(input).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty input gracefully", async () => {
      const user = userEvent.setup();
      render(
        <SmartDateTimeField
          value={mockDateOnly}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);

      expect(mockOnChange).toHaveBeenCalledWith(null, null);
    });

    it("should maintain consistent height", () => {
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
        />,
      );

      const input = screen.getByRole("textbox");
      const inputContainer = input.closest(".MuiInputBase-root");

      expect(inputContainer).toHaveStyle({ minHeight: "48px" });
    });

    it("should handle disabled state correctly", () => {
      render(
        <SmartDateTimeField
          value={null}
          onChange={mockOnChange}
          recurrence={null}
          disabled={true}
        />,
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute("aria-invalid", "false");
    });
  });
});
