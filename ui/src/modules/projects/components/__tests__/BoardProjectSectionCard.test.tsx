import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import BoardProjectSectionCard from "../BoardProjectSectionCard";

// A simple mock child component/text
function MockChild() {
  return <div data-testid="mock-child">Hello child</div>;
}

describe("BoardProjectSectionCard", () => {
  test("renders its children", () => {
    render(
      <BoardProjectSectionCard>
        <MockChild />
      </BoardProjectSectionCard>,
    );
    expect(screen.getByTestId("mock-child")).toBeInTheDocument();
    expect(screen.getByText("Hello child")).toBeInTheDocument();
  });

  test("applies custom sx styles and passes other props", () => {
    render(
      <BoardProjectSectionCard
        sx={{ backgroundColor: "rgb(255,0,0)" }}
        data-testid="section-card"
      >
        <span>Section Content</span>
      </BoardProjectSectionCard>,
    );
    // Style: contains backgroundColor as given in sx
    const card = screen.getByTestId("section-card");
    expect(card).toBeInTheDocument();
    // Since sx is merged, Material-UI should apply backgroundColor; but test computed style:
    expect(card).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
    // Children present
    expect(screen.getByText("Section Content")).toBeInTheDocument();
  });
});
