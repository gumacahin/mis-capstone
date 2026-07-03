import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

import AddProjectDialog from "../AddProjectDialog";

// Helper to wrap the dialog with necessary providers
function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <MemoryRouter>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </MemoryRouter>,
  );
}

describe("AddProjectDialog", () => {
  test("it renders", async () => {
    renderWithClient(<AddProjectDialog open={true} handleClose={() => {}} />);

    expect(screen.getByRole("dialog", { name: /add project/i })).toBeVisible();
  });

  test("renders fields and cancels", () => {
    const handleClose = vi.fn();
    renderWithClient(
      <AddProjectDialog open={true} handleClose={handleClose} />,
    );

    expect(screen.getByRole("dialog", { name: /add project/i })).toBeVisible();
    expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(handleClose).toHaveBeenCalled();
  });
});
