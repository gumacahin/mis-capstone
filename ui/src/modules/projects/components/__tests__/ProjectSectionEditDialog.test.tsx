import type { ProjectDetail, Section } from "@shared";
import ProjectContext from "@shared/contexts/projectContext";
import { useUpdateSection } from "@shared/hooks/queries";
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
    promise: vi.fn((promise: Promise<unknown>) => promise),
  },
}));

const fakeProject: ProjectDetail = {
  id: 1,
  title: "Project",
  view: "list",
  sections: [],
};
const fakeSection: Section = {
  id: 2,
  title: "Section Title",
  order: 0,
  project: 1,
  is_default: false,
  tasks: [],
};

function renderWithProjectContext(ui: React.ReactNode) {
  return render(
    <ProjectContext.Provider value={fakeProject}>{ui}</ProjectContext.Provider>,
  );
}

describe.skip("ProjectSectionEditDialog", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    mutateAsync.mockReset();
    vi.mocked(useUpdateSection).mockReturnValue({
      mutateAsync,
    } as unknown as ReturnType<typeof useUpdateSection>);
    vi.mocked(toast.promise).mockClear();
  });

  it("renders dialog and pre-fills input", () => {
    renderWithProjectContext(
      <ProjectSectionEditDialog
        open={true}
        section={fakeSection}
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
        section={fakeSection}
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
        section={fakeSection}
        handleClose={handleClose}
      />,
    );
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(handleClose).toHaveBeenCalled();
  });
});
