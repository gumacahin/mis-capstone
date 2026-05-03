import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { ProfileContextProvider } from "@/components/ProfileContextProvider";
import { ProjectContextProvider } from "@/modules/projects/components/ProjectContextProvider";
import { ProjectSectionContextProvider } from "@/modules/projects/components/ProjectSectionContextProvider";
import { Profile, ProjectDetail, Section } from "@/modules/shared";

import AddTaskButton from "../AddTaskButton";

const mockProject: ProjectDetail = {
  id: 1,
  title: "Test Project",
  view: "list",
  sections: [],
};

const mockSection: Section = {
  id: 1,
  title: "Test Section",
  order: 0,
  project: 1,
  is_default: false,
  tasks: [],
};

const mockSectionDefault: Section = {
  id: 1,
  title: "Default Section",
  order: 0,
  project: 1,
  is_default: true,
  tasks: [],
};

const mockProfile: Profile = {
  id: 1,
  name: "Test Profile",
  email: "test@example.com",
  picture: "test.png",
  is_student: false,
  is_faculty: false,
  is_onboarded: false,
  theme: "light",
  projects: [
    {
      id: 1,
      title: "Test Project",
      is_default: true,
      sections: [mockSectionDefault, mockSection],
    },
  ],
};

describe("AddTaskButton", () => {
  it("renders and opens task form on click", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileContextProvider profile={mockProfile}>
          <ProjectContextProvider project={mockProject}>
            <ProjectSectionContextProvider section={mockSection}>
              <AddTaskButton />
            </ProjectSectionContextProvider>
          </ProjectContextProvider>
        </ProfileContextProvider>
      </QueryClientProvider>,
    );

    const button = screen.getByLabelText(/add/i);
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    const taskFormCard = document.querySelector("form.MuiCard-root");
    expect(taskFormCard).toBeInTheDocument();
  });

  it.skip("can submit a new task", async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ProfileContextProvider profile={mockProfile}>
          <ProjectContextProvider project={mockProject}>
            <ProjectSectionContextProvider section={mockSection}>
              <AddTaskButton />
            </ProjectSectionContextProvider>
          </ProjectContextProvider>
        </ProfileContextProvider>
      </QueryClientProvider>,
    );

    const button = screen.getByLabelText(/add/i);
    await userEvent.click(button);

    const taskFormCard = screen.getByTestId("task-form-card");
    expect(taskFormCard).toBeInTheDocument();

    const titleInput = taskFormCard.querySelector(
      "[data-placeholder='Task name']",
    );
    expect(titleInput).toBeInTheDocument();
    await userEvent.type(titleInput, "My New Task");

    const descriptionInput = screen.getByPlaceholderText(/description/i);
    expect(descriptionInput).toBeInTheDocument();
    await userEvent.type(descriptionInput, "My New Task Description");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeInTheDocument();

    await userEvent.click(saveButton);

    expect(taskFormCard).not.toBeInTheDocument();
  });
});
