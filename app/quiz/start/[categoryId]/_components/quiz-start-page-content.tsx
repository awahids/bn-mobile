"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { LazyBottomNavigation } from "@/components/lazy";
import { useAuth } from "@/hooks/use-auth";
import { getQuizCategoryById, isQuizCategoryId } from "@/data/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobilePageShell } from "@/components/page-atoms/mobile-page-shell";
import { StickyPageHeader } from "@/components/page-atoms/sticky-page-header";
import { CategoryIcon } from "@/app/quiz/_components/category-icon";

export function QuizStartPageContent() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const categoryId = params?.categoryId ?? "";
  const isValidCategory = isQuizCategoryId(categoryId);
  const category = isValidCategory ? getQuizCategoryById(categoryId) : undefined;

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
                Mode tamu aktif. Skor kuis tidak disimpan ke akun.
              </p>
              <Button
                size="sm"
                onClick={() => router.push(`/login?callbackUrl=/quiz/start/${category.id}`)}
              >
                Masuk untuk simpan skor
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-16 h-16 bg-${category.color}/20 rounded-xl flex items-center justify-center`}>
                <CategoryIcon icon={category.icon} className={`w-8 h-8 text-${category.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{category.name}</h2>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <Badge variant="secondary">10 Soal</Badge>
              <Badge variant="outline">Materi + Kuis</Badge>
              <Badge variant="outline">10 Menit</Badge>
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

        <Button
          onClick={() => router.push(`/quiz/play/${category.id}`)}
          className="w-full h-12 text-lg font-semibold"
          data-testid="start-quiz"
        >
          <Play className="w-5 h-5 mr-2" />
          Mulai Kuis
        </Button>

        <Button variant="outline" onClick={() => router.push("/quiz")} className="w-full">
          Pilih Kategori Lain
        </Button>
      </section>

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}
