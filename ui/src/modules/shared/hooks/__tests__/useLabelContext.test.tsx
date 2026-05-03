import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";

import LabelContext from "../../contexts/labelContext";
import useLabelContext from "../useLabelContext";

describe("useLabelContext", () => {
  it.skip("returns the label from the context when set", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LabelContext.Provider value="foo-label">
        {children}
      </LabelContext.Provider>
    );
    const { result } = renderHook(() => useLabelContext(), { wrapper });
    expect(result.current).toBe("foo-label");
  });

  it("returns null when context value is undefined", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LabelContext.Provider value={undefined}>
        {children}
      </LabelContext.Provider>
    );
    const { result } = renderHook(() => useLabelContext(), { wrapper });
    expect(result.current).toBeNull();
  });

  it("returns null when no provider is set", () => {
    const { result } = renderHook(() => useLabelContext());
    expect(result.current).toBeNull();
  });
});
