import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";

import ProfileContext from "../../contexts/profileContext";
import { useProfile } from "../queries";

describe.skip("useProfile", () => {
  it.skip("returns the profile from the context when set", () => {
    const mockProfile = { id: 1, username: "testuser" };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ProfileContext.Provider value={mockProfile}>
        {children}
      </ProfileContext.Provider>
    );
    const { result } = renderHook(() => useProfile(), { wrapper });
    expect(result.current.data).toEqual(mockProfile);
  });

  it.skip("returns undefined or null when no provider is set", () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current?.data ?? null).toBeNull();
  });
});
