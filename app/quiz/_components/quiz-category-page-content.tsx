"use client";

import { useRouter } from "next/navigation";
import { LazyBottomNavigation } from "@/components/lazy";
import { useAuth } from "@/hooks/use-auth";
import { useQuizCategories } from "@/hooks/use-quiz-content";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GuestBanner } from "@/components/shared/guest-banner";
import { SectionHeader } from "@/components/shared/section-header";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import { CategoryIcon } from "./category-icon";

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
  "chart-4": { bg: "bg-chart-4/10", text: "text-chart-4" },
  "chart-5": { bg: "bg-chart-5/10", text: "text-chart-5" },
  "chart-6": { bg: "bg-chart-6/10", text: "text-chart-6" },
};

export function QuizCategoryPageContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: categories = [] } = useQuizCategories();

  return (
    <MobilePageShell>
      <StickyPageHeader
        title="Kuis Islam"
        subtitle="Pilih kategori kuis"
        onBack={() => router.push("/")}
      />

      <section className="space-y-3 p-4 pb-32">
        {!isAuthenticated && (
          <GuestBanner message="Masuk dulu untuk mulai kuis dan menyimpan skor." onLogin={() => router.push("/login?callbackUrl=/quiz")} />
        )}

        <SectionHeader title="Pilih kategori" description="10 soal per kuis, 3 tingkat kesulitan" className="pt-1" />

        <div className="space-y-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/quiz/start/${category.id}`}
              className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99]"
              data-testid={`category-${category.id}`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${categoryColorMap[category.color]?.bg ?? "bg-muted"}`}
              >
                <CategoryIcon icon={category.icon} className={`h-6 w-6 ${categoryColorMap[category.color]?.text ?? "text-foreground"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold tracking-tight">{category.name}</h3>
                <p className="truncate text-sm text-muted-foreground">{category.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}
