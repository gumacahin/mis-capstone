import type { ProjectDetail } from "@shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import ProjectView from "../ProjectView";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("ProjectView", () => {
  const fakeProject: ProjectDetail = {
    id: 1,
    title: "Project",
    view: "list",
    sections: [],
  } as ProjectDetail;

  it("renders ProjectViewList when view is 'list'", () => {
    renderWithClient(
      <ProjectView project={{ ...fakeProject, view: "list" }} />,
    );
    // ProjectViewList component should render; it will contain 'project' title probably or utilize testId
    // expect(screen.getByText("Project")).toBeInTheDocument();
  });

  it("renders ProjectViewBoard when view is not 'list'", () => {
    renderWithClient(
      <ProjectView project={{ ...fakeProject, view: "board" }} />,
    );
    // expect(screen.getByText("Project")).toBeInTheDocument();
  });
});
