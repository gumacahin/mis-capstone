import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import AddTaskButton from "../AddTaskButton";

vi.mock("../TaskForm", () => ({
  default: () => <form data-testid="task-form-card" />,
}));

describe("AddTaskButton", () => {
  it("renders and opens task form on click", async () => {
    render(<AddTaskButton />);

    const button = screen.getByLabelText(/add/i);
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(screen.getByTestId("task-form-card")).toBeInTheDocument();
  });
});
