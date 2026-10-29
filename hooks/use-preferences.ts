import { useCallback, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { api, type User } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import {
  hydratePreferences,
  preferencesStore,
  sanitizePreferences,
  updatePreferences,
  type LearningPreferences,
} from "@/store/preferences-store";

/**
 * Learning preferences are stored on the device for everyone and, for signed-in
 * users, mirrored to `user.preferences` on the server so they follow the account.
 */
export function usePreferences() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const preferences = useStore(preferencesStore, (state) => state);

  useEffect(() => {
    hydratePreferences();
  }, []);

  const setPreference = useCallback(
    <K extends keyof LearningPreferences>(key: K, value: LearningPreferences[K]) => {
      updatePreferences({ [key]: value } as Partial<LearningPreferences>);
      if (!isAuthenticated) return;

      // The server replaces the whole preferences object, so send it merged.
      const cachedUser = queryClient.getQueryData<User>(["user-profile"]);
      const merged = { ...(cachedUser?.preferences ?? {}), ...preferencesStore.state };
      void api.user
        .updateProfile({ preferences: merged })
        .then((updatedUser) => {
          queryClient.setQueryData(["user-profile"], updatedUser);
        })
        .catch((error) => {
          console.error("Failed to sync preferences:", error);
        });
    },
    [isAuthenticated, queryClient]
  );

  return { preferences, setPreference };
}

/** Applies the signed-in user's saved preferences once their profile loads. */
export function PreferencesSync() {
  const { isAuthenticated } = useAuth();
  const appliedForUserRef = useRef<string | null>(null);
  const { data: user } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => api.user.getProfile(),
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    hydratePreferences();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      appliedForUserRef.current = null;
      return;
    }
    if (!user?.id || appliedForUserRef.current === user.id) return;
    appliedForUserRef.current = user.id;

    const saved = sanitizePreferences(user.preferences);
    if (Object.keys(saved).length > 0) {
      updatePreferences(saved);
    }
  }, [isAuthenticated, user]);

  return null;
}
