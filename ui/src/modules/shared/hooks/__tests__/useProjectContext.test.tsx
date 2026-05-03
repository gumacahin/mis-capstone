import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { expect } from "vitest";

import ProjectContext from "../../contexts/projectContext";
import useProjectContext from "../useProjectContext";

describe("useProjectContext", () => {
  it("returns the project from the context when set", () => {
    const mockProject = { id: 1, name: "Test Project" };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ProjectContext.Provider value={mockProject}>
        {children}
      </ProjectContext.Provider>
    );
    const { result } = renderHook(() => useProjectContext(), { wrapper });
    expect(result.current).toBe(mockProject);
  });

  it("throws error when no provider is set", () => {
    // Suppress error output for this test
    const originalError = console.error;
    console.error = () => {};
    try {
      expect(() => renderHook(() => useProjectContext())).toThrow(
        "useProjectContext must be used within a ProjectContextProvider",
      );
    } finally {
      console.error = originalError;
    }
  });
});
