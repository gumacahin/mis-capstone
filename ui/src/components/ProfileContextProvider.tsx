import type { Profile } from "@shared";
import ProfileContext from "@shared/contexts/profileContext";

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
