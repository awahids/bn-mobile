"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/client/src/components/bottom-navigation";
import { ProgressRing } from "@/client/src/components/progress-ring";
import { useProgressStats } from "@/client/src/hooks/use-progress";
import { Button } from "@/client/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/src/components/ui/card";
import { Badge } from "@/client/src/components/ui/badge";
import { Separator } from "@/client/src/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/src/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  Languages,
  BicepsFlexed,
  Brain,
  Clock,
  Target,
  Flame
} from "lucide-react";

export default function Progress() {
  const router = useRouter();
  const stats = useProgressStats();

  // User data
  const { data: user } = useQuery<{
    id: string;
    username: string;
    email: string;
    streak: number;
    dailyProgress: number;
    lastActive: Date;
    preferences: Record<string, any>;
  }>({
    queryKey: ["/api/user"],
  });

  // Quiz stats
  const { data: quizStats = [] } = useQuery<Array<{
    category: string;
    bestScore: number;
    attempts: number;
  }>>({
    queryKey: ["/api/quiz/stats"],
  });

  // Recent progress
  const { data: recentProgress = [] } = useQuery<Array<{
    id: string;
    userId: string;
    module: string;
    itemId: string;
    progress: number;
    completed: boolean;
    score: number;
    timeSpent: number;
    lastAccessed: Date;
  }>>({
    queryKey: ["/api/progress"],
  });

  const overallProgress = [
    {
      module: "Hijaiyah",
      icon: Languages,
      progress: stats.hijaiyah.progress,
      completed: stats.hijaiyah.completed,
      total: stats.hijaiyah.total,
      color: "chart-1"
    },
    {
      module: "Al-Qur'an",
      icon: BookOpen,
      progress: Math.round((stats.quran.bookmarked / stats.quran.total) * 100),
      completed: stats.quran.bookmarked,
      total: stats.quran.total,
      color: "chart-2"
    },
    {
      module: "Dhikr",
      icon: BicepsFlexed,
      progress: stats.dhikr.todayCount > 0 ? 100 : 0,
      completed: stats.dhikr.todayCount,
      total: 7,
      color: "chart-3"
    },
    {
      module: "Kuis",
      icon: Brain,
      progress: stats.quiz.bestScore,
      completed: stats.quiz.attempts,
      total: 100,
      color: "chart-4"
    }
  ];

  const achievements = [
    {
      id: "first-letter",
      title: "Huruf Pertama",
      description: "Selesaikan huruf Hijaiyah pertama",
      icon: "🔤",
      unlocked: stats.hijaiyah.completed > 0,
      date: "2 hari lalu"
    },
    {
      id: "week-streak",
      title: "Seminggu Berturut",
      description: "Belajar 7 hari berturut-turut",
      icon: "🔥",
      unlocked: (user?.streak || 0) >= 7,
      date: "Hari ini"
    },
    {
      id: "quiz-master",
      title: "Master Kuis",
      description: "Dapatkan skor 90% atau lebih",
      icon: "🏆",
      unlocked: stats.quiz.bestScore >= 90,
      date: "1 hari lalu"
    },
    {
      id: "dhikr-complete",
      title: "Dhikr Lengkap",
      description: "Selesaikan dhikr pagi dan petang",
      icon: "🤲",
      unlocked: false,
      date: null
    }
  ];

  const weeklyActivity = [
    { day: "Sen", completed: true },
    { day: "Sel", completed: true },
    { day: "Rab", completed: false },
    { day: "Kam", completed: true },
    { day: "Jum", completed: true },
    { day: "Sab", completed: false },
    { day: "Min", completed: true }
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              data-testid="back-home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Progress Belajar</h1>
              <p className="text-xs text-muted-foreground">Statistik pembelajaran Anda</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-lg font-bold text-orange-500">{user?.streak || 7}</span>
          </div>
        </div>
      </header>

      <Tabs defaultValue="overview" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="achievements">Prestasi</TabsTrigger>
            <TabsTrigger value="activity">Aktivitas</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="p-4 pb-24">
          {/* Overall Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Progress Keseluruhan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {overallProgress.map((module) => {
                  const IconComponent = module.icon;
                  return (
                    <div key={module.module} className="text-center">
                      <div className={`w-12 h-12 bg-${module.color}/20 rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className={`w-6 h-6 text-${module.color}`} />
                      </div>
                      <h4 className="font-medium text-sm mb-1">{module.module}</h4>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <ProgressRing
                          progress={module.progress}
                          size={32}
                          className={`text-${module.color}`}
                        />
                        <span className="text-xs font-medium">{module.progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {module.completed}/{module.total}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quiz Statistics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Statistik Kuis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizStats.length > 0 ? quizStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium capitalize">{stat.category}</h4>
                      <p className="text-xs text-muted-foreground">{stat.attempts} percobaan</p>
                    </div>
                    <Badge variant={stat.bestScore >= 80 ? "default" : "secondary"}>
                      {stat.bestScore}%
                    </Badge>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Belum ada kuis yang diselesaikan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Aktivitas Minggu Ini</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{day.day}</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${day.completed
                      ? 'bg-chart-1 text-white'
                      : 'bg-muted text-muted-foreground'
                      }`}>
                      {day.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Streak saat ini</span>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{user?.streak || 7} hari</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="p-4 pb-24">
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.unlocked ? 'bg-chart-1/5 border-chart-1' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.unlocked ? (
                        <Badge variant="default" className="bg-chart-1">
                          <Award className="w-3 h-3 mr-1" />
                          Terbuka • {achievement.date}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Terkunci</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="p-4 pb-24">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProgress.length > 0 ? recentProgress
                  .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
                  .slice(0, 10)
                  .map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        {item.module === 'hijaiyah' && <Languages className="w-4 h-4 text-chart-1" />}
                        {item.module === 'quran' && <BookOpen className="w-4 h-4 text-chart-2" />}
                        {item.module === 'dhikr' && <BicepsFlexed className="w-4 h-4 text-chart-3" />}
                        {item.module === 'quiz' && <Brain className="w-4 h-4 text-chart-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium capitalize">
                          {item.module} - {item.itemId}
                        </p>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.lastAccessed).toLocaleDateString('id-ID')}
                          </p>
                          {item.completed && (
                            <Badge variant="secondary" className="text-xs">Selesai</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.progress}%</div>
                        {item.score > 0 && (
                          <div className="text-xs text-muted-foreground">Skor: {item.score}</div>
                        )}
                      </div>
                    </div>
                  )) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Belum ada aktivitas belajar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
}