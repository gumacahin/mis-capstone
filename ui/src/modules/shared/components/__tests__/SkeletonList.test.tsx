import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SkeletonList from "../SkeletonList";

describe("SkeletonList", () => {
  it("renders the correct number of skeleton items", () => {
    render(<SkeletonList count={5} width={120} />);
    // Each ListItemText primary skeleton should exist
    // The number of ListItemIcon skeletons should equal the count
    const circulars = screen.getAllByRole("progressbar"); // Skeletons have role="progressbar"
    // Two skeletons per item (circular + rectangular primary) + secondary
    // But we can only reliably count the circular ones
    // There should be 5 circulars, 5 rectangular primaries, 5 secondarys
    // We check that at least 'count' circulars exist
    expect(
      circulars.filter((el) => el.className.match(/MuiSkeleton-circular/))
        .length,
    ).toBe(5);
    // Also check for the rectangular skeletons (primary/secondary)
    expect(
      screen.getAllByText((content, node) => {
        return (
          node?.tagName.toLowerCase() === "span" &&
          node.className.includes("MuiSkeleton-rectangular")
        );
      }).length,
    ).toBe(10); // 5 primary, 5 secondary
  });

  it("uses the default width when width is not provided", () => {
    render(<SkeletonList count={1} />);
    const skeletonRects = screen.getAllByText((content, node) => {
      return (
        node?.tagName.toLowerCase() === "span" &&
        node.className.includes("MuiSkeleton-rectangular")
      );
    });
    // The width should default to 200 for primary skeleton
    // While secondary is 200*0.75 = 150
    // There are both skeletons
    const getStyleWidth = (node: Element) =>
      // Find the width set as the style attribute, if any, or fallback to inline style
      (node as HTMLElement).style.width;
    // For our test, at least one should have style width 200px, another 150px
    const widths = skeletonRects.map(getStyleWidth);
    expect(widths).toContain("200px");
    expect(widths).toContain("150px");
  });

  it("renders nothing if count is zero", () => {
    render(<SkeletonList count={0} />);
    // The List should exist but there should be no ListItems
    const listItems = screen.queryAllByRole("listitem");
    expect(listItems.length).toBe(0);
  });
});
