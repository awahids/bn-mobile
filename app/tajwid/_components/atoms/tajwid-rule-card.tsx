import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TajwidRuleAPI } from "@/lib/api-core";

interface TajwidRuleCardProps {
  rule: TajwidRuleAPI;
  isSelected: boolean;
  completed: boolean;
  onSelect: (rule: TajwidRuleAPI) => void;
}

export function TajwidRuleCard({
  rule,
  isSelected,
  completed,
  onSelect,
}: TajwidRuleCardProps) {
  const triggerLetters = rule.triggerLetters.split(" ").filter(Boolean);

  return (
    <button
      type="button"
      onClick={() => onSelect(rule)}
      className={`w-full text-left rounded-[1.75rem] border p-4 transition-all duration-300 ${
        isSelected
          ? "border-primary/30 bg-primary/8 shadow-lg shadow-primary/10"
          : "border-border/60 bg-card/70 hover:border-primary/20 hover:bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            Aturan {rule.sortOrder}
          </p>
          <h3 className="text-lg font-black tracking-tight text-foreground">
            {rule.name}
          </h3>
          <p className="font-arabic text-2xl text-primary mt-1">{rule.arabicName}</p>
        </div>
        {completed && (
          <div className="rounded-full bg-emerald-500/15 p-1.5 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {triggerLetters.slice(0, 4).map((letter) => (
          <Badge
            key={`${rule.id}-${letter}`}
            variant="secondary"
            className="rounded-full bg-primary/10 px-2.5 py-1 text-primary"
          >
            {letter}
          </Badge>
        ))}
      </div>
    </button>
  );
}
