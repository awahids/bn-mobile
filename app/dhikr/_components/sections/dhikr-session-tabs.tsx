import { Moon, Sun } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DhikrSessionTabsProps {
  currentSession: "morning" | "evening";
  onChangeSession: (session: "morning" | "evening") => void;
}

export function DhikrSessionTabs({ currentSession, onChangeSession }: DhikrSessionTabsProps) {
  return (
    <section className="px-6 mb-8">
      <Tabs value={currentSession} onValueChange={(value) => onChangeSession(value as "morning" | "evening")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-3xl bg-primary/5 p-1.5 h-auto">
          <TabsTrigger
            value="morning"
            className="rounded-2xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg shadow-primary/5 transition-all duration-300"
            data-testid="tab-morning"
          >
            <Sun className="w-4 h-4 mr-2" />
            <span className="font-bold tracking-tight">Pagi</span>
          </TabsTrigger>
          <TabsTrigger
            value="evening"
            className="rounded-2xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg shadow-primary/5 transition-all duration-300"
            data-testid="tab-evening"
          >
            <Moon className="w-4 h-4 mr-2" />
            <span className="font-bold tracking-tight">Petang</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </section>
  );
}
