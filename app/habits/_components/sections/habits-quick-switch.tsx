"use client";

import { Button } from "@/components/ui/button";
import { LayoutDashboard, BarChart2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitsQuickSwitchProps {
  currentTab: "dashboard" | "progress" | "coach";
  onChangeTab: (tab: "dashboard" | "progress" | "coach") => void;
}

export function HabitsQuickSwitch({ currentTab, onChangeTab }: HabitsQuickSwitchProps) {
  const tabs = [
    { id: "dashboard", label: "Hari Ini", icon: LayoutDashboard },
    { id: "progress", label: "Progress", icon: BarChart2 },
    { id: "coach", label: "AI Coach", icon: Bot },
  ] as const;

  return (
    <div 
      className="fixed left-1/2 transform -translate-x-1/2 z-40"
      style={{ bottom: "calc(max(0.75rem, env(safe-area-inset-bottom)) + 5rem)" }}
    >
      <div className="flex bg-card/80 backdrop-blur-xl border border-primary/10 rounded-full p-1.5 shadow-2xl shadow-primary/20">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={currentTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onChangeTab(tab.id)}
            className={cn(
              "rounded-full gap-2 transition-all duration-300",
              currentTab === tab.id ? "px-4 shadow-lg shadow-primary/20" : "px-3"
            )}
            data-testid={`tab-${tab.id}`}
          >
            <tab.icon size={16} className={cn(currentTab === tab.id ? "text-primary-foreground" : "text-muted-foreground")} />
            {currentTab === tab.id && (
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
