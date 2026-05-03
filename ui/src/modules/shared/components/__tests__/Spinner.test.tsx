import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Spinner from "../Spinner";

describe("Spinner", () => {
  it("renders an SVG with three animated circles", () => {
    render(<Spinner />);
    // Spinner root is an SVG element
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // There should be three circles
    const circles = svg?.querySelectorAll("circle");
    expect(circles?.length).toBe(3);
    // Each circle should have an <animate> child
    circles?.forEach((circle) => {
      expect(circle.querySelector("animate")).not.toBeNull();
    });
    // All circles should have correct attributes
    const cxValues = Array.from(circles || []).map((c) => c.getAttribute("cx"));
    expect(cxValues).toEqual(["20", "50", "80"]);
    const rValues = Array.from(circles || []).map((c) => c.getAttribute("r"));
    expect(rValues).toEqual(["10", "10", "10"]);
  });
  it("uses the expected color", () => {
    render(<Spinner />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "rgb(138, 21, 56)");
  });
  it("sets width and height correctly", () => {
    render(<Spinner />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "100");
    expect(svg).toHaveAttribute("viewBox", "0 0 100 100");
  });
});
