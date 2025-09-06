import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import DatePicker from "../modules/shared/components/DatePicker";
import type { TaskFormFields } from "../modules/shared/types/common";
import { render, screen } from "../test/test-utils";

// Mock component that uses the DatePicker
const TestWrapper = () => {
  const { control } = useForm<TaskFormFields>({
    defaultValues: {
      dueDate: null,
    },
  });

  return (
    <DatePicker control={control} name="dueDate" data-testid="date-picker" />
  );
};

describe("DatePicker Component", () => {
  it("renders date picker button", () => {
    render(<TestWrapper />);
    expect(screen.getByTestId("date-picker")).toBeInTheDocument();
  });

  it("renders with correct button text", () => {
    render(<TestWrapper />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<TestWrapper />);
    const button = screen.getByLabelText("Set due date");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Set due date");
  });
});
