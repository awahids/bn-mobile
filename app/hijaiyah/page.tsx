"use client";

import { useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { LazyBottomNavigation, LazyProgressRing, LazyAudioPlayer, LazyWritingCanvas, preloadComponents } from "@/components/lazy";
import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { useAudio } from "@/hooks/use-audio";
import { hijaiyahLetters } from "@/data/hijaiyah";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreloadOnHover } from "@/lib/lazy-loading";
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
import { motion } from "framer-motion";

// Import the ref type separately since it's needed for typing
import type { WritingCanvasRef } from "@/components/writing-canvas";

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

  // Preload heavy components on hover
  const audioPlayerPreload = usePreloadOnHover(preloadComponents.audioPlayer);
  const writingCanvasPreload = usePreloadOnHover(preloadComponents.writingCanvas);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

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
              <h1 className="text-xl font-black text-foreground tracking-tight">Huruf Hijaiyah</h1>
              <div className="flex items-center space-x-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{completedCount}/28 HURUF SELESAI</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <LazyProgressRing
                progress={overallProgress}
                size={40}
                className="text-primary opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-primary">
                {overallProgress}%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section (Mesh Gradient) */}
      <section className="relative pt-4 pb-8 px-6 mesh-gradient rounded-b-[3rem] shadow-xl shadow-primary/5 mb-6">
        <div className="relative z-10 p-6 bg-white/20 backdrop-blur-md rounded-[2.5rem] border border-white/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Progres Belajar</h2>
              <p className="text-xs font-medium text-muted-foreground">Lanjutkan langkahmu hari ini</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-2xl">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Letter Grid View */}
      {currentTab === "overview" && (
        <section className="px-6 pb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="grid grid-cols-4 gap-4">
              {hijaiyahLetters.map((letter) => {
                const progress = getLetterProgress(letter.id);
                return (
                  <motion.div key={letter.id} variants={itemVariants}>
                    <Card
                      className={`group relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-300 border-primary/5 hover:shadow-xl hover:shadow-primary/5 active:scale-95 ${selectedLetter.id === letter.id ? 'ring-2 ring-primary shadow-lg' : 'glass'
                        }`}
                      onClick={() => {
                        setSelectedLetter(letter);
                        setCurrentTab("learn");
                      }}
                      data-testid={`letter-${letter.id}`}
                    >
                      <CardContent className="p-4 text-center relative flex flex-col items-center">
                        {progress.completed && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center p-1 shadow-sm">
                            <Check className="w-full h-full text-white" />
                          </div>
                        )}
                        <div className="text-3xl font-arabic mb-2 text-primary group-hover:scale-110 transition-transform duration-300">
                          {letter.arabic}
                        </div>
                        <div className="text-[10px] font-black text-foreground mb-0.5 truncate w-full uppercase tracking-tighter">
                          {letter.name}
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                          {letter.transliteration}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}


      {/* Detailed Letter View */}
      {currentTab === "learn" && (
        <section className="px-6 pb-40">
          {/* Letter Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateToLetter('prev')}
              disabled={selectedLetter.order === 1}
              className="rounded-2xl bg-primary/5"
              data-testid="prev-letter"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </Button>

            <div className="text-center">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">
                Huruf {selectedLetter.order}/28
              </div>
              <div className="px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-xs font-black text-primary uppercase tracking-tight">{selectedLetter.name}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateToLetter('next')}
              disabled={selectedLetter.order === 28}
              className="rounded-2xl bg-primary/5"
              data-testid="next-letter"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </Button>
          </div>

          {/* Main Letter Display Card */}
          <div className="group relative mb-8">
            <div className="glass p-10 rounded-[3rem] text-center relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
              <div className="relative z-10">
                <motion.div
                  key={selectedLetter.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="text-9xl font-arabic mb-6 text-primary drop-shadow-sm animate-float">
                    {selectedLetter.arabic}
                  </div>
                </motion.div>
                <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
                  {selectedLetter.name}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  <Badge variant="secondary" className="rounded-xl px-3 py-1 bg-primary/5 text-primary border-primary/10 font-bold uppercase tracking-widest text-[10px]">
                    {selectedLetter.transliteration}
                  </Badge>
                  <Badge variant="secondary" className="rounded-xl px-3 py-1 bg-accent/5 text-accent border-accent/10 font-bold uppercase tracking-widest text-[10px]">
                    {selectedLetter.pronunciation}
                  </Badge>
                </div>

                <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8 max-w-[240px] mx-auto italic">
                  &quot;{selectedLetter.description}&quot;
                </p>

                <div className="flex flex-col space-y-3">
                  <Button
                    onClick={() => playAudio(selectedLetter.audioUrl)}
                    className="w-full rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-14 font-black uppercase tracking-widest text-xs"
                    data-testid="play-pronunciation"
                    {...audioPlayerPreload}
                  >
                    <Volume2 className="w-5 h-5 mr-2" />
                    <span>Dengar Suara</span>
                  </Button>

                  {letterProgress.completed && (
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center p-1">
                        <Check className="w-full h-full" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Selesai Dipelajari</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorations */}
              <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Learning Tabs */}
          <Tabs defaultValue="writing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-3xl bg-primary/5 p-1.5 h-auto mb-6">
              <TabsTrigger
                value="writing"
                className="rounded-2xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg shadow-primary/5 transition-all duration-300"
              >
                <PenTool className="w-4 h-4 mr-2" />
                <span className="font-bold tracking-tight">Menulis</span>
              </TabsTrigger>
              <TabsTrigger
                value="steps"
                className="rounded-2xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg shadow-primary/5 transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="font-bold tracking-tight">Panduan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="writing" className="mt-0 outline-none">
              <div className="glass rounded-[2.5rem] p-6 border-primary/10">
                <div className="mb-6">
                  <h3 className="text-lg font-black text-foreground tracking-tight">Latihan Menulis</h3>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                    Ikuti pola huruf di bawah ini
                  </p>
                </div>

                <div className="relative group/canvas">
                  <LazyWritingCanvas
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

                  {/* Canvas Shadow Effect */}
                  <div className="absolute -inset-2 bg-primary/5 rounded-[2rem] -z-10 group-hover/canvas:bg-primary/10 transition-colors duration-500" />
                </div>

                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setWritingCompleted(false);
                      writingCanvasRef.current?.clearCanvas();
                    }}
                    className="rounded-2xl bg-accent/5 hover:bg-accent/10 text-accent font-bold uppercase tracking-widest text-[10px]"
                    data-testid="reset-writing"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                    Ulangi
                  </Button>

                  {writingCompleted && (
                    <div className="flex items-center space-x-2 animate-bounce">
                      <div className="bg-primary text-white p-1 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-primary uppercase tracking-tighter">Bagus Sekali!</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="steps" className="mt-0 outline-none">
              <div className="glass rounded-[2.5rem] p-8 border-primary/10">
                <div className="mb-8">
                  <h3 className="text-lg font-black text-foreground tracking-tight">Cara Menulis</h3>
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                    Langkah-langkah goresan yang benar
                  </p>
                </div>

                <div className="space-y-6">
                  {selectedLetter.writingSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4 group/step">
                      <div className="w-8 h-8 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-sm font-black border border-primary/20 group-hover/step:bg-primary group-hover/step:text-white transition-colors duration-300">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-foreground leading-relaxed flex-1 pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
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
        <LazyAudioPlayer
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

      <LazyBottomNavigation />
    </div>
  );
}
