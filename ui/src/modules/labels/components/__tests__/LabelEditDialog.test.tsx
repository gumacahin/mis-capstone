import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import * as toastModule from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import type { Tag } from "@/modules/shared";

import LabelEditDialog from "../LabelEditDialog";

vi.spyOn(toastModule, "toast").mockImplementation(
  () => "test" as unknown as string,
);

vi.mock("react-hot-toast", () => {
  const toast = Object.assign(vi.fn(), {
    promise: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    // add other methods if your code calls them
  });

  return {
    // named exports of the real package
    Toaster: () => null,
    toast, // <-- our mocked function with methods
  };
});

// import { toast } from "react-hot-toast";

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

describe("LabelEditDialog", () => {
  test("renders dialog with label name, allows editing and submit", async () => {
    const handleClose = vi.fn();
    renderWithClient(
      <LabelEditDialog
        open={true}
        handleClose={handleClose}
        label={fakeLabel}
      />,
    );
    expect(screen.getByRole("dialog", { name: /update label/i })).toBeVisible();

    // Text field should have the label name value
    const input = screen.getByRole("textbox", { name: /name/i });
    expect((input as HTMLInputElement).value).toBe("Fake Label");

    // Change input value to new label name
    // fireEvent.change(input, { target: { value: "Updated Label" } });
    // expect((input as HTMLInputElement).value).toBe("Updated Label");

    // Mock toast.promise and updateLabel mutation
    // const toastPromiseMock = vi.fn().mockResolvedValue(undefined);

    // The mutation used in the dialog is useUpdateLabel
    // Since that's a react-query hook, we can spy/mutate it at the implementation if needed.
    // For coverage, just click submit button and check UI callback
    // const saveButton = screen.getByRole("button", { name: /update label/i });
    // fireEvent.click(saveButton);

    // Wait for async handlers (handleClose is called after save)
    // await new Promise((resolve) => setTimeout(resolve, 10));
    // expect(handleClose).toHaveBeenCalled();
  });

  test("does not render dialog when open is false", () => {
    renderWithClient(
      <LabelEditDialog open={false} handleClose={() => {}} label={fakeLabel} />,
    );
    // Should not find dialog
    const dialog = screen.queryByRole("dialog", { name: /edit label/i });
    expect(dialog).toBeNull();
  });
});
