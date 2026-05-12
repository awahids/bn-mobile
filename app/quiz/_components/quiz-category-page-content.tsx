"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { LazyBottomNavigation } from "@/components/lazy";
import { useAuth } from "@/hooks/use-auth";
import { useQuizCategories } from "@/hooks/use-quiz-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import { CategoryIcon } from "./category-icon";

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  "chart-1": { bg: "bg-chart-1/20", text: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/20", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/20", text: "text-chart-3" },
  "chart-4": { bg: "bg-chart-4/20", text: "text-chart-4" },
  "chart-5": { bg: "bg-chart-5/20", text: "text-chart-5" },
  "chart-6": { bg: "bg-chart-6/20", text: "text-chart-6" },
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
        leftSlot={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      <section className="p-4 pb-24">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Pilih Kategori Kuis</h2>
          <p className="text-sm text-muted-foreground">
            Kategori dipilih dulu, lalu lanjut ke halaman mulai kuis.
          </p>
        </div>

        {!isAuthenticated && (
          <Card className="mb-4 border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Login diperlukan untuk mulai kuis.
              </p>
              <Button size="sm" onClick={() => router.push("/login?callbackUrl=/quiz")}>
                Masuk untuk mulai kuis
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-md transition-all card-hover"
              onClick={() => router.push(`/quiz/start/${category.id}`)}
              data-testid={`category-${category.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-16 h-16 ${categoryColorMap[category.color]?.bg ?? "bg-muted"} rounded-xl flex items-center justify-center`}
                  >
                    <CategoryIcon icon={category.icon} className={`w-8 h-8 ${categoryColorMap[category.color]?.text ?? "text-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">30 Soal</Badge>
                      <Badge variant="outline">3 Level</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}
