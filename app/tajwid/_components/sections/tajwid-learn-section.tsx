import { BookAudio, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TajwidExampleAPI, TajwidRuleAPI } from "@/lib/api-core";

interface TajwidLearnSectionProps {
  selectedRule: TajwidRuleAPI;
  selectedIndex: number;
  totalRules: number;
  isCompleted: boolean;
  onPrevRule: () => void;
  onNextRule: () => void;
  onPlayAudio: () => void;
  onOpenQuiz: () => void;
  onPlayExampleAudio: (example: TajwidExampleAPI) => void;
  loadingExampleAudioKey: string | null;
}

const categoryLabels: Record<TajwidRuleAPI["category"], string> = {
  nun_sukun: "Nun Sukun",
  mad: "Mad",
  qalqalah: "Qalqalah",
  ghunnah: "Ghunnah",
  al: "Alif Lam",
  waqf: "Waqf",
};

function getFocusedExcerpt(fullText: string, highlightedText: string) {
  if (!highlightedText || !fullText.includes(highlightedText)) return fullText;

  const contextChars = 24;
  const startIndex = fullText.indexOf(highlightedText);
  const endIndex = startIndex + highlightedText.length;

  let excerptStart = Math.max(0, startIndex - contextChars);
  let excerptEnd = Math.min(fullText.length, endIndex + contextChars);

  if (excerptStart > 0) {
    const nextSpace = fullText.indexOf(" ", excerptStart);
    if (nextSpace !== -1 && nextSpace < startIndex) {
      excerptStart = nextSpace + 1;
    }
  }

  if (excerptEnd < fullText.length) {
    const prevSpace = fullText.lastIndexOf(" ", excerptEnd);
    if (prevSpace !== -1 && prevSpace > endIndex) {
      excerptEnd = prevSpace;
    }
  }

  const excerpt = fullText.slice(excerptStart, excerptEnd).trim();
  const prefix = excerptStart > 0 ? "…" : "";
  const suffix = excerptEnd < fullText.length ? "…" : "";
  return `${prefix}${excerpt}${suffix}`;
}

function HighlightedAyah({
  full_text,
  highlighted_text,
}: Pick<TajwidExampleAPI, "full_text" | "highlighted_text">) {
  if (!highlighted_text || !full_text.includes(highlighted_text)) {
    return (
      <span className="font-arabic text-3xl leading-[1.9] text-foreground" dir="rtl">
        {full_text}
      </span>
    );
  }

  const startIndex = full_text.indexOf(highlighted_text);
  const before = full_text.slice(0, startIndex);
  const match = full_text.slice(startIndex, startIndex + highlighted_text.length);
  const after = full_text.slice(startIndex + highlighted_text.length);

  return (
    <span className="font-arabic text-3xl leading-[1.9] text-foreground" dir="rtl">
      {before}
      <span className="rounded-md bg-chart-2/15 px-1.5 font-black text-chart-2">
        {match}
      </span>
      {after}
    </span>
  );
}

