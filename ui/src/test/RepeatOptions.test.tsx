import { FormProvider, useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import RepeatOptions from "../modules/shared/components/RepeatOptions";
import type { TaskFormFields } from "../modules/shared/types/common";
import { render, screen } from "../test/test-utils";

// Mock component that uses the RepeatOptions
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
      anchor_mode: null,
    },
  });

  return (
    <FormProvider {...methods}>
      <RepeatOptions />
    </FormProvider>
  );
};

describe("RepeatOptions Component", () => {
  it("renders repeat button with default text when rrule is null", () => {
    render(<TestWrapper rrule={null} />);
    expect(screen.getByText("Repeat")).toBeInTheDocument();
  });

  it("handles null rrule without throwing error", () => {
    expect(() => {
      render(<TestWrapper rrule={null} />);
    }).not.toThrow();

    expect(screen.getByText("Repeat")).toBeInTheDocument();
  });

  it("handles undefined rrule without throwing error", () => {
    expect(() => {
      render(<TestWrapper rrule={undefined} />);
    }).not.toThrow();

    expect(screen.getByText("Repeat")).toBeInTheDocument();
  });

  it("displays RRule text when rrule is provided", () => {
    render(<TestWrapper rrule="FREQ=DAILY;COUNT=5" />);

    // The RRule should be converted to human-readable text
    expect(screen.getByText("every day for 5 times")).toBeInTheDocument();
  });

  it("shows close icon when rrule is set", () => {
    render(<TestWrapper rrule="FREQ=DAILY;COUNT=5" />);

    // Should show the close icon for clearing the repeat
    const closeIcon = screen.getByTestId("CloseIcon");
    expect(closeIcon).toBeInTheDocument();
  });

  it("does not show close icon when rrule is null", () => {
    render(<TestWrapper rrule={null} />);

    // Should not show the close icon when no repeat is set
    expect(screen.queryByTestId("CloseIcon")).not.toBeInTheDocument();
  });
});
