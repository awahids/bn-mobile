import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Bookmark as ApiBookmark } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Calendar, Flame, type LucideIcon } from "lucide-react";

export interface ProfileUser {
  username: string;
  email: string;
  streak: number;
  dailyProgress: number;
}

export interface ProfileStatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export function useProfilePageData() {
  const { user: sessionUser, status, isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();

  const [notifications, setNotifications] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => api.user.getProfile(),
    enabled: status === "authenticated" && !!sessionUser?.id,
    retry: false,
  });

  const {
    data: bookmarks = [],
    isLoading: bookmarksLoading,
    error: bookmarksError,
  } = useQuery<ApiBookmark[]>({
    queryKey: ["user-bookmarks"],
    queryFn: () => api.bookmarks.getBookmarks(),
    enabled: status === "authenticated" && !!sessionUser?.id,
    retry: false,
  });

  const deleteBookmarkMutation = useMutation({
    mutationFn: (bookmarkId: string) => api.bookmarks.deleteBookmark(bookmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
    },
    onError: (error) => {
      console.error("Failed to delete bookmark:", error);
    },
  });

  const user: ProfileUser = useMemo(
    () =>
      isAuthenticated
        ? {
            username: userData?.name || sessionUser?.name || "User",
            email: userData?.email || sessionUser?.email || "user@example.com",
            streak: userData?.streak || 0,
            dailyProgress: userData?.dailyProgress || 0,
          }
        : {
            username: "Guest User",
            email: "Masuk untuk melihat email",
            streak: 0,
            dailyProgress: 0,
          },
    [isAuthenticated, sessionUser?.email, sessionUser?.name, userData?.dailyProgress, userData?.email, userData?.name, userData?.streak]
  );

  const userStats: ProfileStatItem[] = useMemo(
    () => [
      {
        label: "Hari Berturut",
        value: user.streak || 0,
        icon: Flame,
        color: "text-orange-500",
      },
      {
        label: "Total Bookmark",
        value: bookmarks.length,
        icon: BookOpen,
        color: "text-chart-2",
      },
      {
        label: "Progress Harian",
        value: isAuthenticated ? `${user.dailyProgress || 0}/5` : "-/5",
        icon: Calendar,
        color: "text-chart-1",
      },
    ],
    [bookmarks.length, isAuthenticated, user.dailyProgress, user.streak]
  );

  const signOut = async () => {
    await logout();
  };

  return {
    status,
    isAuthenticated,
    sessionUser,
    user,
    userStats,
    userLoading,
    bookmarks,
    bookmarksLoading,
    userError,
    bookmarksError,
    deleteBookmarkMutation,
    notifications,
    setNotifications,
    audioEnabled,
    setAudioEnabled,
    signOut,
  };
}
