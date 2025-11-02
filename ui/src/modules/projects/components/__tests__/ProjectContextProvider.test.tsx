import type { ProjectDetail } from "@shared";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ProjectContextProvider } from "../ProjectContextProvider";

const fakeProject: ProjectDetail = {
  id: 10,
  title: "Test Project",
  view: "board",
  sections: [],
};

function MockChildComponent() {
  return <span data-testid="child">child content</span>;
}

describe("ProjectContextProvider", () => {
  test("provides project value to context and renders children", () => {
    render(
      <ProjectContextProvider project={fakeProject}>
        <MockChildComponent />
      </ProjectContextProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
