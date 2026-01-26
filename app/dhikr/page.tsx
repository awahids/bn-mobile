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
import { Progress } from "@/components/ui/progress";
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
              <h1 className="text-lg font-semibold text-foreground">
                {timeBasedGreeting}
              </h1>
              <p className="text-xs text-muted-foreground">
                {totalCompleted}/{currentDhikrList.length} Selesai
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right mr-2">
              <div className="text-sm font-medium text-primary">{completionPercentage}%</div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={resetAllCounters}
              data-testid="reset-all"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="p-4 bg-gradient-to-br from-chart-3/10 to-chart-1/10">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {currentSession === 'morning' ? (
                  <Sun className="w-5 h-5 text-chart-3" />
                ) : (
                  <Moon className="w-5 h-5 text-chart-1" />
                )}
                <span className="font-medium">Progress Hari Ini</span>
              </div>
              <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                {totalCompleted}/{currentDhikrList.length}
              </Badge>
            </div>

            <Progress value={completionPercentage} className="h-2 mb-2" />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Mulai dengan Bismillah</span>
              <span>{completionPercentage}% Complete</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Session Tabs */}
      <section className="px-4">
        <Tabs value={currentSession} onValueChange={(value) => setCurrentSession(value as 'morning' | 'evening')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="morning" data-testid="tab-morning">
              <Sun className="w-4 h-4 mr-2" />
              Pagi
            </TabsTrigger>
            <TabsTrigger value="evening" data-testid="tab-evening">
              <Moon className="w-4 h-4 mr-2" />
              Petang
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Dhikr List */}
      <section className="p-4 pb-24">
        <div className="space-y-4">
          {currentDhikrList.map((dhikr) => {
            const counterData = getCounterData(dhikr.id);

            return (
              <Card key={dhikr.id} className={`transition-all ${counterData.completed ? 'bg-chart-3/5 border-chart-3' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{dhikr.transliteration}</CardTitle>
                      {counterData.completed && (
                        <Badge variant="default" className="bg-chart-3">
                          <Check className="w-3 h-3 mr-1" />
                          Selesai
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        playAudio(dhikr.audioUrl || "", dhikr.transliteration);
                        setSelectedDhikr(dhikr.id);
                      }}
                      data-testid={`play-${dhikr.id}`}
                      {...audioPlayerPreload}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Arabic Text */}
                  <div className="arabic-text">
                    <div className="text-xl font-arabic leading-relaxed text-chart-3 mb-2">
                      {dhikr.arabic}
                    </div>
                  </div>

                  {/* Translation */}
                  <div>
                    <p className="text-sm text-foreground mb-1">{dhikr.meaning}</p>
                    {dhikr.reference && (
                      <p className="text-xs text-muted-foreground">{dhikr.reference}</p>
                    )}
                  </div>

                  {/* Counter */}
                  <div {...dhikrCounterPreload}>
                    <LazyDhikrCounter
                      dhikrId={dhikr.id}
                      currentCount={counterData.count}
                      targetCount={counterData.target}
                      onUpdate={(count: number) => handleCounterUpdate(dhikr.id, count)}
                      completed={counterData.completed}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Daily Completion Message */}
        {completionPercentage === 100 && (
          <Card className="mt-6 bg-gradient-to-r from-chart-3/20 to-chart-1/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">🤲</div>
              <h3 className="text-lg font-semibold mb-2">Masha Allah!</h3>
              <p className="text-sm text-muted-foreground">
                Anda telah menyelesaikan dhikr {currentSession === 'morning' ? 'pagi' : 'petang'} hari ini.
                Semoga diberkahi Allah SWT.
              </p>
            </CardContent>
          </Card>
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
