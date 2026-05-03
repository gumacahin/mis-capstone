import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useScrollbarWidth from "../useScrollbarWidth";

describe("useScrollbarWidth", () => {
  it("computes scrollbar width as a non-negative integer", () => {
    const { result } = renderHook(() => useScrollbarWidth());
    // JSDOM returns 0, browsers might return 0 or a typical width (e.g., 15-17)
    expect(Number.isInteger(result.current)).toBe(true);
    expect(result.current).toBeGreaterThanOrEqual(0);
  });
});
