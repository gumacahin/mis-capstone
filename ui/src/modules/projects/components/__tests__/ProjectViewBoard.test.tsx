import type { ProjectDetail } from "@shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectViewBoard from "../ProjectViewBoard";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("ProjectViewBoard", () => {
  const fakeProject: ProjectDetail = {
    id: 1,
    title: "Project Board",
    view: "board",
    sections: [],
  } as ProjectDetail;

  it("renders ProjectViewBoard for project with view 'board'", () => {
    renderWithClient(<ProjectViewBoard project={fakeProject} />);
    // Insert meaningful assertion based on Board's rendering.
    // This could depend on known UI text, ids or testIds in ProjectViewBoard.
    // For example, if the title is rendered:
    // expect(screen.getByText("Project Board")).toBeInTheDocument();
  });
});
