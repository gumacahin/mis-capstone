import ProfileContext from "@shared/contexts/profileContext";
import type { Profile } from "@shared/types/common";

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
