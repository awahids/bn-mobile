import { Button } from "@/components/ui/button";

interface HijaiyahQuickSwitchProps {
  currentTab: "learn" | "overview";
  onChangeTab: (tab: "learn" | "overview") => void;
}

export function HijaiyahQuickSwitch({ currentTab, onChangeTab }: HijaiyahQuickSwitchProps) {
  return (
    <div 
      className="fixed left-1/2 transform -translate-x-1/2 z-30"
      style={{ bottom: "calc(max(0.75rem, env(safe-area-inset-bottom)) + 5.5rem)" }}
    >
      <div className="flex bg-card border border-border rounded-full p-1 shadow-lg">
        <Button
          variant={currentTab === "learn" ? "default" : "ghost"}
          size="sm"
          onClick={() => onChangeTab("learn")}
          className="rounded-full"
          data-testid="tab-learn"
        >
          Belajar
        </Button>
        <Button
          variant={currentTab === "overview" ? "default" : "ghost"}
          size="sm"
          onClick={() => onChangeTab("overview")}
          className="rounded-full"
          data-testid="tab-overview"
        >
          Semua Huruf
        </Button>
      </div>
    </div>
  );
}
