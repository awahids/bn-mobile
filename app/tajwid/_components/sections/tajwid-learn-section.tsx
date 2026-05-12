import { BookAudio, CheckCircle2, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
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
}

const categoryLabels: Record<TajwidRuleAPI["category"], string> = {
  nun_sukun: "Nun Sukun",
  mad: "Mad",
  qalqalah: "Qalqalah",
  ghunnah: "Ghunnah",
  al: "Alif Lam",
  waqf: "Waqf",
};

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
      {after}
      <span className="rounded-md bg-chart-2/15 px-1.5 font-black text-chart-2">
        {match}
      </span>
      {before}
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
              Bagian yang relevan diberi highlight agar cepat dikenali.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {selectedRule.examples.map((example) => (
            <div
              key={`${selectedRule.id}-${example.surah_name}-${example.ayah_number}`}
              className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4"
            >
              <div className="rounded-[1.25rem] bg-muted/40 px-4 py-5 text-right">
                <HighlightedAyah
                  full_text={example.full_text}
                  highlighted_text={example.highlighted_text}
                />
              </div>

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
          ))}
        </div>
      </div>
    </section>
  );
}
