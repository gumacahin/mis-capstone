import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import AddLabelDialog from "../AddLabelDialog";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("AddLabelDialog", () => {
  test("renders when open is true", () => {
    renderWithClient(<AddLabelDialog open={true} handleClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: /add label/i });
    expect(dialog).toBeVisible();
  });

  test("does not render when open is false", () => {
    renderWithClient(<AddLabelDialog open={false} handleClose={() => {}} />);
    const dialogs = screen.queryByRole("dialog", { name: /add label/i });
    expect(dialogs).toBeNull();
  });

  test.skip("calls handleClose when close button is clicked", () => {
    const handleClose = vi.fn();
    renderWithClient(<AddLabelDialog open={true} handleClose={handleClose} />);
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
