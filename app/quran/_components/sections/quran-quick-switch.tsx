import { BookOpenText, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuranQuickSwitchProps {
  currentTab: "read" | "hafalan";
  onChangeTab: (tab: "read" | "hafalan") => void;
}

export function QuranQuickSwitch({ currentTab, onChangeTab }: QuranQuickSwitchProps) {
  return (
    <div
      className="fixed left-1/2 z-30 -translate-x-1/2 transform"
      style={{ bottom: "calc(max(0.75rem, env(safe-area-inset-bottom)) + 5.5rem)" }}
    >
      <div className="flex rounded-full border border-border bg-card/95 p-1 shadow-lg backdrop-blur">
        <Button
          variant={currentTab === "read" ? "default" : "ghost"}
          size="sm"
          onClick={() => onChangeTab("read")}
          className="rounded-full px-3"
          data-testid="tab-quran-read"
        >
          <BookOpenText className="mr-1.5 h-4 w-4" />
          Baca
        </Button>
        <Button
          variant={currentTab === "hafalan" ? "default" : "ghost"}
          size="sm"
          onClick={() => onChangeTab("hafalan")}
          className="rounded-full px-3"
          data-testid="tab-quran-hafalan"
        >
          <BrainCircuit className="mr-1.5 h-4 w-4" />
          Hafalan
        </Button>
      </div>
    </div>
  );
}
