import { useMemo } from "react";

import type { Project } from "../../../api/migration-helpers";
import { useProfile } from "./queries";

/**
 * Hook to get the user's inbox project (default project)
 *
 * @returns Object containing:
 *   - inbox: The inbox project or undefined if not found
 *   - isLoading: Whether the profile is still loading
 *   - error: Error if profile failed to load or no inbox found
 */
export const useInbox = () => {
  const { data: profile, isLoading, error: profileError } = useProfile();

  const inbox = useMemo(() => {
    if (!profile?.projects) return undefined;
    return profile.projects.find((p: Project) => p.is_default);
  }, [profile?.projects]);

  // Create a specific error if no inbox is found after loading
  const error = useMemo(() => {
    if (profileError) return profileError;
    if (!isLoading && profile && profile.projects && !inbox) {
      return new Error("No inbox project found. Please contact support.");
    }
    return null;
  }, [profileError, isLoading, profile, inbox]);

  return {
    inbox,
    isLoading,
    error,
    // Additional helper properties
    hasInbox: !!inbox,
    inboxId: inbox?.id,
  };
};

export default useInbox;