export function TajwidLearnSection({
  selectedRule,
  selectedIndex,
  totalRules,
  isCompleted,
  onPrevRule,
  onNextRule,
  onPlayAudio,
  onOpenQuiz,
  onPlayExampleAudio,
  loadingExampleAudioKey,
}: TajwidLearnSectionProps) {
  const triggerLetters = selectedRule.triggerLetters.split(" ").filter(Boolean);

  return (
    <section className="px-6 pb-40 pt-6">
      <div className="mb-5 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevRule}
          disabled={selectedIndex <= 0}
          className="rounded-2xl bg-chart-2/8"
          data-testid="prev-rule"
        >
          <ChevronLeft className="h-5 w-5 text-chart-2" />
        </Button>

        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">
            Aturan {selectedIndex + 1}/{totalRules}
          </p>
          <Badge className="mt-2 rounded-full bg-chart-2/10 px-3 py-1 text-chart-2 hover:bg-chart-2/10">
            {categoryLabels[selectedRule.category]}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNextRule}
          disabled={selectedIndex >= totalRules - 1}
          className="rounded-2xl bg-chart-2/8"
          data-testid="next-rule"
        >
          <ChevronRight className="h-5 w-5 text-chart-2" />
        </Button>
      </div>

      <div
        key={selectedRule.id}
        className="relative overflow-hidden rounded-[2.5rem] border border-chart-2/15 bg-gradient-to-br from-chart-2/12 via-background to-background p-6 shadow-xl shadow-chart-2/5"
      >
        <div className="absolute -right-10 top-[-30px] h-40 w-40 rounded-full bg-chart-2/10 blur-3xl" />
        <div className="absolute -left-8 bottom-[-40px] h-32 w-32 rounded-full bg-primary/8 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-chart-2">
                Detail Belajar
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground">
                {selectedRule.name}
              </h2>
              <p className="mt-2 font-arabic text-4xl text-chart-2">
                {selectedRule.arabicName}
              </p>
            </div>

            {isCompleted && (
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-[0.16em]">
                  Sudah dibuka
                </span>
              </div>
            )}
          </div>

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            {selectedRule.description}
          </p>

          <div className="mt-5">
            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Huruf Pemicu
            </p>
            <div className="flex flex-wrap gap-2">
              {triggerLetters.map((letter) => (
                <Badge
                  key={`${selectedRule.id}-${letter}`}
                  variant="secondary"
                  className="rounded-full bg-chart-2/10 px-3 py-1.5 text-base text-chart-2"
                >
                  {letter}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              onClick={onPlayAudio}
              className="h-12 flex-1 rounded-2xl bg-chart-2 text-white shadow-lg shadow-chart-2/20 hover:bg-chart-2/90"
              disabled={!selectedRule.audioUrl}
              data-testid="play-tajwid-audio"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              {selectedRule.audioUrl ? "Dengar Demonstrasi" : "Audio Segera Hadir"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onOpenQuiz}
              className="h-12 rounded-2xl border-chart-2/30 text-chart-2 hover:bg-chart-2/10"
              data-testid="open-tajwid-quiz"
            >
              Quiz
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-border/60 bg-card/80 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-chart-2/10 p-2.5 text-chart-2">
            <BookAudio className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-foreground">
              Contoh Ayat
            </h3>
            <p className="text-sm text-muted-foreground">
              Potongan terkait diberi highlight, lalu full ayat ditampilkan di bawahnya.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {selectedRule.examples.map((example) => {
            const exampleKey = `${example.surah_name}:${example.ayah_number}`;
            const isLoadingExampleAudio = loadingExampleAudioKey === exampleKey;

            return (
              <div
                key={`${selectedRule.id}-${example.surah_name}-${example.ayah_number}`}
                className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4"
              >
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Potongan Terkait
              </p>
              <div className="rounded-[1.25rem] bg-muted/40 px-4 py-5 text-right">
                <HighlightedAyah
                  full_text={getFocusedExcerpt(example.full_text, example.highlighted_text)}
                  highlighted_text={example.highlighted_text}
                />
              </div>

              <p className="mb-2 mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Full Ayat
              </p>
              <div className="rounded-[1.25rem] bg-muted/20 px-4 py-5 text-right">
                <span className="font-arabic text-3xl leading-[1.9] text-foreground" dir="rtl">
                  {example.full_text}
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4 h-10 rounded-xl border-chart-2/30 text-chart-2 hover:bg-chart-2/10"
                onClick={() => onPlayExampleAudio(example)}
                disabled={isLoadingExampleAudio}
                data-testid={`play-example-audio-${example.surah_name}-${example.ayah_number}`}
              >
                {isLoadingExampleAudio ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="mr-2 h-4 w-4" />
                )}
                Dengar Ayat Ini
              </Button>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {example.surah_name} : {example.ayah_number}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {example.translation}
                  </p>
                </div>
                <Badge variant="outline" className="rounded-full">
                  Fokus
                </Badge>
              </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
