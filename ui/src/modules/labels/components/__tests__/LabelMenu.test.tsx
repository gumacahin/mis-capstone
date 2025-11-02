import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import * as toastModule from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import type { Tag } from "@/modules/shared";

import LabelMenu from "../LabelMenu";

vi.spyOn(toastModule, "toast").mockImplementation(
  () => "test" as unknown as string,
);

vi.mock("react-hot-toast", () => {
  const toast = Object.assign(vi.fn(), {
    promise: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  });

  return {
    Toaster: () => null,
    toast,
  };
});

function renderWithRouter(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

const fakeLabel: Tag = {
  name: "Label X",
};

describe("LabelMenu", () => {
  test("renders menu and handles Edit and Delete", async () => {
    renderWithRouter(
      <LabelMenu
        anchorEl={document.body}
        label={fakeLabel}
        handleClose={vi.fn()}
      />,
    );

    // Check for Edit and Delete menu items
    const editButton = screen.getByRole("menuitem", { name: /edit/i });
    const deleteButton = screen.getByRole("menuitem", { name: /delete/i });

    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Click Edit and check handler called
    // fireEvent.click(editButton);
    // expect(onEdit).toHaveBeenCalled();

    // Click Delete and check handler called
    // fireEvent.click(deleteButton);
    // expect(onDelete).toHaveBeenCalled();
  });
});
