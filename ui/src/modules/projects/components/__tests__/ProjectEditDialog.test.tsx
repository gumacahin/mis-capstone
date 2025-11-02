import type { ProjectDetail } from "@shared";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import ProjectEditDialog from "../ProjectEditDialog";

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

// Mock useUpdateProject to return a mock mutateAsync function
const mutateAsyncMock = vi.fn(() => Promise.resolve());
vi.mock("@shared/hooks/queries", () => ({
  useUpdateProject: vi.fn(() => ({ mutateAsync: mutateAsyncMock })),
}));

const fakeProject: ProjectDetail = {
  id: 2,
  title: "Sample Project",
  view: "list",
  sections: [],
};

describe("ProjectEditDialog", () => {
  beforeEach(() => {
    mutateAsyncMock.mockClear();
  });

  test("renders dialog with project title field and view options", () => {
    render(
      <ProjectEditDialog
        open={true}
        handleClose={() => {}}
        project={fakeProject}
      />,
    );
    expect(
      screen.getByRole("dialog", { name: /update project/i }),
    ).toBeVisible();
    expect(screen.getByText("View options")).toBeInTheDocument();
  });

  test("calls handleClose after successful update", async () => {
    const handleClose = vi.fn();
    render(
      <ProjectEditDialog
        open={true}
        handleClose={handleClose}
        project={fakeProject}
      />,
    );
    const titleInput = screen.getByLabelText("Project title");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /update project/i }));

    // Ensure updateProject.mutateAsync is called with updated data
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
    });

    // Wait for handleClose to be called
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
