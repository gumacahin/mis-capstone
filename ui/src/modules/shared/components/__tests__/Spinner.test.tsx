import { describe, expect, it } from "vitest";

import { render, screen } from "@/test/test-utils";

import Spinner from "../Spinner";

describe("Spinner Component", () => {
  it("renders the spinner SVG", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has correct SVG attributes", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");

    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "100");
    expect(svg).toHaveAttribute("viewBox", "0 0 100 100");
    expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    expect(svg).toHaveAttribute("fill", "rgb(138, 21, 56)");
  });

  it("contains three animated circles", () => {
    const { container } = render(<Spinner />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(3);
  });

  it("has circles with correct positions", () => {
    const { container } = render(<Spinner />);
    const circles = container.querySelectorAll("circle");

    expect(circles).toHaveLength(3);

    // First circle at position (20, 50)
    expect(circles[0]).toHaveAttribute("cx", "20");
    expect(circles[0]).toHaveAttribute("cy", "50");
    expect(circles[0]).toHaveAttribute("r", "10");

    // Second circle at position (50, 50)
    expect(circles[1]).toHaveAttribute("cx", "50");
    expect(circles[1]).toHaveAttribute("cy", "50");
    expect(circles[1]).toHaveAttribute("r", "10");

    // Third circle at position (80, 50)
    expect(circles[2]).toHaveAttribute("cx", "80");
    expect(circles[2]).toHaveAttribute("cy", "50");
    expect(circles[2]).toHaveAttribute("r", "10");
  });

  it("has animation elements with correct attributes", () => {
    const { container } = render(<Spinner />);
    const animateElements = container.querySelectorAll("animate");

    expect(animateElements).toHaveLength(3);

    // Check animation attributes for all circles
    animateElements.forEach((animate, index) => {
      expect(animate).toHaveAttribute("attributeName", "r");
      expect(animate).toHaveAttribute("from", "10");
      expect(animate).toHaveAttribute("to", "10");
      expect(animate).toHaveAttribute("dur", "0.8s");
      expect(animate).toHaveAttribute("values", "10;20;10");
      expect(animate).toHaveAttribute("calcMode", "linear");
      expect(animate).toHaveAttribute("repeatCount", "indefinite");

      // Check different begin times for staggered animation
      const expectedBegin = `${index * 0.2}s`;
      expect(animate).toHaveAttribute("begin", expectedBegin);
    });
  });

  it("renders without crashing when used in a container", () => {
    render(
      <div data-testid="spinner-container">
        <Spinner />
      </div>,
    );

    expect(screen.getByTestId("spinner-container")).toBeInTheDocument();
    const svg = screen.getByTestId("spinner-container").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
