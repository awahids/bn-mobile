"use client";

import { useRouter } from "next/navigation";
import { isApiError } from "@/lib/api-client";
import { AuthError, NetworkError } from "@/components/shared/error-boundary";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { PageLoadingState } from "@/components/shared/page-loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgressPageData } from "@/app/progress/_hooks/use-progress-page-data";
import { ProgressHeader } from "@/app/progress/_components/sections/progress-header";
import { ProgressGuestBanner } from "@/app/progress/_components/sections/progress-guest-banner";
import { ProgressOverviewTab } from "@/app/progress/_components/sections/progress-overview-tab";
import { ProgressAchievementsTab } from "@/app/progress/_components/sections/progress-achievements-tab";
import { ProgressActivityTab } from "@/app/progress/_components/sections/progress-activity-tab";

export function ProgressPageContent() {
  const router = useRouter();
  const {
    status,
    isAuthenticated,
    isGuestMode,
    userError,
    quizStats,
    latestQuizAttempt,
    recentProgress,
    overallProgress,
    achievements,
    weeklyActivity,
    displayStreak,
  } = useProgressPageData();

  if (status === "loading") {
    return <PageLoadingState bottomNav={<BottomNavigation />} />;
  }

  if (isAuthenticated && userError && isApiError(userError) && userError.status === 401) {
    return <AuthError />;
  }

  if (isAuthenticated && userError && isApiError(userError) && userError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />;
  }

  return (
    <MobilePageShell>
      <ProgressHeader streak={displayStreak} onBackHome={() => router.push("/")} />

      <Tabs defaultValue="overview" className="w-full">
        {isGuestMode && <ProgressGuestBanner onLogin={() => router.push("/login?callbackUrl=/progress")} />}

        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="achievements">Prestasi</TabsTrigger>
            <TabsTrigger value="activity">Aktivitas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <ProgressOverviewTab
            overallProgress={overallProgress}
            quizStats={quizStats}
            latestQuizAttempt={latestQuizAttempt}
            weeklyActivity={weeklyActivity}
            displayStreak={displayStreak}
          />
        </TabsContent>

        <TabsContent value="achievements">
          <ProgressAchievementsTab achievements={achievements} />
        </TabsContent>

        <TabsContent value="activity">
          <ProgressActivityTab recentProgress={recentProgress} />
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </MobilePageShell>
  );
}
