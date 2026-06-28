import type { ProjectDetail } from "@shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import ProjectViewList from "../ProjectViewList";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("ProjectViewList", () => {
  const fakeProject: ProjectDetail = {
    id: 1,
    title: "List Project",
    view: "list",
    sections: [],
  } as ProjectDetail;

  it("renders ProjectViewList for project with view 'list'", () => {
    renderWithClient(<ProjectViewList project={fakeProject} />);
    // Insert a meaningful assertion based on known details/text in ProjectViewList.
    // For example, if the project title is used in the UI:
    // expect(screen.getByText("List Project")).toBeInTheDocument();
  });
});
