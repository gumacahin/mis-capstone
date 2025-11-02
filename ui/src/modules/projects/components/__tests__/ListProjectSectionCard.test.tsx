import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import ListProjectSectionCard from "../ListProjectSectionCard";

// Simple mock child component
function MockChild() {
  return <span data-testid="mock-child">List Section Content</span>;
}

describe("ListProjectSectionCard", () => {
  test("renders its children", () => {
    render(
      <ListProjectSectionCard>
        <MockChild />
      </ListProjectSectionCard>,
    );
    expect(screen.getByTestId("mock-child")).toBeInTheDocument();
    expect(screen.getByText("List Section Content")).toBeInTheDocument();
  });

  test("applies custom sx styles and passes other props", () => {
    render(
      <ListProjectSectionCard
        sx={{ backgroundColor: "rgb(0, 128, 0)" }}
        data-testid="list-section-card"
      >
        <span>Some List Section</span>
      </ListProjectSectionCard>,
    );
    const card = screen.getByTestId("list-section-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveStyle({ backgroundColor: "rgb(0, 128, 0)" });
    expect(screen.getByText("Some List Section")).toBeInTheDocument();
  });
});
