import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { expect } from "vitest";

import SectionContext from "../../contexts/sectionContext";
import useSectionContext from "../useSectionContext";

describe("useSectionContext", () => {
  it("returns the section from the context when set", () => {
    const mockSection = { id: 1, name: "Test Section" };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SectionContext.Provider value={mockSection}>
        {children}
      </SectionContext.Provider>
    );
    const { result } = renderHook(() => useSectionContext(), { wrapper });
    expect(result.current).toBe(mockSection);
  });

  it("throws error when no provider is set", () => {
    // Suppress error output for this test
    const originalError = console.error;
    console.error = () => {};
    try {
      expect(() => renderHook(() => useSectionContext())).toThrow(
        "useSectionContext must be used within a ProjectSectionContextProvider",
      );
    } finally {
      console.error = originalError;
    }
  });
});
