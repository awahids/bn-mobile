"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomNavigation } from "@/client/src/components/bottom-navigation";
import { useTheme } from "@/client/src/components/theme-provider";
import { Button } from "@/client/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/src/components/ui/card";
import { Badge } from "@/client/src/components/ui/badge";
import { Switch } from "@/client/src/components/ui/switch";
import { Avatar, AvatarFallback } from "@/client/src/components/ui/avatar";
import { Separator } from "@/client/src/components/ui/separator";
import {
  ArrowLeft,
  User,
  Settings,
  Moon,
  Sun,
  Bell,
  BookOpen,
  Award,
  Languages,
  Volume2,
  Smartphone,
  Info,
  LogOut,
  Edit,
  Flame,
  Calendar,
  Bookmark,
  Trash2
} from "lucide-react";

// API helper function
async function apiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
  return res;
}

export default function Profile() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  const [notifications, setNotifications] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

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

  // User bookmarks
  const { data: bookmarks = [] } = useQuery<Array<{
    id: string;
    userId: string;
    type: string;
    contentId: string;
    note: string | null;
    createdAt: Date;
  }>>({
    queryKey: ["/api/bookmarks"],
  });

  // Update user preferences
  const updatePreferences = useMutation({
    mutationFn: async (preferences: any) => {
      const response = await apiRequest("PATCH", "/api/user", { preferences });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handlePreferenceChange = (key: string, value: any) => {
    updatePreferences.mutate({
      ...user?.preferences,
      [key]: value
    });
  };

  const userStats = [
    {
      label: "Hari Berturut",
      value: user?.streak || 7,
      icon: Flame,
      color: "text-orange-500"
    },
    {
      label: "Total Bookmark",
      value: bookmarks.length,
      icon: BookOpen,
      color: "text-chart-2"
    },
    {
      label: "Progress Harian",
      value: `${user?.dailyProgress || 3}/5`,
      icon: Calendar,
      color: "text-chart-1"
    }
  ];

  const menuItems = [
    {
      title: "Pengaturan Tema",
      description: "Mode gelap/terang",
      icon: theme === 'light' ? Sun : Moon,
      action: (
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          data-testid="theme-toggle"
        />
      )
    },
    {
      title: "Notifikasi",
      description: "Pengingat waktu belajar",
      icon: Bell,
      action: (
        <Switch
          checked={notifications}
          onCheckedChange={(checked: boolean) => {
            setNotifications(checked);
            handlePreferenceChange('notifications', checked);
          }}
          data-testid="notifications-toggle"
        />
      )
    },
    {
      title: "Audio",
      description: "Suara pengucapan dan bacaan",
      icon: Volume2,
      action: (
        <Switch
          checked={audioEnabled}
          onCheckedChange={(checked: boolean) => {
            setAudioEnabled(checked);
            handlePreferenceChange('audio', checked);
          }}
          data-testid="audio-toggle"
        />
      )
    }
  ];

  const aboutItems = [
    {
      title: "Versi Aplikasi",
      description: "1.0.0",
      icon: Smartphone
    },
    {
      title: "Tentang",
      description: "Platform pembelajaran Al-Qur'an",
      icon: Info,
      action: "chevron"
    }
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
              <h1 className="text-lg font-semibold text-foreground">Profil</h1>
              <p className="text-xs text-muted-foreground">Pengaturan akun dan preferensi</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            data-testid="edit-profile"
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 pb-24">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-1">
                  {user?.username || 'User'}
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {user?.email || 'user@example.com'}
                </p>
                <Badge variant="secondary">Pelajar Aktif</Badge>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {userStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks */}
        {bookmarks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bookmark className="w-5 h-5" />
                <span>Bookmark Tersimpan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookmarks.map((bookmark) => {
                const [surahId, ayahNumber] = bookmark.contentId.split(':');
                const isVerse = ayahNumber !== undefined;

                return (
                  <div
                    key={bookmark.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    data-testid={`bookmark-item-${bookmark.id}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-chart-2/20 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-chart-2" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {isVerse ? `Al-Fatihah Ayat ${ayahNumber}` : `Surah ${surahId}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {bookmark.note || (isVerse ? `Ayat ${ayahNumber}` : 'Surah')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(bookmark.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        try {
                          await apiRequest("DELETE", `/api/bookmarks/${bookmark.id}`);
                          queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
                        } catch (error) {
                          console.error('Error deleting bookmark:', error);
                        }
                      }}
                      data-testid={`delete-bookmark-${bookmark.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                );
              })}

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.push('/quran')}
                data-testid="view-all-bookmarks"
              >
                Lihat Al-Qur&apos;an
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Pengaturan</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {item.action}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="w-5 h-5" />
              <span>Preferensi Belajar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pengingat Harian</h3>
                <p className="text-sm text-muted-foreground">Notifikasi untuk belajar rutin</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-play Audio</h3>
                <p className="text-sm text-muted-foreground">Mainkan audio secara otomatis</p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Mode Tantangan</h3>
                <p className="text-sm text-muted-foreground">Kuis dengan waktu terbatas</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tentang Aplikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aboutItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {item.action === "chevron" && (
                    <Button variant="ghost" size="icon">
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Achievements Preview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Prestasi Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🔥</div>
              <div className="flex-1">
                <h3 className="font-medium">Seminggu Berturut</h3>
                <p className="text-sm text-muted-foreground">Belajar 7 hari berturut-turut</p>
              </div>
              <Badge variant="default">Baru</Badge>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push('/progress')}
            >
              Lihat Semua Prestasi
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="border-destructive/20">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              data-testid="sign-out"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar Akun
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
}