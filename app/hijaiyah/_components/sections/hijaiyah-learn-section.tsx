import { motion } from "framer-motion";
import { BookOpen, Check, ChevronLeft, ChevronRight, PenTool, RotateCcw, Volume2 } from "lucide-react";
import { LazyWritingCanvas } from "@/components/lazy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HijaiyahLetter } from "@/data/hijaiyah";
import type { WritingCanvasRef } from "@/components/features/hijaiyah/writing-canvas";

interface HijaiyahLearnSectionProps {
  selectedLetter: HijaiyahLetter;
  writingCompleted: boolean;
  letterCompleted: boolean;
  writingCanvasRef: React.RefObject<WritingCanvasRef | null>;
  audioPlayerPreloadProps: Record<string, unknown>;
  writingCanvasPreloadProps: Record<string, unknown>;
  onPrevLetter: () => void;
  onNextLetter: () => void;
  onPlayAudio: () => void;
  onWritingComplete: () => void;
  onResetWriting: () => void;
}

export function HijaiyahLearnSection({
  selectedLetter,
  writingCompleted,
  letterCompleted,
  writingCanvasRef,
  audioPlayerPreloadProps,
  writingCanvasPreloadProps,
  onPrevLetter,
  onNextLetter,
  onPlayAudio,
  onWritingComplete,
  onResetWriting,
}: HijaiyahLearnSectionProps) {
  return (
    <section className="px-6 pb-40">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevLetter}
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
          onClick={onNextLetter}
          disabled={selectedLetter.order === 28}
          className="rounded-2xl bg-primary/5"
          data-testid="next-letter"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </Button>
      </div>

      <div className="group relative mb-8">
        <div className="glass p-10 rounded-[3rem] text-center relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
          <div className="relative z-10">
            <motion.div key={selectedLetter.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="text-9xl font-arabic mb-6 text-primary drop-shadow-sm animate-float">{selectedLetter.arabic}</div>
            </motion.div>
            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">{selectedLetter.name}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <Badge
                variant="secondary"
                className="rounded-xl px-3 py-1 bg-primary/5 text-primary border-primary/10 font-bold uppercase tracking-widest text-[10px]"
              >
                {selectedLetter.transliteration}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-xl px-3 py-1 bg-accent/5 text-accent border-accent/10 font-bold uppercase tracking-widest text-[10px]"
              >
                {selectedLetter.pronunciation}
              </Badge>
            </div>

            <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-8 max-w-[240px] mx-auto italic">
              &quot;{selectedLetter.description}&quot;
            </p>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={onPlayAudio}
                className="w-full rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-14 font-black uppercase tracking-widest text-xs"
                data-testid="play-pronunciation"
                {...audioPlayerPreloadProps}
              >
                <Volume2 className="w-5 h-5 mr-2" />
                <span>Dengar Suara</span>
              </Button>

              {letterCompleted && (
                <div className="flex items-center justify-center space-x-2 text-primary">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center p-1">
                    <Check className="w-full h-full" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest">Selesai Dipelajari</span>
                </div>
              )}
            </div>
          </div>

          <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
        </div>
      </div>

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
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">Ikuti pola huruf di bawah ini</p>
            </div>

            <div className="relative group/canvas" {...writingCanvasPreloadProps}>
              <LazyWritingCanvas
                ref={writingCanvasRef}
                letter={selectedLetter}
                onComplete={onWritingComplete}
                completed={writingCompleted}
              />

              <div className="absolute -inset-2 bg-primary/5 rounded-[2rem] -z-10 group-hover/canvas:bg-primary/10 transition-colors duration-500" />
            </div>

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetWriting}
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
                <div key={`${selectedLetter.id}-step-${index}`} className="flex items-start space-x-4 group/step">
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
  );
}
