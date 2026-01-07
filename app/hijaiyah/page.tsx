"use client";

import { useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "@/client/src/components/bottom-navigation";
import { ProgressRing } from "@/client/src/components/progress-ring";
import { useProgress, useUpdateProgress } from "@/client/src/hooks/use-progress";
import { useAudio } from "@/client/src/hooks/use-audio";
import { hijaiyahLetters } from "@/client/src/data/hijaiyah";
import { Button } from "@/client/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/src/components/ui/card";
import { Badge } from "@/client/src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/client/src/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  RotateCcw,
  Check,
  Volume2,
  PenTool,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Dynamic imports for heavy components with loading fallbacks
const AudioPlayer = dynamic(
  () => import("@/client/src/components/audio-player").then(mod => ({ default: mod.AudioPlayer })),
  {
    loading: () => <Skeleton className="h-20 w-full" />,
    ssr: false
  }
);

const WritingCanvas = dynamic(
  () => import("@/client/src/components/writing-canvas").then(mod => ({
    default: mod.WritingCanvas
  })),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
    ssr: false
  }
);

// Import the ref type separately since it's needed for typing
import type { WritingCanvasRef } from "@/client/src/components/writing-canvas";

export default function Hijaiyah() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState(hijaiyahLetters[0]);
  const [currentTab, setCurrentTab] = useState("learn");
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [writingCompleted, setWritingCompleted] = useState(false);
  const writingCanvasRef = useRef<WritingCanvasRef>(null);

  const { data: progressData = [] } = useProgress("hijaiyah");
  const updateProgress = useUpdateProgress();
  const audio = useAudio();

  const getLetterProgress = (letterId: string) => {
    const progress = progressData.find(p => p.itemId === letterId);
    return {
      progress: progress?.progress || 0,
      completed: progress?.completed || false,
      score: progress?.score || 0
    };
  };

  const handleLetterComplete = async (letterId: string, score: number = 100) => {
    await updateProgress.mutateAsync({
      module: "hijaiyah",
      itemId: letterId,
      userId: "default-user",
      progress: 100,
      completed: true,
      score,
      timeSpent: 0
    });
  };

  const playAudio = (audioUrl: string) => {
    audio.play(audioUrl);
    setAudioPlayerVisible(true);
  };

  const navigateToLetter = (direction: 'prev' | 'next') => {
    const currentIndex = hijaiyahLetters.findIndex(l => l.id === selectedLetter.id);
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedLetter(hijaiyahLetters[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < hijaiyahLetters.length - 1) {
      setSelectedLetter(hijaiyahLetters[currentIndex + 1]);
    }
    setWritingCompleted(false);
  };

  const letterProgress = getLetterProgress(selectedLetter.id);
  const completedCount = progressData.filter(p => p.completed).length;
  const overallProgress = Math.round((completedCount / hijaiyahLetters.length) * 100);

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
              <h1 className="text-lg font-semibold text-foreground">Huruf Hijaiyah</h1>
              <p className="text-xs text-muted-foreground">{completedCount}/28 Huruf</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ProgressRing progress={overallProgress} size={40} className="text-chart-1" />
            <span className="text-sm font-medium text-chart-1">{overallProgress}%</span>
          </div>
        </div>
      </header>

      {/* Letter Grid View */}
      {currentTab === "overview" && (
        <section className="p-4 pb-24">
          <div className="grid grid-cols-4 gap-3">
            {hijaiyahLetters.map((letter) => {
              const progress = getLetterProgress(letter.id);
              return (
                <Card
                  key={letter.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${selectedLetter.id === letter.id ? 'ring-2 ring-primary' : ''
                    }`}
                  onClick={() => {
                    setSelectedLetter(letter);
                    setCurrentTab("learn");
                  }}
                  data-testid={`letter-${letter.id}`}
                >
                  <CardContent className="p-3 text-center relative">
                    {progress.completed && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-chart-1 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="text-3xl font-arabic mb-2 text-chart-1">
                      {letter.arabic}
                    </div>
                    <div className="text-xs font-medium text-foreground mb-1">
                      {letter.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {letter.transliteration}
                    </div>
                    {progress.progress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-1">
                          <div
                            className="bg-chart-1 h-1 rounded-full transition-all"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Detailed Letter View */}
      {currentTab === "learn" && (
        <section className="p-4 pb-24">
          {/* Letter Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToLetter('prev')}
              disabled={selectedLetter.order === 1}
              data-testid="prev-letter"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                Huruf {selectedLetter.order}/28
              </div>
              <Badge variant="secondary">{selectedLetter.name}</Badge>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToLetter('next')}
              disabled={selectedLetter.order === 28}
              data-testid="next-letter"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Letter Display */}
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-8xl font-arabic mb-4 text-chart-1">
                {selectedLetter.arabic}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedLetter.name}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {selectedLetter.transliteration} - {selectedLetter.pronunciation}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedLetter.description}
              </p>

              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => playAudio(selectedLetter.audioUrl)}
                  className="flex items-center space-x-2"
                  data-testid="play-pronunciation"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dengar Pengucapan</span>
                </Button>

                {letterProgress.completed && (
                  <Badge variant="default" className="bg-chart-1">
                    <Check className="w-3 h-3 mr-1" />
                    Selesai
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Learning Tabs */}
          <Tabs defaultValue="writing" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="writing">
                <PenTool className="w-4 h-4 mr-2" />
                Menulis
              </TabsTrigger>
              <TabsTrigger value="steps">
                <BookOpen className="w-4 h-4 mr-2" />
                Langkah
              </TabsTrigger>
            </TabsList>

            <TabsContent value="writing" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Latihan Menulis</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gunakan jari Anda untuk menulis huruf {selectedLetter.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <WritingCanvas
                    ref={writingCanvasRef}
                    letter={selectedLetter}
                    onComplete={() => {
                      setWritingCompleted(true);
                      if (!letterProgress.completed) {
                        handleLetterComplete(selectedLetter.id, 85);
                      }
                    }}
                    completed={writingCompleted}
                  />

                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWritingCompleted(false);
                        writingCanvasRef.current?.clearCanvas();
                      }}
                      data-testid="reset-writing"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Ulangi
                    </Button>

                    {writingCompleted && (
                      <Badge variant="default" className="bg-chart-2">
                        <Check className="w-3 h-3 mr-1" />
                        Bagus!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="steps" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cara Menulis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedLetter.writingSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm text-foreground flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      )}

      {/* Quick Switch Tabs */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex bg-card border border-border rounded-full p-1 shadow-lg">
          <Button
            variant={currentTab === "learn" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentTab("learn")}
            className="rounded-full"
            data-testid="tab-learn"
          >
            Belajar
          </Button>
          <Button
            variant={currentTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentTab("overview")}
            className="rounded-full"
            data-testid="tab-overview"
          >
            Semua Huruf
          </Button>
        </div>
      </div>

      {/* Audio Player */}
      {audioPlayerVisible && (
        <AudioPlayer
          title={`Huruf ${selectedLetter.name}`}
          subtitle={selectedLetter.pronunciation}
          audioUrl={selectedLetter.audioUrl}
          isVisible={audioPlayerVisible}
          onClose={() => setAudioPlayerVisible(false)}
          isPlaying={audio.isPlaying}
          currentTime={audio.currentTime}
          duration={audio.duration}
          volume={audio.volume}
          isLoading={audio.isLoading}
          error={audio.error}
          onPlay={() => audio.play(selectedLetter.audioUrl)}
          onPause={() => audio.pause()}
          onSeek={(time) => audio.seek(time)}
          onVolumeChange={(vol) => audio.setVolume(vol)}
        />
      )}

      <BottomNavigation />
    </div>
  );
}