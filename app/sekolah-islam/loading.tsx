import { Skeleton } from "@/components/ui/skeleton";
import { BottomNavigation } from "@/components/shared/bottom-navigation";

export default function SekolahIslamLoading() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-primary/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-10 h-10 rounded-2xl" />
            <div>
              <Skeleton className="h-5 w-28 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-1">
              <Skeleton className="h-3 w-8 mb-1 ml-auto" />
              <Skeleton className="h-5 w-6 ml-auto" />
            </div>
            <Skeleton className="w-10 h-10 rounded-2xl" />
          </div>
        </div>
      </header>

      <div className="px-6 py-8 space-y-6">
        {/* Hero card */}
        <Skeleton className="w-full h-40 rounded-[2.5rem]" />

        {/* Search + filter */}
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-11 rounded-xl" />
          <Skeleton className="w-[120px] h-11 rounded-xl shrink-0" />
        </div>

        {/* School cards */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass p-5 rounded-[2rem] border border-border/30 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-24 rounded-xl" />
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}
