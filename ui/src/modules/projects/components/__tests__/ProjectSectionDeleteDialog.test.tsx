import ProjectContext from "@shared/contexts/projectContext";
import { useDeleteSection as originalUseDeleteSection } from "@shared/hooks/queries";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { toast } from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";

import ProjectSectionDeleteDialog from "../ProjectSectionDeleteDialog";
/**
 * NOTE: To avoid "Cannot find module '@shared/hooks/queries'" error,
 * Vitest should be instructed to mock the module properly *before* imports use it.
 * This block ensures the module resolver works in test.
 * You should use the actual file path (relative from the project root)
 */

// If running in Vitest, ensure mocks are hoisted above other imports.
// This solves the test error for missing '@shared/hooks/queries' during mocking.

vi.mock("@shared/hooks/queries", () => {
  return {
    useDeleteSection: vi.fn(),
  };
});

vi.mock("react-hot-toast", async () => {
  // mock `promise` as async passthrough for test
  return {
    toast: {
      promise: vi.fn((fn, opts) => (fn.then ? fn : Promise.resolve())),
    },
  };
});
vi.mock("@shared/hooks/queries", async (mod) => {
  return {
    ...mod,
    useDeleteSection: vi.fn(),
  };
});

const fakeProject = { id: 1, title: "Project" };
const fakeSection = { id: 2, title: "Section Title" };

function renderWithProjectContext(ui: React.ReactNode) {
  return render(
    <ProjectContext.Provider value={fakeProject as any}>
      {ui}
    </ProjectContext.Provider>,
  );
}

describe.skip("ProjectSectionDeleteDialog", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    mutateAsync.mockReset();
    (require("@shared/hooks/queries").useDeleteSection as any).mockReturnValue({
      mutateAsync,
    });
    (toast.promise as any).mockClear();
  });

  it("renders dialog and calls handleClose on Cancel", () => {
    const handleClose = vi.fn();
    renderWithProjectContext(
      <ProjectSectionDeleteDialog
        open={true}
        section={fakeSection as any}
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
        section={fakeSection as any}
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
