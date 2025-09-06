import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/test-utils";

import type { TaskFormFields } from "../../types/common";
import DatePicker from "../DatePicker";

// Mock component that uses the DatePicker
const TestWrapper = () => {
  const { control } = useForm<TaskFormFields>({
    defaultValues: {
      rrule: undefined,
    },
  });

  return <DatePicker control={control} />;
};

describe("DatePicker Component", () => {
  it("renders date picker button", () => {
    render(<TestWrapper />);
    expect(
      screen.getByRole("button", { name: /set due date/i }),
    ).toBeInTheDocument();
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
});
