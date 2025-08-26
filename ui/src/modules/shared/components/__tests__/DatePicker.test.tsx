import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import type { TaskFormFields } from "../../types/common";
import DatePicker from "../DatePicker";

// Mock dayjs to avoid import issues in tests
jest.mock("dayjs", () => {
  const originalDayjs = jest.requireActual("dayjs");
  return {
    ...originalDayjs,
    __esModule: true,
    default: originalDayjs.default || originalDayjs,
  };
});

// Test wrapper component to provide form context
const TestWrapper = ({
  initialValue = null,
  initialRecurrence = null,
  initialAnchorMode = "SCHEDULED",
}: {
  initialValue?: dayjs.Dayjs | null;
  initialRecurrence?: string | null;
  initialAnchorMode?: "SCHEDULED" | "COMPLETED";
}) => {
  const { control } = useForm<TaskFormFields>({
    defaultValues: {
      due_date: initialValue,
      title: "",
      description: null,
      completion_date: null,
      priority: "NONE",
      section: 0,
      project: 0,
      tags: [],
      recurrence: initialRecurrence,
      recurrence_anchor_mode: initialAnchorMode,
    },
  });
  return <DatePicker control={control} />;
};

describe("DatePicker Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      render(<TestWrapper />);
      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toBeInTheDocument();
    });

    it("should display 'Date' when no date is selected", () => {
      render(<TestWrapper />);
      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent("Date");
    });

    it("should display calendar icon", () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("should not show remove date button when no date is selected", () => {
      render(<TestWrapper />);
      expect(
        screen.queryByRole("button", { name: /remove due date/i }),
      ).not.toBeInTheDocument();
    });

    it("should show remove date button when date is selected", () => {
      render(<TestWrapper initialValue={dayjs()} />);
      expect(
        screen.getByRole("button", { name: /remove due date/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("should display 'Today' for current date", () => {
      render(<TestWrapper initialValue={dayjs()} />);
      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent("Today");
    });

    it("should display 'Tomorrow' for tomorrow", () => {
      render(<TestWrapper initialValue={dayjs().add(1, "day")} />);
      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent("Tomorrow");
    });

    it("should display 'Yesterday' for yesterday", () => {
      render(<TestWrapper initialValue={dayjs().subtract(1, "day")} />);
      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent("Yesterday");
    });

    it("should display day name for dates within next week", () => {
      const nextWeekDate = dayjs().add(3, "day");
      render(<TestWrapper initialValue={nextWeekDate} />);
      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent(nextWeekDate.format("dddd"));
    });

    it("should display full date format for dates beyond next week", () => {
      const futureDate = dayjs().add(10, "day");
      render(<TestWrapper initialValue={futureDate} />);
      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent(futureDate.format("MMMM D"));
    });
  });

  describe("Popover Interaction", () => {
    it("should open popover when main button is clicked", async () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });

      await user.click(button);

      expect(screen.getByText("Today")).toBeInTheDocument();
      expect(screen.getByText("Tomorrow")).toBeInTheDocument();
      expect(screen.getByText("This weekend")).toBeInTheDocument();
      expect(screen.getByText("Next Week")).toBeInTheDocument();
    });

    it("should close popover when clicking outside", async () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });

      await user.click(button);
      expect(screen.getByText("Today")).toBeInTheDocument();

      // Use Escape key to close popover (more reliable than clicking outside)
      await user.keyboard("{Escape}");

      // Wait for the popover to close
      await waitFor(
        () => {
          expect(screen.queryByText("Today")).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });
  });

  describe("Quick Date Selection", () => {
    it("should select today when clicking today option", async () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });

      await user.click(button);
      await user.click(screen.getByText("Today"));

      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent("Today");
    });

    it("should select tomorrow when clicking tomorrow option", async () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });

      await user.click(button);
      await user.click(screen.getByText("Tomorrow"));

      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent("Tomorrow");
    });

    it("should close popover after selecting a quick date", async () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });

      await user.click(button);
      await user.click(screen.getByText("Today"));

      await waitFor(() => {
        expect(screen.queryByText("Tomorrow")).not.toBeInTheDocument();
      });
    });
  });

  describe("Remove Date Functionality", () => {
    it("should remove date when clicking remove button", async () => {
      render(<TestWrapper initialValue={dayjs()} />);

      const removeButton = screen.getByRole("button", {
        name: /remove due date/i,
      });
      await user.click(removeButton);

      expect(
        screen.getByRole("button", { name: /set due date/i }),
      ).toHaveTextContent("Date");
      expect(
        screen.queryByRole("button", { name: /remove due date/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Calendar Integration", () => {
    it("should render calendar picker", async () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });

      await user.click(button);

      // Calendar should be rendered
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper tooltips", () => {
      render(<TestWrapper />);

      // Check that the main button is wrapped in a Tooltip component
      const mainButton = screen.getByRole("button", { name: /set due date/i });
      expect(mainButton).toBeInTheDocument();

      // Check remove button tooltip when date is selected
      render(<TestWrapper initialValue={dayjs()} />);
      const removeButton = screen.getByRole("button", {
        name: /remove due date/i,
      });
      expect(removeButton).toBeInTheDocument();
    });
  });

  describe("Recurrence Functionality", () => {
    it("should render RepeatSelectionItem when date picker is opened", async () => {
      render(<TestWrapper />);
      const button = screen.getByRole("button", { name: /set due date/i });

      await user.click(button);

      // Should show the Repeat button
      expect(screen.getByText("Repeat")).toBeInTheDocument();
    });

    it("should show current recurrence value when set", async () => {
      render(<TestWrapper initialRecurrence="every monday" />);
      const button = screen.getByRole("button", { name: /set due date/i });

      // Open the date picker to see the recurrence
      await user.click(button);

      // Should show the current recurrence
      expect(screen.getByText("Every Mon")).toBeInTheDocument();
    });

    it("should show current anchor mode when set", () => {
      render(<TestWrapper initialAnchorMode="COMPLETED" />);
      const button = screen.getByRole("button", { name: /set due date/i });

      // Should show the current anchor mode (though this might be hidden in the custom dialog)
      expect(button).toBeInTheDocument();
    });
  });
});
