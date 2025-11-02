import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

import AddLabelButton from "../AddLabelButton";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("AddLabelButton", () => {
  test("renders an IconButton with add icon", () => {
    renderWithClient(<AddLabelButton />);
    const button = screen.getByLabelText("add label");
    expect(button).toBeInTheDocument();
  });

  test("shows AddLabelDialog when the button is clicked", async () => {
    renderWithClient(<AddLabelButton />);
    const button = screen.getByLabelText("add label");
    fireEvent.click(button);
    const dialog = await screen.findByRole("dialog", { name: /add label/i });
    expect(dialog).toBeVisible();
  });
});
