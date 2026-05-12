import { Skeleton } from "@/components/ui/skeleton";
import { BottomNavigation } from "@/components/shared/bottom-navigation";

export default function HabitsLoading() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-primary/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-10 h-10 rounded-2xl" />
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Stats card */}
        <Skeleton className="w-full h-36 rounded-[2.5rem]" />

        {/* Habit list header */}
        <div className="flex items-center justify-between px-1">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        {/* Habit items */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass p-5 rounded-[2rem] flex items-center gap-5 border border-border/30">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}
