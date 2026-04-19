import { ArrowLeft, Clock } from "lucide-react";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import { Button } from "@/components/ui/button";
import type { QuizState } from "@/app/quiz/play/[categoryId]/_hooks/use-quiz-play-controller";

interface QuizPlayHeaderProps {
  quizState: QuizState;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
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
      leftSlot={
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="back-button">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      }
      rightSlot={
        quizState === "playing" ? (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
          </div>
        ) : null
      }
    />
  );
}
