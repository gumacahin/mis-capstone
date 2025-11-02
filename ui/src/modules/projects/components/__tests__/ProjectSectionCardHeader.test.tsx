import type { ProjectDetail, Section } from "@shared";
import ProjectContext from "@shared/contexts/projectContext";
import SectionContext from "@shared/contexts/sectionContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import ProjectSectionCardHeader from "../ProjectSectionCardHeader";

// Mock toast from react-hot-toast to silence real toasts
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

// Mock useDuplicateSection to return a mock mutateAsync
const duplicateSectionMock = vi.fn(() => Promise.resolve());
vi.mock("@shared/hooks/queries", () => ({
  useDuplicateSection: vi.fn(() => ({ mutateAsync: duplicateSectionMock })),
}));

const fakeSection: Section = {
  id: 1,
  title: "My Section",
  order: 1,
};

const fakeProject: ProjectDetail = {
  id: 5,
  title: "My Project",
  view: "list",
  sections: [],
};

function wrapper(children: React.ReactNode) {
  return (
    <ProjectContext.Provider value={fakeProject}>
      <SectionContext.Provider value={fakeSection}>
        {children}
      </SectionContext.Provider>
    </ProjectContext.Provider>
  );
}

describe.skip("ProjectSectionCardHeader", () => {
  beforeEach(() => {
    duplicateSectionMock.mockClear();
  });

  test.only("renders section title and menu button", () => {
    render(wrapper(<ProjectSectionCardHeader />));

    expect(screen.getByText(fakeSection.title)).toBeVisible();
    // The menu button should be rendered
    expect(screen.getByLabelText(/section options/i)).toBeInTheDocument();
  });

  test("opens and closes section menu", () => {
    render(wrapper(<ProjectSectionCardHeader />));
    // Click menu button
    const menuButton = screen.getByLabelText(/section options/i);
    fireEvent.click(menuButton);

    // Now the menu should appear
    expect(screen.getByRole("menu")).toBeVisible();

    // Click outside/close menu
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    // The menu should be closed, so queryByRole returns null
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("calls duplicateSection when duplicate menu item clicked", async () => {
    render(wrapper(<ProjectSectionCardHeader />));
    fireEvent.click(screen.getByLabelText(/section options/i));
    // Click the duplicate option; it should be present
    const duplicateOption = screen.getByText(/duplicate/i);
    fireEvent.click(duplicateOption);
    expect(duplicateSectionMock).toHaveBeenCalled();
  });

  test("opens edit section dialog", () => {
    render(wrapper(<ProjectSectionCardHeader />));
    fireEvent.click(screen.getByLabelText(/section options/i));

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    // It should show a dialog (by role "dialog" or edit section header)
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText(/update section/i)).toBeInTheDocument();
  });

  test("opens delete section dialog", () => {
    render(wrapper(<ProjectSectionCardHeader />));
    fireEvent.click(screen.getByLabelText(/section options/i));

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText(/delete section/i)).toBeInTheDocument();
  });

  test("opens move section menu", () => {
    render(wrapper(<ProjectSectionCardHeader />));
    fireEvent.click(screen.getByLabelText(/section options/i));

    const moveButton = screen.getByText(/move/i);
    fireEvent.click(moveButton);

    // Move menu has "Move section" label
    expect(screen.getByText(/move section/i)).toBeVisible();
  });
});
