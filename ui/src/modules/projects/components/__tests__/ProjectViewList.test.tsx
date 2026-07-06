import type { ProjectDetail } from "@shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ProjectViewList from "../ProjectViewList";

const reorderSectionsMock = vi.fn().mockResolvedValue(undefined);
const reorderTasksMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@shared/hooks/queries", () => ({
  useAddSection: () => ({ mutateAsync: vi.fn().mockResolvedValue(undefined) }),
  useReorderSections: () => ({ mutateAsync: reorderSectionsMock }),
  useReorderTasks: () => ({ mutateAsync: reorderTasksMock }),
}));

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

  it("renders empty state without requiring auth context setup", () => {
    reorderSectionsMock.mockClear();
    reorderTasksMock.mockClear();

    renderWithClient(<ProjectViewList project={fakeProject} />);

    expect(screen.getByText("No sections found")).toBeInTheDocument();
    expect(reorderSectionsMock).not.toHaveBeenCalled();
    expect(reorderTasksMock).not.toHaveBeenCalled();
  });
});
