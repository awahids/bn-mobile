import { Skeleton } from "@/components/ui/skeleton";
import { BottomNavigation } from "@/components/shared/bottom-navigation";

export default function ModulesLoading() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background px-6 py-8">
        <div className="relative flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-7 w-36 mb-2" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass p-5 rounded-[2.5rem] border border-border/30 h-48 flex flex-col">
              <Skeleton className="w-14 h-14 rounded-2xl mb-4" />
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-3 w-24" />
              <div className="mt-auto flex justify-end">
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
