import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

import AddProjectButton from "../AddProjectButton";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("AddProjectButton", () => {
  test("renders an IconButton with add icon", () => {
    renderWithClient(<AddProjectButton />);
  });

  test("shows AddProjectDialog when the button is clicked", async () => {
    renderWithClient(<AddProjectButton />);
    const button = screen.getByLabelText("add project button");
    fireEvent.click(button);
    const dialog = await screen.findByRole("dialog", { name: /add project/i });
    expect(dialog).toBeVisible();
  });

  // etc...
});
