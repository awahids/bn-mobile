import { Award, Brain, Calendar, Flame, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ModuleProgressSummary, WeeklyActivityItem } from "@/app/progress/_hooks/use-progress-page-data";
import { ModuleProgressItem } from "@/app/progress/_components/atoms/module-progress-item";
import { WeeklyActivityDay } from "@/app/progress/_components/atoms/weekly-activity-day";

interface ProgressOverviewTabProps {
  overallProgress: ModuleProgressSummary[];
  quizStats?: any;
  latestQuizAttempt?: any;
  weeklyActivity: WeeklyActivityItem[];
  displayStreak: number;
}

export function ProgressOverviewTab({
  overallProgress,
  quizStats,
  latestQuizAttempt,
  weeklyActivity,
  displayStreak,
}: ProgressOverviewTabProps) {
  return (
    <div className="p-4 pb-24">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Progress Keseluruhan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {overallProgress.map((module) => (
              <ModuleProgressItem key={module.module} module={module} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Statistik Kuis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizStats && quizStats.totalAttempts > 0 ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Quiz General</h4>
                  <p className="text-xs text-muted-foreground">{quizStats.totalAttempts} percobaan</p>
                  {latestQuizAttempt?.completedAt && (
                    <p className="text-xs text-muted-foreground">
                      Terakhir: {new Date(latestQuizAttempt.completedAt).toLocaleDateString("id-ID")}
                    </p>
                  )}
                </div>
                <Badge variant={quizStats.bestScore >= 80 ? "default" : "secondary"}>{quizStats.bestScore}%</Badge>
              </div>
            ) : (
              <div className="text-center py-4">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Belum ada kuis yang diselesaikan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Aktivitas Minggu Ini</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {weeklyActivity.map((day) => (
              <WeeklyActivityDay key={day.day} day={day} />
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Streak saat ini</span>
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{displayStreak} hari</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
