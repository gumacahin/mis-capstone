import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import DatePicker from "../modules/shared/components/DatePicker";
import type { TaskFormFields } from "../modules/shared/types/common";
import { render, screen } from "../test/test-utils";

// Mock component that uses the DatePicker
const TestWrapper = ({
  rrule = null,
  dtstart = null,
}: {
  rrule?: string | null;
  dtstart?: string | null;
}) => {
  const methods = useForm<TaskFormFields>({
    defaultValues: {
      dtstart,
      rrule,
    },
  });

  return (
    <FormProvider {...methods}>
      <DatePicker data-testid="date-picker" />
    </FormProvider>
  );
};

describe("DatePicker Component", () => {
  it("renders date picker button", () => {
    render(<TestWrapper />);
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
  });

  it("renders with correct button text", () => {
    render(<TestWrapper />);
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<TestWrapper />);
    const button = screen.getByLabelText("Set due date");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Set due date");
  });

  it("handles null rrule without throwing error", () => {
    expect(() => {
      render(<TestWrapper rrule={null} />);
    }).not.toThrow();

    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("handles undefined rrule without throwing error", () => {
    expect(() => {
      render(<TestWrapper rrule={undefined} />);
    }).not.toThrow();

    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
  });

  it("does not show repeat icon when rrule is null", () => {
    render(<TestWrapper rrule={null} />);

    const button = screen.getByLabelText("Set due date");
    // The repeat icon should not be present when rrule is null
    expect(
      button.querySelector('[data-testid="RepeatIcon"]'),
    ).not.toBeInTheDocument();
  });

  it("does not show repeat icon when rrule contains COUNT=1", () => {
    render(<TestWrapper rrule="FREQ=DAILY;COUNT=1" />);

    const button = screen.getByLabelText("Set due date");
    // The repeat icon should not be present for one-time tasks
    expect(
      button.querySelector('[data-testid="RepeatIcon"]'),
    ).not.toBeInTheDocument();
  });

  it("shows repeat icon when rrule is a repeating rule", () => {
    render(<TestWrapper rrule="FREQ=DAILY;COUNT=5" />);

    const button = screen.getByLabelText("Set due date");
    // The repeat icon should be present for repeating tasks
    expect(
      button.querySelector('[data-testid="RepeatIcon"]'),
    ).toBeInTheDocument();
  });
});
