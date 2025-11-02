import ProjectContext from "@shared/contexts/projectContext";
import { useUpdateSection as originalUseUpdateSection } from "@shared/hooks/queries";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { toast } from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";

import ProjectSectionEditDialog from "../ProjectSectionEditDialog";

// Mock the hooks and toast
vi.mock("@shared/hooks/queries", () => ({
  useUpdateSection: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({
  toast: {
    promise: vi.fn((fn, opts) => (fn.then ? fn : Promise.resolve())),
  },
}));

const fakeProject = { id: 1, title: "Project" };
const fakeSection = { id: 2, title: "Section Title" };

function renderWithProjectContext(ui: React.ReactNode) {
  return render(
    <ProjectContext.Provider value={fakeProject as any}>
      {ui}
    </ProjectContext.Provider>,
  );
}

describe.skip("ProjectSectionEditDialog", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    mutateAsync.mockReset();
    (require("@shared/hooks/queries").useUpdateSection as any).mockReturnValue({
      mutateAsync,
    });
    (toast.promise as any).mockClear();
  });

  it("renders dialog and pre-fills input", () => {
    renderWithProjectContext(
      <ProjectSectionEditDialog
        open={true}
        section={fakeSection as any}
        handleClose={vi.fn()}
      />,
    );
    // Title input must contain the section title
    const input = screen.getByLabelText(/title/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(fakeSection.title);
  });

  it("calls updateSection and shows toast on submit, then closes dialog", async () => {
    const handleClose = vi.fn();
    mutateAsync.mockResolvedValueOnce({});
    renderWithProjectContext(
      <ProjectSectionEditDialog
        open={true}
        section={fakeSection as any}
        handleClose={handleClose}
      />,
    );

    const input = screen.getByLabelText(/title/i);

    // Simulate user changing the value
    fireEvent.change(input, { target: { value: "New Section Title" } });

    // Submit the form
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        title: "New Section Title",
      });
      expect(toast.promise).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("calls handleClose on Cancel", () => {
    const handleClose = vi.fn();
    renderWithProjectContext(
      <ProjectSectionEditDialog
        open={true}
        section={fakeSection as any}
        handleClose={handleClose}
      />,
    );
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
