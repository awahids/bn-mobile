import { Check, Volume2 } from "lucide-react";
import { LazyDhikrCounter } from "@/components/lazy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DhikrItem } from "@/data/dhikr";

interface DhikrListSectionProps {
  dhikrList: DhikrItem[];
  getCounterData: (dhikrId: string) => { count: number; completed: boolean; target: number };
  audioPlayerPreloadProps: Record<string, unknown>;
  dhikrCounterPreloadProps: Record<string, unknown>;
  onPlayDhikr: (dhikr: DhikrItem) => void;
  onUpdateCounter: (dhikrId: string, count: number) => void;
}

export function DhikrListSection({
  dhikrList,
  getCounterData,
  audioPlayerPreloadProps,
  dhikrCounterPreloadProps,
  onPlayDhikr,
  onUpdateCounter,
}: DhikrListSectionProps) {
  return (
    <section className="px-6 pb-32">
      <div className="space-y-6">
        {dhikrList.map((dhikr, index) => {
          const counterData = getCounterData(dhikr.id);

          return (
            <Card
              key={dhikr.id}
              className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 border-none shadow-sm ${
                counterData.completed
                  ? "bg-primary shadow-xl shadow-primary/20 scale-[0.98]"
                  : "glass hover:shadow-lg hover:shadow-primary/5"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          counterData.completed ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        }`}
                      >
                        DZIKIR {index + 1}
                      </span>
                      {counterData.completed && (
                        <div className="flex h-5 w-5 rounded-full bg-white items-center justify-center p-1">
                          <Check className="w-full h-full text-primary" />
                        </div>
                      )}
                    </div>
                    <h3 className={`text-xl font-bold leading-tight ${counterData.completed ? "text-white" : "text-foreground"}`}>
                      {dhikr.transliteration}
                    </h3>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPlayDhikr(dhikr)}
                    className={`rounded-2xl ${
                      counterData.completed ? "bg-white/10 hover:bg-white/20 text-white" : "bg-primary/10 hover:bg-primary/20 text-primary"
                    }`}
                    data-testid={`play-${dhikr.id}`}
                    {...audioPlayerPreloadProps}
                  >
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="relative mb-8 text-center py-4 bg-white/5 rounded-3xl backdrop-blur-sm shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                  <div className={`text-3xl font-arabic leading-relaxed text-right p-4 ${counterData.completed ? "text-white" : "text-primary"}`} dir="rtl">
                    {dhikr.arabic}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className={`text-sm font-medium leading-relaxed ${counterData.completed ? "text-white/90" : "text-foreground/80"}`}>
                    &quot;{dhikr.meaning}&quot;
                  </p>
                  {dhikr.reference && (
                    <div
                      className={`flex items-start space-x-2 text-[10px] font-bold italic uppercase tracking-wider ${
                        counterData.completed ? "text-white/60" : "text-muted-foreground"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0" />
                      <span>{dhikr.reference}</span>
                    </div>
                  )}
                </div>

                <div {...dhikrCounterPreloadProps}>
                  <LazyDhikrCounter
                    dhikrId={dhikr.id}
                    currentCount={counterData.count}
                    targetCount={counterData.target}
                    onUpdate={(count: number) => onUpdateCounter(dhikr.id, count)}
                    completed={counterData.completed}
                  />
                </div>
              </div>

              {counterData.completed && (
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
