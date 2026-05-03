import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProfileContextProvider } from "@/components/ProfileContextProvider";
import { ProjectContextProvider } from "@/modules/projects/components/ProjectContextProvider";
import { ProjectSectionContextProvider } from "@/modules/projects/components/ProjectSectionContextProvider";
import { Profile, ProjectDetail, Section } from "@/modules/shared";

import AddTaskDialog from "../AddTaskDialog";

// Mocks and helpers
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
      title: "Inbox",
      is_default: true,
      sections: [
        {
          id: 1,
          title: "Inbox Section",
          project: 1,
          is_default: true,
        },
      ],
    },
  ],
};

const mockProject: ProjectDetail = {
  id: 1,
  title: "Inbox",
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

// Required context wrappers
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

describe("AddTaskDialog", () => {
  it("renders dialog with form fields and buttons", () => {
    renderWithProviders(<AddTaskDialog open={true} handleClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("calls handleClose when Cancel is clicked", () => {
    const handleClose = vi.fn();
    renderWithProviders(
      <AddTaskDialog open={true} handleClose={handleClose} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalled();
  });

  it.skip("submits the form and disables Save while loading", async () => {
    const handleClose = vi.fn();

    renderWithProviders(
      <AddTaskDialog open={true} handleClose={handleClose} />,
    );

    // Fill in required fields
    const titleInput = screen.getByText(/task name/i);
    fireEvent.change(titleInput, { target: { value: "Test Task" } });

    // Click Save
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // The button should show "loading" or become disabled (spinner)
    await waitFor(() => expect(saveButton).toHaveAttribute("disabled"));
  });
});
