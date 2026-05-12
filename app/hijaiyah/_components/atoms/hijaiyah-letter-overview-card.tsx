import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HijaiyahLetterAPI } from "@/lib/api-core";

interface HijaiyahLetterOverviewCardProps {
  letter: HijaiyahLetterAPI;
  isSelected: boolean;
  completed: boolean;
  onSelect: (letter: HijaiyahLetterAPI) => void;
}

export function HijaiyahLetterOverviewCard({
  letter,
  isSelected,
  completed,
  onSelect,
}: HijaiyahLetterOverviewCardProps) {
  return (
    <Card
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-300 border-primary/5 hover:shadow-xl hover:shadow-primary/5 active:scale-95",
        isSelected ? "ring-2 ring-primary shadow-lg" : "glass"
      )}
      onClick={() => onSelect(letter)}
      data-testid={`letter-${letter.id}`}
    >
      <CardContent className="p-4 text-center relative flex flex-col items-center">
        {completed && (
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
  );
}
