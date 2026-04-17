"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isApiError } from "@/lib/api-client";
import { NetworkError, AuthError } from "@/components/error-boundary";
import { LazyBottomNavigation, LazyAudioPlayer, LazyDhikrCounter, preloadComponents } from "@/components/lazy";
import { useAudio } from "@/hooks/use-audio";
import { dhikrData, getMorningDhikr, getEveningDhikr } from "@/data/dhikr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/progress-ring";
import { usePreloadOnHover } from "@/lib/lazy-loading";
import {
  ArrowLeft,
  Sun,
  Moon,
  Volume2,
  RotateCcw,
  Check,
  Clock
} from "lucide-react";


export default function Dhikr() {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<'morning' | 'evening'>('morning');
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [selectedDhikr, setSelectedDhikr] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const audio = useAudio();

  // Preload heavy components on hover
  const audioPlayerPreload = usePreloadOnHover(preloadComponents.audioPlayer);
  const dhikrCounterPreload = usePreloadOnHover(preloadComponents.dhikrCounter);

  // Get today's date - use state to avoid hydration mismatch
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0]);
  }, []);

  // Get dhikr counters for today
  const {
    data: counters = [],
    isLoading: countersLoading,
    error: countersError
  } = useQuery({
    queryKey: ['dhikr-counters', today],
    queryFn: () => api.dhikr.getCounters(today),
    enabled: !!today,
    retry: false
  });

  // Update dhikr counter mutation
  const updateCounter = useMutation({
    mutationFn: (data: any) => api.dhikr.updateCounter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dhikr-counters', today] });
    },
    onError: (error) => {
      console.error('🚨 Dhikr counter update failed:', error);
    }
  });

  // Determine current session based on time
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const now = new Date();
    const hour = now.getHours();

    // Morning: 6 AM - 12 PM, Evening: 3 PM - 7 PM
    if (hour >= 6 && hour < 12) {
      setCurrentSession('morning');
    } else if (hour >= 15 && hour < 19) {
      setCurrentSession('evening');
    }
  }, []);

  const getCurrentDhikr = () => {
    return currentSession === 'morning' ? getMorningDhikr() : getEveningDhikr();
  };

  const getCounterData = (dhikrId: string) => {
    const counter = counters.find((c: any) =>
      c.dhikrId === dhikrId &&
      c.session === currentSession &&
      c.date === today
    );

    return {
      count: counter?.count || 0,
      completed: counter?.completed || false,
      target: counter?.target || dhikrData.find(d => d.id === dhikrId)?.count || 33
    };
  };

  const handleCounterUpdate = async (dhikrId: string, newCount: number) => {
    const dhikr = dhikrData.find(d => d.id === dhikrId);
    if (!dhikr) return;

    await updateCounter.mutateAsync({
      dhikrId,
      count: newCount,
      target: dhikr.count,
      date: today,
      session: currentSession,
      completed: newCount >= dhikr.count
    });
  };

  const resetAllCounters = async () => {
    const currentDhikr = getCurrentDhikr();
    for (const dhikr of currentDhikr) {
      await handleCounterUpdate(dhikr.id, 0);
    }
  };

  const playAudio = (audioUrl: string, title: string) => {
    if (audioUrl) {
      audio.play(audioUrl);
      setAudioPlayerVisible(true);
    }
  };

  const currentDhikrList = getCurrentDhikr();
  const totalCompleted = currentDhikrList.filter(dhikr =>
    getCounterData(dhikr.id).completed
  ).length;
  const completionPercentage = Math.round((totalCompleted / currentDhikrList.length) * 100);

  const [timeBasedGreeting, setTimeBasedGreeting] = useState("Dhikr Pagi");

  const getTimeBasedGreeting = () => {
    if (typeof window === 'undefined') return "Dhikr Pagi";

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Dhikr Pagi";
    if (hour >= 12 && hour < 18) return "Dhikr Siang";
    if (hour >= 18 && hour < 24) return "Dhikr Petang";
    return "Dhikr Malam";
  };

  useEffect(() => {
    setTimeBasedGreeting(getTimeBasedGreeting());
  }, []);

  // Handle authentication errors
  if (countersError && isApiError(countersError) && countersError.status === 401) {
    return <AuthError />
  }

  // Handle network errors
  if (countersError && isApiError(countersError) && countersError.status === 0) {
    return <NetworkError onRetry={() => window.location.reload()} />
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top overflow-x-hidden">
      {/* Immersive Header */}
      <header className="sticky top-0 z-50 glass border-b border-primary/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/')}
              className="rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors"
              data-testid="back-home"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight">
                {timeBasedGreeting}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  {totalCompleted}/{currentDhikrList.length} SELESAI
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <ProgressRing
                progress={completionPercentage}
                size={40}
                strokeWidth={3}
                className="text-primary opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primary">
                {completionPercentage}%
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetAllCounters}
              className="rounded-2xl bg-accent/5 hover:bg-accent/10 transition-colors"
              data-testid="reset-all"
            >
              <RotateCcw className="w-4 h-4 text-accent" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Overview Hero */}
      <section className="relative pt-8 pb-12 px-6 mesh-gradient rounded-b-[3rem] shadow-xl shadow-primary/5 mb-8">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm animate-float">
                {currentSession === 'morning' ? (
                  <Sun className="w-6 h-6 text-chart-3" />
                ) : (
                  <Moon className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground leading-none mb-1">Dzikir {currentSession === 'morning' ? 'Pagi' : 'Petang'}</h2>
                <p className="text-xs font-medium text-muted-foreground">Kumpulkan pahala hari ini</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-primary">{totalCompleted}</span>
              <span className="text-xs font-bold text-muted-foreground">/{currentDhikrList.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-background/30 backdrop-blur-sm h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
              <span>Bismillah</span>
              <span>Alhamdulillah</span>
            </div>
          </div>
        </div>

        {/* Decorations */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </section>

      {/* Session Management */}
      <section className="px-6 mb-8">
        <Tabs
          value={currentSession}
          onValueChange={(value) => setCurrentSession(value as 'morning' | 'evening')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 rounded-3xl bg-primary/5 p-1.5 h-auto">
            <TabsTrigger
              value="morning"
              className="rounded-2xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg shadow-primary/5 transition-all duration-300"
              data-testid="tab-morning"
            >
              <Sun className="w-4 h-4 mr-2" />
              <span className="font-bold tracking-tight">Pagi</span>
            </TabsTrigger>
            <TabsTrigger
              value="evening"
              className="rounded-2xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg shadow-primary/5 transition-all duration-300"
              data-testid="tab-evening"
            >
              <Moon className="w-4 h-4 mr-2" />
              <span className="font-bold tracking-tight">Petang</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Dhikr List */}
      <section className="px-6 pb-32">
        <div className="space-y-6">
          {currentDhikrList.map((dhikr, index) => {
            const counterData = getCounterData(dhikr.id);

            return (
              <Card
                key={dhikr.id}
                className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 border-none shadow-sm ${counterData.completed
                    ? 'bg-primary shadow-xl shadow-primary/20 scale-[0.98]'
                    : 'glass hover:shadow-lg hover:shadow-primary/5'
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${counterData.completed ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                          }`}>
                          DZIKIR {index + 1}
                        </span>
                        {counterData.completed && (
                          <div className="flex h-5 w-5 rounded-full bg-white items-center justify-center p-1">
                            <Check className="w-full h-full text-primary" />
                          </div>
                        )}
                      </div>
                      <h3 className={`text-xl font-bold leading-tight ${counterData.completed ? 'text-white' : 'text-foreground'
                        }`}>
                        {dhikr.transliteration}
                      </h3>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        playAudio(dhikr.audioUrl || "", dhikr.transliteration);
                        setSelectedDhikr(dhikr.id);
                      }}
                      className={`rounded-2xl ${counterData.completed ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-primary/10 hover:bg-primary/20 text-primary'
                        }`}
                      data-testid={`play-${dhikr.id}`}
                      {...audioPlayerPreload}
                    >
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Arabic Text Display */}
                  <div className="relative mb-8 text-center py-4 bg-white/5 rounded-3xl backdrop-blur-sm shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                    <div className={`text-3xl font-arabic leading-relaxed text-right p-4 ${counterData.completed ? 'text-white' : 'text-primary'
                      }`} dir="rtl">
                      {dhikr.arabic}
                    </div>
                  </div>

                  {/* Meaning & Reference */}
                  <div className="space-y-4 mb-8">
                    <p className={`text-sm font-medium leading-relaxed ${counterData.completed ? 'text-white/90' : 'text-foreground/80'
                      }`}>
                      &quot;{dhikr.meaning}&quot;
                    </p>
                    {dhikr.reference && (
                      <div className={`flex items-start space-x-2 text-[10px] font-bold italic uppercase tracking-wider ${counterData.completed ? 'text-white/60' : 'text-muted-foreground'
                        }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0" />
                        <span>{dhikr.reference}</span>
                      </div>
                    )}
                  </div>

                  {/* High Tactile Counter */}
                  <div {...dhikrCounterPreload}>
                    <LazyDhikrCounter
                      dhikrId={dhikr.id}
                      currentCount={counterData.count}
                      targetCount={counterData.target}
                      onUpdate={(count: number) => handleCounterUpdate(dhikr.id, count)}
                      completed={counterData.completed}
                    />
                  </div>
                </div>

                {/* Status Decoration */}
                {counterData.completed && (
                  <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                )}
              </Card>
            );
          })}
        </div>

        {/* Celebration Achievement Card */}
        {completionPercentage === 100 && (
          <div className="mt-12 group">
            <div className="glass p-10 rounded-[3rem] text-center relative overflow-hidden transition-all duration-500 hover:scale-[1.02] border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 p-4 shadow-inner group-hover:animate-float">
                  <span className="text-4xl">🤲</span>
                </div>
                <h3 className="text-2xl font-black text-foreground mb-3">Masha Allah!</h3>
                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                  Luar biasa. Anda telah menyelesaikan seluruh rangkaian dzikir untuk sesi ini.
                  <span className="block mt-2 text-primary font-bold">Semoga istiqomah selalu.</span>
                </p>
              </div>
              <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        )}
      </section>

      {/* Audio Player */}
      <LazyAudioPlayer
        title={selectedDhikr ? dhikrData.find(d => d.id === selectedDhikr)?.transliteration || "" : ""}
        subtitle="Dhikr Audio"
        audioUrl={selectedDhikr ? dhikrData.find(d => d.id === selectedDhikr)?.audioUrl || "" : ""}
        isVisible={audioPlayerVisible}
        onClose={() => setAudioPlayerVisible(false)}
        isPlaying={audio.isPlaying}
        currentTime={audio.currentTime}
        duration={audio.duration}
        volume={audio.volume}
        isLoading={audio.isLoading}
        error={audio.error}
        onPlay={() => audio.play()}
        onPause={audio.pause}
        onSeek={audio.seek}
        onVolumeChange={audio.setVolume}
      />

      <LazyBottomNavigation />
    </div>
  );
}
