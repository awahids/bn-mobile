import { Button } from "@/components/ui/button";
import { BookOpenText, ListTree, BrainCircuit } from "lucide-react";

interface TajwidQuickSwitchProps {
  currentTab: "learn" | "overview" | "quiz";
  onChangeTab: (tab: "learn" | "overview" | "quiz") => void;
}

export function TajwidQuickSwitch({
  currentTab,
  onChangeTab,
}: TajwidQuickSwitchProps) {
  return (
    <div
      className="fixed left-1/2 z-30 -translate-x-1/2 transform"
      style={{ bottom: "calc(max(0.75rem, env(safe-area-inset-bottom)) + 5.5rem)" }}
    >
      <div className="flex rounded-full border border-border bg-card/95 p-1 shadow-lg backdrop-blur">
        <Button
          variant={currentTab === "learn" ? "default" : "ghost"}
          size="sm"
          onClick={() => onChangeTab("learn")}
          className="rounded-full px-3"
          data-testid="tab-learn"
        >
          <BookOpenText className="mr-1.5 h-4 w-4" />
          Belajar
        </Button>
        <Button
          variant={currentTab === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => onChangeTab("overview")}
          className="rounded-full px-3"
          data-testid="tab-overview"
        >
          <ListTree className="mr-1.5 h-4 w-4" />
          Semua Aturan
        </Button>
        <Button
          variant={currentTab === "quiz" ? "default" : "ghost"}
          size="sm"
          onClick={() => onChangeTab("quiz")}
          className="rounded-full px-3"
          data-testid="tab-quiz"
        >
          <BrainCircuit className="mr-1.5 h-4 w-4" />
          Quiz
        </Button>
      </div>
    </div>
  );
}
