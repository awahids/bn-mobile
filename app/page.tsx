"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "@/client/src/components/bottom-navigation";
import { ProgressRing } from "@/client/src/components/progress-ring";
import { useTheme } from "@/client/src/components/theme-provider";
import { useProgressStats } from "@/client/src/hooks/use-progress";
import { Button } from "@/client/src/components/ui/button";
import { Card, CardContent } from "@/client/src/components/ui/card";
import {
  Moon,
  Sun,
  Bell,
  Play,
  Headphones,
  BookOpen,
  BicepsFlexed,
  Brain,
  Languages,
  Bookmark,
  Trophy,
  Check,
  Star
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const stats = useProgressStats();

  // Prayer times query
  const { data: prayerTimes } = useQuery<{
    date: string;
    location: string;
    times: {
      fajr: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    };
  }>({
    queryKey: ["/api/prayer-times"],
  });

  // User data query
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

  const getCurrentPrayerInfo = () => {
    if (!prayerTimes) return { next: "Dhuhur", timeLeft: "2h 15m" };

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const times = prayerTimes.times;
    const prayerList = [
      { name: "Subuh", time: times.fajr },
      { name: "Dhuhur", time: times.dhuhr },
      { name: "Ashar", time: times.asr },
      { name: "Maghrib", time: times.maghrib },
      { name: "Isya", time: times.isha }
    ];

    // Find next prayer (simplified logic)
    return { next: "Dhuhur", timeLeft: "2h 15m" };
  };

  const { next: nextPrayer, timeLeft } = getCurrentPrayerInfo();

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Moon className="text-primary-foreground w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Belajar Ngaji</h1>
              <p className="text-xs text-muted-foreground">Assalamu&apos;alaikum</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
              data-testid="toggle-theme"
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              data-testid="notifications"
            >
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">Selamat Pagi</h2>
                <p className="text-sm text-muted-foreground">Mari lanjutkan pembelajaran hari ini</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary" data-testid="user-streak">
                  {user?.streak || 7}
                </div>
                <div className="text-xs text-muted-foreground">Hari berturut</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress Harian</span>
                <span className="text-primary font-medium" data-testid="daily-progress">
                  {user?.dailyProgress || 3}/5
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full progress-animate"
                  style={{ width: `${((user?.dailyProgress || 3) / 5) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Modul Pembelajaran</h3>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Hijaiyah Module */}
          <Card
            className="card-hover cursor-pointer"
            onClick={() => router.push('/hijaiyah')}
            data-testid="module-hijaiyah"
          >
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-chart-1/20 rounded-xl flex items-center justify-center mb-3">
                <Languages className="text-chart-1 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-1">Hijaiyah</h4>
              <p className="text-xs text-muted-foreground mb-2">28 Huruf Arab</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-chart-1 font-medium">
                  {stats.hijaiyah.completed}/{stats.hijaiyah.total}
                </div>
                <ProgressRing
                  progress={stats.hijaiyah.progress}
                  size={32}
                  className="text-chart-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Al-Quran Module */}
          <Card
            className="card-hover cursor-pointer"
            onClick={() => router.push('/quran')}
            data-testid="module-quran"
          >
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-chart-2/20 rounded-xl flex items-center justify-center mb-3">
                <BookOpen className="text-chart-2 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-1">Al-Qur&apos;an</h4>
              <p className="text-xs text-muted-foreground mb-2">114 Surah</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-chart-2 font-medium">Surah Al-Fatihah</div>
                <div className="w-6 h-6 bg-chart-2 rounded-full flex items-center justify-center">
                  <Bookmark className="text-white w-3 h-3" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dhikr Module */}
          <Card
            className="card-hover cursor-pointer"
            onClick={() => router.push('/dhikr')}
            data-testid="module-dhikr"
          >
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-chart-3/20 rounded-xl flex items-center justify-center mb-3">
                <BicepsFlexed className="text-chart-3 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-1">Dhikr</h4>
              <p className="text-xs text-muted-foreground mb-2">Pagi & Petang</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-chart-3 font-medium">33x</div>
                <ProgressRing
                  progress={66}
                  size={32}
                  className="text-chart-3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quiz Module */}
          <Card
            className="card-hover cursor-pointer"
            onClick={() => router.push('/quiz')}
            data-testid="module-quiz"
          >
            <CardContent className="p-4">
              <div className="w-12 h-12 bg-chart-4/20 rounded-xl flex items-center justify-center mb-3">
                <Brain className="text-chart-4 w-6 h-6" />
              </div>
              <h4 className="font-semibold text-card-foreground mb-1">Kuis</h4>
              <p className="text-xs text-muted-foreground mb-2">4 Kategori</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-chart-4 font-medium">Skor: 85%</div>
                <div className="w-6 h-6 bg-chart-4 rounded-full flex items-center justify-center">
                  <Trophy className="text-white w-3 h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Continue Learning */}
      <section className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Lanjutkan Belajar</h3>
          <Button variant="ghost" size="sm" className="text-primary">
            Lihat Semua
          </Button>
        </div>

        <div className="space-y-3">
          {/* Continue Hijaiyah */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-1 to-chart-1/80 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-arabic font-bold">ب</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-card-foreground mb-1">Huruf Ba (ب)</h4>
                  <p className="text-sm text-muted-foreground mb-2">Pelajari cara menulis dan pengucapan</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-chart-1 h-2 rounded-full" style={{ width: '45%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">45%</span>
                  </div>
                </div>
                <Button size="icon" className="rounded-full">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Continue Al-Quran */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-2 to-chart-2/80 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-card-foreground mb-1">Al-Fatihah</h4>
                  <p className="text-sm text-muted-foreground mb-2">Ayat 3 dari 7</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div className="bg-chart-2 h-2 rounded-full" style={{ width: '43%' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">3/7</span>
                  </div>
                </div>
                <Button size="icon" className="rounded-full">
                  <Headphones className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Aktivitas Terbaru</h3>

        <div className="space-y-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-1/20 rounded-full flex items-center justify-center">
                  <Check className="text-chart-1 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Menyelesaikan Huruf Alif</p>
                  <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-3/20 rounded-full flex items-center justify-center">
                  <BicepsFlexed className="text-chart-3 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Dhikr Pagi - 33x Tasbih</p>
                  <p className="text-xs text-muted-foreground">Hari ini, 06:30</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-chart-4/20 rounded-full flex items-center justify-center">
                  <Brain className="text-chart-4 w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Kuis Hijaiyah - Skor 90%</p>
                  <p className="text-xs text-muted-foreground">Kemarin, 19:45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Prayer Times */}
      <section className="p-4 pb-24">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Waktu Shalat</h3>
              <span className="text-xs text-muted-foreground">
                {prayerTimes?.location || "Jakarta"}
              </span>
            </div>

            {prayerTimes && (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Subuh</div>
                  <div className="text-sm font-semibold text-foreground">
                    {prayerTimes.times.fajr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Dhuhur</div>
                  <div className="text-sm font-semibold text-primary">
                    {prayerTimes.times.dhuhr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Ashar</div>
                  <div className="text-sm font-semibold text-foreground">
                    {prayerTimes.times.asr}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Maghrib</div>
                  <div className="text-sm font-semibold text-foreground">
                    {prayerTimes.times.maghrib}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Isya</div>
                  <div className="text-sm font-semibold text-foreground">
                    {prayerTimes.times.isha}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Selanjutnya</div>
                  <div className="text-xs font-medium text-primary">{timeLeft}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <BottomNavigation />
    </div>
  );
}