import { render } from "@testing-library/react";

import Spinner from "../Spinner";

describe("Spinner Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<Spinner />);

    // Check if the component renders
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render an SVG with animated circles", () => {
    const { container } = render(<Spinner />);

    // Check if SVG is rendered
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "100");

    // Check if circles are rendered
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(3);

    // Check if circles have animation attributes
    const firstCircle = circles[0];
    expect(firstCircle).toHaveAttribute("cx", "20");
    expect(firstCircle).toHaveAttribute("cy", "50");
    expect(firstCircle).toHaveAttribute("r", "10");
  });
});
