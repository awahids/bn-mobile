import { Moon, Sun } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DhikrSessionTabsProps {
  currentSession: "morning" | "evening";
  onChangeSession: (session: "morning" | "evening") => void;
}

export function DhikrSessionTabs({ currentSession, onChangeSession }: DhikrSessionTabsProps) {
  return (
    <section className="px-6 mb-6">
      <Tabs value={currentSession} onValueChange={(value) => onChangeSession(value as "morning" | "evening")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-[2rem] bg-black/5 dark:bg-white/5 p-1.5 h-auto border border-white/10">
          <TabsTrigger
            value="morning"
            className="rounded-[1.5rem] py-3.5 data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-2xl shadow-primary/20 transition-all duration-500 font-black tracking-tight flex items-center justify-center"
            data-testid="tab-morning"
          >
            <Sun className="w-4 h-4 mr-2.5" />
            <span>Pagi</span>
          </TabsTrigger>
          <TabsTrigger
            value="evening"
            className="rounded-[1.5rem] py-3.5 data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:text-primary dark:data-[state=active]:text-white data-[state=active]:shadow-2xl shadow-primary/20 transition-all duration-500 font-black tracking-tight flex items-center justify-center"
            data-testid="tab-evening"
          >
            <Moon className="w-4 h-4 mr-2.5" />
            <span>Petang</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </section>
  );
}
