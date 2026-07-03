import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { ProfileContextProvider } from "@/components/ProfileContextProvider";
import { ProjectContextProvider } from "@/modules/projects/components/ProjectContextProvider";
import { ProjectSectionContextProvider } from "@/modules/projects/components/ProjectSectionContextProvider";
import { Profile, ProjectDetail, Section } from "@/modules/shared";

import TaskForm from "../TaskForm";

const { mockAddTask, mockUpdateTask } = vi.hoisted(() => ({
  mockAddTask: vi.fn(),
  mockUpdateTask: vi.fn(),
}));

vi.mock("@shared/components/DatePicker", () => ({
  default: () => <div data-testid="date-picker" />,
}));

vi.mock("../DescriptionField", () => ({
  default: () => <textarea aria-label="description" />,
}));

vi.mock("../TaskPriorityMenu", () => ({
  default: () => <div data-testid="task-priority-menu" />,
}));

vi.mock("../TaskProjectButton", () => ({
  default: () => <button type="button">Project</button>,
}));

vi.mock("../TaskTagsButton", () => ({
  default: () => <div data-testid="task-tags-button" />,
}));

vi.mock("../TitleField", () => ({
  default: () => <input aria-label="task name" defaultValue="" />,
}));

vi.mock("@shared/hooks/queries", () => {
  return {
    useAddTask: () => ({
      mutateAsync: mockAddTask,
    }),
    useTags: () => ({
      data: { results: [] },
      isPending: false,
    }),
    useUpdateTask: () => ({
      mutateAsync: mockUpdateTask,
    }),
  };
});

const mockProject: ProjectDetail = {
  id: 1,
  title: "Test Project",
  view: "list",
  sections: [],
};

const mockSection: Section = {
  id: 11,
  title: "Section",
  order: 0,
  project: 1,
  is_default: false,
  tasks: [],
};

const mockSectionDefault: Section = {
  id: 2,
  title: "Default",
  order: 1,
  project: 1,
  is_default: true,
  tasks: [],
};

const mockProfile: Profile = {
  id: 1,
  name: "Test",
  email: "test@email.com",
  picture: "",
  is_student: false,
  is_faculty: false,
  is_onboarded: true,
  theme: "light",
  projects: [
    {
      id: 1,
      title: "Test Project",
      is_default: true,
      sections: [mockSection, mockSectionDefault],
    },
  ],
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfileContextProvider profile={mockProfile}>
        <ProjectContextProvider project={mockProject}>
          <ProjectSectionContextProvider section={mockSection}>
            {ui}
          </ProjectSectionContextProvider>
        </ProjectContextProvider>
      </ProfileContextProvider>
    </QueryClientProvider>,
  );
}

describe("TaskForm", () => {
  it("renders the TaskForm with required fields", () => {
    renderWithProviders(<TaskForm handleClose={() => {}} />);
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("disables the Save button when the title is empty", () => {
    renderWithProviders(<TaskForm handleClose={() => {}} />);
    const saveBtn = screen.getByRole("button", { name: /save/i });
    expect(saveBtn).toBeDisabled();
  });

  it.skip("enables the Save button when the title is filled", async () => {
    renderWithProviders(<TaskForm handleClose={() => {}} />);
    const titleInput = screen.getAllByRole("textbox")[0];
    await userEvent.type(titleInput, "Test Task");
    expect(screen.getByRole("button", { name: /save/i })).not.toBeDisabled();
  });

  it("calls handleClose on Cancel", async () => {
    const handleClose = vi.fn();
    renderWithProviders(<TaskForm handleClose={handleClose} />);
    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it.skip("submits the form and disables Save while loading", async () => {
    const g = globalThis as Record<string, unknown>;
    const origToast = g.toast;
    g.toast = {
      promise: () => Promise.resolve(),
    };
    renderWithProviders(<TaskForm handleClose={() => {}} />);
    const titleInput = screen.getAllByRole("textbox")[0];
    await userEvent.type(titleInput, "A New Task");
    const saveBtn = screen.getByRole("button", { name: /save/i });
    await userEvent.click(saveBtn);
    expect(saveBtn).toBeDisabled();
    if (origToast) g.toast = origToast;
  });
});
