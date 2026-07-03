import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

import AddProjectSectionButton from "../AddProjectSectionButton";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

const mockSection = {
  id: 1,
  title: "Section 1",
  order: 0,
  project: 1,
  is_default: false,
};

describe("AddProjectSectionButton", () => {
  test("renders Add Section button", () => {
    renderWithClient(
      <AddProjectSectionButton precedingSection={mockSection} />,
    );
    expect(
      screen.getByRole("button", { name: /add section/i }),
    ).toBeInTheDocument();
  });

  test("shows AddProjectSectionForm after clicking button", () => {
    renderWithClient(
      <AddProjectSectionButton precedingSection={mockSection} />,
    );
    // It should not render form initially
    expect(screen.queryByRole("form")).not.toBeInTheDocument();

    // Click the 'Add Section' button
    fireEvent.click(screen.getByRole("button", { name: /add section/i }));

    // Form should now be rendered (assuming form has a text field or role 'textbox')
    expect(screen.queryByRole("textbox")).toBeInTheDocument();
  });
});
