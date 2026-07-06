import type { ProjectDetail } from "@shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProjectViewBoard from "../ProjectViewBoard";

const reorderSectionsMock = vi.fn().mockResolvedValue(undefined);
const reorderTasksMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@shared/hooks/queries", () => ({
  useReorderSections: () => ({ mutateAsync: reorderSectionsMock }),
  useReorderTasks: () => ({ mutateAsync: reorderTasksMock }),
}));

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
    expect(screen.getByText("No sections found")).toBeInTheDocument();
  });
});
