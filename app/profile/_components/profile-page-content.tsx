"use client";

import { useRouter } from "next/navigation";
import { isApiError } from "@/lib/api-client";
import { AuthError, NetworkError } from "@/components/shared/error-boundary";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { useTheme } from "@/components/shared/theme-provider";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { PageLoadingState } from "@/components/shared/page-loading-state";
import { useProfilePageData } from "@/app/profile/_hooks/use-profile-page-data";
import { ProfileHeader } from "@/app/profile/_components/sections/profile-header";
import { ProfileSummaryCard } from "@/app/profile/_components/sections/profile-summary-card";
import { ProfileGuestCtaCard } from "@/app/profile/_components/sections/profile-guest-cta-card";
import { ProfileBookmarksCard } from "@/app/profile/_components/sections/profile-bookmarks-card";
import { ProfileSettingsCard } from "@/app/profile/_components/sections/profile-settings-card";
import { ProfileLearningPreferencesCard } from "@/app/profile/_components/sections/profile-learning-preferences-card";
import { ProfileAboutCard } from "@/app/profile/_components/sections/profile-about-card";
import { ProfileAchievementsCard } from "@/app/profile/_components/sections/profile-achievements-card";
import { ProfileSignoutCard } from "@/app/profile/_components/sections/profile-signout-card";

export function ProfilePageContent() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const {
    status,
    isAuthenticated,
    sessionUser,
    user,
    userStats,
    bookmarks,
    userError,
    bookmarksError,
    deleteBookmarkMutation,
    notifications,
    setNotifications,
    audioEnabled,
    setAudioEnabled,
    signOut,
  } = useProfilePageData();

  if (status === "loading") {
    return <PageLoadingState bottomNav={<BottomNavigation />} />;
  }

  if (isAuthenticated && userError && isApiError(userError) && userError.status === 401) {
    return <AuthError />;
  }
  if (isAuthenticated && bookmarksError && isApiError(bookmarksError) && bookmarksError.status === 401) {
    return <AuthError />;
  }

  if (isAuthenticated && userError && isApiError(userError) && userError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />;
  }
  if (isAuthenticated && bookmarksError && isApiError(bookmarksError) && bookmarksError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <MobilePageShell>
      <ProfileHeader isAuthenticated={isAuthenticated} onBackHome={() => router.push("/")} />

      <div className="p-4 pb-32">
        <ProfileSummaryCard
          isAuthenticated={isAuthenticated}
          sessionUser={sessionUser}
          user={user}
          userStats={userStats}
          onLogin={() => router.push("/login?callbackUrl=/profile")}
        />

        {!isAuthenticated && <ProfileGuestCtaCard onLogin={() => router.push("/login?callbackUrl=/profile")} />}

        {isAuthenticated && bookmarks.length > 0 && (
          <ProfileBookmarksCard
            bookmarks={bookmarks}
            isDeleting={deleteBookmarkMutation.isPending}
            onDelete={(bookmarkId) => deleteBookmarkMutation.mutate(bookmarkId)}
            onGoQuran={() => router.push("/quran")}
          />
        )}

        <ProfileSettingsCard
          isAuthenticated={isAuthenticated}
          isDarkTheme={theme === "dark"}
          onToggleTheme={toggleTheme}
          notifications={notifications}
          onChangeNotifications={setNotifications}
          audioEnabled={audioEnabled}
          onChangeAudioEnabled={setAudioEnabled}
        />

        <ProfileLearningPreferencesCard isAuthenticated={isAuthenticated} />

        <ProfileAboutCard />

        {isAuthenticated && <ProfileAchievementsCard onSeeAll={() => router.push("/progress")} />}

        {isAuthenticated && <ProfileSignoutCard onSignOut={handleSignOut} />}
      </div>

      <BottomNavigation />
    </MobilePageShell>
  );
}
