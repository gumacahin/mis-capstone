import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import { Tag } from "@/modules/shared";

import LabelDeleteDialog from "../LabelDeleteDialog";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

const fakeLabel: Tag = {
  name: "Fake Label",
};

describe("LabelDeleteDialog", () => {
  test("renders dialog with label name when open is true", () => {
    renderWithClient(
      <LabelDeleteDialog
        open={true}
        label={fakeLabel}
        handleClose={() => {}}
      />,
    );
    const dialog = screen.getByRole("dialog", { name: /delete label/i });
    expect(dialog).toBeVisible();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.getByText(/Fake Label/i)).toBeInTheDocument();
  });

  test("does not render dialog when open is false", () => {
    renderWithClient(
      <LabelDeleteDialog
        open={false}
        label={fakeLabel}
        handleClose={() => {}}
      />,
    );
    const dialog = screen.queryByRole("dialog", { name: /delete label/i });
    expect(dialog).toBeNull();
  });

  test.skip("calls handleClose after confirm delete", async () => {
    const handleClose = vi.fn();
    renderWithClient(
      <LabelDeleteDialog
        open={true}
        label={fakeLabel}
        handleClose={handleClose}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    // Await for handleClose to be eventually called
    // There might be an async tick, so use findBy/assert async
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(handleClose).toHaveBeenCalled();
  });
});
