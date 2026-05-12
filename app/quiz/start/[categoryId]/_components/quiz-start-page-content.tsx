"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { LazyBottomNavigation } from "@/components/lazy";
import { useAuth } from "@/hooks/use-auth";
import { getQuizCategoryById, isQuizCategoryId } from "@/data/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import { CategoryIcon } from "@/app/quiz/_components/category-icon";

type QuizDifficulty = "easy" | "medium" | "hard" | "all";

const difficultyOptions: Array<{
  id: QuizDifficulty;
  label: string;
  activeClass: string;
}> = [
  { id: "all", label: "Semua", activeClass: "bg-muted text-foreground border-border" },
  { id: "easy", label: "Mudah", activeClass: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30" },
  { id: "medium", label: "Sedang", activeClass: "bg-amber-500/15 text-amber-600 border-amber-500/30" },
  { id: "hard", label: "Sulit", activeClass: "bg-rose-500/15 text-rose-600 border-rose-500/30" },
];

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  "chart-1": { bg: "bg-chart-1/20", text: "text-chart-1" },
  "chart-2": { bg: "bg-chart-2/20", text: "text-chart-2" },
  "chart-3": { bg: "bg-chart-3/20", text: "text-chart-3" },
  "chart-4": { bg: "bg-chart-4/20", text: "text-chart-4" },
  "chart-5": { bg: "bg-chart-5/20", text: "text-chart-5" },
  "chart-6": { bg: "bg-chart-6/20", text: "text-chart-6" },
};

export function QuizStartPageContent() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  const categoryId = params?.categoryId ?? "";
  const isValidCategory = isQuizCategoryId(categoryId);
  const category = isValidCategory ? getQuizCategoryById(categoryId) : undefined;
  const difficultyFromQuery = searchParams?.get("difficulty");
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>(
    difficultyFromQuery === "easy" || difficultyFromQuery === "medium" || difficultyFromQuery === "hard"
      ? difficultyFromQuery
      : "all"
  );

  useEffect(() => {
    if (
      difficultyFromQuery === "easy" ||
      difficultyFromQuery === "medium" ||
      difficultyFromQuery === "hard"
    ) {
      setSelectedDifficulty(difficultyFromQuery);
      return;
    }

    setSelectedDifficulty("all");
  }, [difficultyFromQuery]);

  const startUrl = useMemo(() => {
    const query =
      selectedDifficulty === "all" ? "" : `?difficulty=${encodeURIComponent(selectedDifficulty)}`;
    return `/quiz/start/${categoryId}${query}`;
  }, [categoryId, selectedDifficulty]);

  const playUrl = useMemo(() => {
    const query =
      selectedDifficulty === "all" ? "" : `?difficulty=${encodeURIComponent(selectedDifficulty)}`;
    return `/quiz/play/${categoryId}${query}`;
  }, [categoryId, selectedDifficulty]);

  const handleStartQuiz = useCallback(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(playUrl)}`);
      return;
    }

    router.push(playUrl);
  }, [isAuthenticated, isLoading, playUrl, router]);

  useEffect(() => {
    if (!category) {
      router.replace("/quiz");
    }
  }, [category, router]);

  if (!category) {
    return null;
  }

  return (
    <MobilePageShell>
      <StickyPageHeader
        title="Mulai Kuis"
        subtitle={`Kategori: ${category.name}`}
        leftSlot={
          <Button variant="ghost" size="icon" onClick={() => router.push("/quiz")} data-testid="back-button">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        }
      />

      <section className="p-4 pb-24 space-y-4">
        {!isAuthenticated && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Login diperlukan sebelum mulai kuis.
              </p>
              <Button
                size="sm"
                onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(startUrl)}`)}
              >
                Masuk untuk mulai kuis
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center ${categoryColorMap[category.color]?.bg ?? "bg-muted"}`}
              >
                <CategoryIcon
                  icon={category.icon}
                  className={`w-8 h-8 ${categoryColorMap[category.color]?.text ?? "text-foreground"}`}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">{category.name}</h2>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <Badge variant="secondary">10 Soal</Badge>
              <Badge variant="outline">Materi + Kuis</Badge>
              <Badge variant="outline">3 Level</Badge>
            </div>

            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-base">Alur Kuis</CardTitle>
            </CardHeader>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Baca materi singkat sebelum tiap soal.</p>
              <p>2. Jawab 10 soal pilihan ganda.</p>
              <p>3. Lihat skor akhir setelah semua soal selesai.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6">
            <CardHeader className="p-0 mb-3">
              <CardTitle className="text-base">Pilih Tingkat Kesulitan</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              {difficultyOptions.map((option) => {
                const isActive = selectedDifficulty === option.id;

                return (
                  <Button
                    key={option.id}
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDifficulty(option.id)}
                    className={`justify-center rounded-2xl border h-11 ${
                      isActive
                        ? option.activeClass
                        : "bg-background text-muted-foreground border-border hover:bg-muted/70"
                    }`}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleStartQuiz}
          className="w-full h-12 text-lg font-semibold"
          disabled={isLoading}
          data-testid="start-quiz"
        >
          <Play className="w-5 h-5 mr-2" />
          {isLoading ? "Memeriksa sesi..." : "Mulai Kuis"}
        </Button>

        <Button variant="outline" onClick={() => router.push("/quiz")} className="w-full">
          Pilih Kategori Lain
        </Button>
      </section>

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}
