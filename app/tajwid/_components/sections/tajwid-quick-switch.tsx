import { Button } from "@/components/ui/button";

interface TajwidQuickSwitchProps {
  currentTab: "learn" | "overview";
  onChangeTab: (tab: "learn" | "overview") => void;
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
      <div className="flex rounded-full border border-border bg-card p-1 shadow-lg">
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
          Semua Aturan
        </Button>
      </div>
    </div>
  );
}
