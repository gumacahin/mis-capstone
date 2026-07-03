import type { Profile } from "@shared";
import ProfileContext from "@shared/contexts/profileContext";
import { useMoveSection } from "@shared/hooks/queries";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { toast } from "react-hot-toast";
import { describe, expect, it, vi } from "vitest";

import ProjectSectionMoveMenu from "../ProjectSectionMoveMenu";

// Mock hooks and toast
vi.mock("@shared/hooks/queries", () => ({
  useMoveSection: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({
  toast: {
    promise: vi.fn((promise: Promise<unknown>) => promise),
  },
}));

const fakeProject = { id: 1, title: "Project" };
const fakeProfile: Profile = {
  id: 1,
  name: "Test User",
  email: "test@example.test",
  picture: "",
  is_student: false,
  is_faculty: true,
  is_onboarded: true,
  email_digest_enabled: false,
  theme: "system",
  projects: [
    {
      id: 1,
      title: "Inbox",
      is_default: true,
      sections: [],
    },
    {
      id: 3,
      title: "Project B",
      is_default: false,
      sections: [],
    },
  ],
};

function renderWithProjectContext(ui: React.ReactNode, project = fakeProject) {
  return render(
    <ProfileContext.Provider value={{ ...fakeProfile, name: project.title }}>
      {ui}
    </ProfileContext.Provider>,
  );
}

describe.skip("ProjectSectionMoveMenu", () => {
  const mutateAsync = vi.fn();

  it("renders move menu options", () => {
    // open prop controls Menu open state
    renderWithProjectContext(
      <ProjectSectionMoveMenu
        anchorEl={document.createElement("div")}
        currentProjectId={1}
        sectionId={2}
        handleClose={vi.fn()}
        handleCloseParentMenu={vi.fn()}
      />,
    );
    // Menu items should show other section as candidate
    expect(screen.getByText("Project B")).toBeInTheDocument();
  });

  it("calls moveSection and shows toast on selecting a move", async () => {
    const handleClose = vi.fn();
    mutateAsync.mockResolvedValueOnce({});
    vi.mocked(useMoveSection).mockReturnValue({
      mutateAsync,
    } as unknown as ReturnType<typeof useMoveSection>);
    renderWithProjectContext(
      <ProjectSectionMoveMenu
        anchorEl={document.createElement("div")}
        currentProjectId={1}
        sectionId={2}
        handleClose={handleClose}
        handleCloseParentMenu={vi.fn()}
      />,
    );

    // Simulate clicking move option
    fireEvent.click(screen.getByText("Project B"));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalled();
      expect(toast.promise).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("calls handleClose on menu close", () => {
    const handleClose = vi.fn();
    renderWithProjectContext(
      <ProjectSectionMoveMenu
        anchorEl={document.createElement("div")}
        currentProjectId={1}
        sectionId={2}
        handleClose={handleClose}
        handleCloseParentMenu={vi.fn()}
      />,
    );

    // Assume menu backdrop click triggers onClose callback (simulate for coverage)
    const menu = screen.getByRole("listbox");
    fireEvent.keyDown(menu, { key: "Escape", code: "Escape" });

    expect(handleClose).toHaveBeenCalled();
  });
});
