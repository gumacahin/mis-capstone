import type { ProjectDetail, Section } from "@shared";
import ProjectContext from "@shared/contexts/projectContext";
import { useDeleteSection } from "@shared/hooks/queries";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { toast } from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";

import ProjectSectionDeleteDialog from "../ProjectSectionDeleteDialog";
vi.mock("@shared/hooks/queries", () => {
  return {
    useDeleteSection: vi.fn(),
  };
});

vi.mock("react-hot-toast", () => {
  // mock `promise` as async passthrough for test
  return {
    toast: {
      promise: vi.fn((promise: Promise<unknown>) => promise),
    },
  };
});

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

describe.skip("ProjectSectionDeleteDialog", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    mutateAsync.mockReset();
    vi.mocked(useDeleteSection).mockReturnValue({
      mutateAsync,
    } as unknown as ReturnType<typeof useDeleteSection>);
    vi.mocked(toast.promise).mockClear();
  });

  it("renders dialog and calls handleClose on Cancel", () => {
    const handleClose = vi.fn();
    renderWithProjectContext(
      <ProjectSectionDeleteDialog
        open={true}
        section={fakeSection}
        handleClose={handleClose}
      />,
    );
    expect(screen.getByText("Delete Section")).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete the section "Section Title"?',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalled();
  });

  it("calls deleteSection and shows toast on Delete, then calls handleClose", async () => {
    const handleClose = vi.fn();
    mutateAsync.mockResolvedValueOnce({});
    renderWithProjectContext(
      <ProjectSectionDeleteDialog
        open={true}
        section={fakeSection}
        handleClose={handleClose}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
      expect(toast.promise).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
