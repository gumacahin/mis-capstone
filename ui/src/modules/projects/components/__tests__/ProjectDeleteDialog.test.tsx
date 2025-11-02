import type { ProjectDetail } from "@shared";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import ProjectDeleteDialog from "../ProjectDeleteDialog";

// Mock toast.promise to resolve immediately
vi.mock("react-hot-toast", () => ({
  toast: {
    promise: vi.fn((promise, messages) =>
      promise.then(
        () => messages.success,
        () => messages.error,
      ),
    ),
  },
}));

// Mock useDeleteProject to return a mock mutateAsync function
const mutateAsyncMock = vi.fn(() => Promise.resolve());
vi.mock("@shared/hooks/queries", () => ({
  useDeleteProject: vi.fn(() => ({ mutateAsync: mutateAsyncMock })),
}));

const fakeProject: ProjectDetail = {
  id: 1,
  title: "Fake Project",
  view: "board",
  sections: [],
};

describe("ProjectDeleteDialog", () => {
  beforeEach(() => {
    mutateAsyncMock.mockClear();
  });

  test("renders dialog with project title and correct buttons", () => {
    render(
      <ProjectDeleteDialog
        open={true}
        project={fakeProject}
        handleClose={() => {}}
      />,
    );
    expect(screen.getByText("Delete Project")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Are you sure you want to delete the project.*Fake Project.*\?/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("calls handleClose when cancel button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <ProjectDeleteDialog
        open={true}
        project={fakeProject}
        handleClose={handleClose}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("calls mutateAsync and handleClose when delete button is clicked", async () => {
    const handleClose = vi.fn();
    mutateAsyncMock.mockResolvedValueOnce(undefined);
    render(
      <ProjectDeleteDialog
        open={true}
        project={fakeProject}
        handleClose={handleClose}
      />,
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mutateAsyncMock).toHaveBeenCalledTimes(1);

    // Wait for handleClose to be called after async delete finishes
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
