import { Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizScoreFeedback } from "@/app/quiz/play/[categoryId]/_components/atoms/quiz-score-feedback";

interface QuizFinishedSectionProps {
  isAuthenticated: boolean;
  saveSkippedForGuest: boolean;
  saveFailed: boolean;
  categoryId: string;
  score: number;
  totalQuestions: number;
  scorePercentage: number;
  onGoLogin: (callbackUrl: string) => void;
  onPlayAgain: () => void;
  onPickCategory: () => void;
  onGoHome: () => void;
}

export function QuizFinishedSection({
  isAuthenticated,
  saveSkippedForGuest,
  saveFailed,
  categoryId,
  score,
  totalQuestions,
  scorePercentage,
  onGoLogin,
  onPlayAgain,
  onPickCategory,
  onGoHome,
}: QuizFinishedSectionProps) {
  return (
    <section className="p-4 pb-24">
      {saveSkippedForGuest && (
        <Card className="mb-4 border-primary/20 bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Hasil kuis ini hanya tersimpan sementara karena Anda belum login.
            </p>
            <Button size="sm" onClick={() => onGoLogin(`/quiz/start/${categoryId}`)}>
              Masuk untuk simpan hasil berikutnya
            </Button>
          </CardContent>
        </Card>
      )}
      {isAuthenticated && saveFailed && (
        <Card className="mb-4 border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Hasil kuis belum tersimpan ke server. Cek koneksi lalu coba lagi.
            </p>
          </CardContent>
        </Card>
      )}
      <Card className="mb-6">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-chart-4" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Kuis Selesai!</h2>
          <p className="text-muted-foreground mb-4">Berikut adalah hasil kuis Anda</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-chart-4">{score}</div>
              <div className="text-xs text-muted-foreground">Benar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{totalQuestions - score}</div>
              <div className="text-xs text-muted-foreground">Salah</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{scorePercentage}%</div>
              <div className="text-xs text-muted-foreground">Skor</div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onPlayAgain} className="w-full" data-testid="play-again">
              <Play className="w-4 h-4 mr-2" />
              Main Lagi
            </Button>

            <Button variant="outline" onClick={onPickCategory} className="w-full">
              Pilih Kategori Lain
            </Button>

            <Button variant="outline" onClick={onGoHome} className="w-full" data-testid="back-home">
              Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <QuizScoreFeedback scorePercentage={scorePercentage} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
