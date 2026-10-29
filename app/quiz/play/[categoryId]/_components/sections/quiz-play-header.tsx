import { Clock } from "lucide-react";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import type { QuizState } from "@/app/quiz/play/[categoryId]/_hooks/use-quiz-play-controller";

interface QuizPlayHeaderProps {
  quizState: QuizState;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  isTimed: boolean;
  onBack: () => void;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function QuizPlayHeader({
  quizState,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  isTimed,
  onBack,
}: QuizPlayHeaderProps) {
  return (
    <StickyPageHeader
      title={
        quizState === "material"
          ? "Materi Belajar"
          : quizState === "playing"
            ? "Sedang Kuis"
            : "Hasil Kuis"
      }
      subtitle={
        quizState === "playing" || quizState === "material"
          ? `Soal ${currentQuestionIndex + 1}/${totalQuestions}`
          : undefined
      }
      onBack={onBack}
      rightSlot={
        quizState === "playing" && isTimed ? (
          <div
            className="flex items-center space-x-2"
            aria-label={`Sisa waktu ${formatTime(timeLeft)}`}
          >
            <Clock className={`w-4 h-4 ${timeLeft <= 60 ? "text-destructive" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium tabular-nums ${timeLeft <= 60 ? "text-destructive" : ""}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        ) : null
      }
    />
  );
}
