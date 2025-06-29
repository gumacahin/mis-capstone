import ProfileContext from "../contexts/profileContext";
import type { Profile } from "../types/common";

export function ProfileContextProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}
