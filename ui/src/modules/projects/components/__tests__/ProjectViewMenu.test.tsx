import type { ProjectDetail } from "@shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectViewMenu from "../ProjectViewMenu";

// Helper to render with react-query context
function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("ProjectViewMenu", () => {
  const fakeProject: ProjectDetail = {
    id: 42,
    title: "Menu Project",
    view: "list",
    sections: [],
  } as ProjectDetail;

  it("renders project view menu and has buttons for switching views", () => {
    renderWithClient(<ProjectViewMenu project={fakeProject} />);
    // The view options should be present (icons or labels)
    const projectViewMenuButton = screen.getByTestId(
      "project-view-menu-button",
    );
    expect(projectViewMenuButton).toBeInTheDocument();
    fireEvent.click(projectViewMenuButton);
    expect(screen.getByRole("menu")).toBeVisible();
    expect(screen.getByText(/list/i)).toBeVisible();
    expect(screen.getByText(/board/i)).toBeVisible();
  });
});
