import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuizQuestionAPI as QuizQuestion } from "@/lib/api-core";
import { QuizAnswerOption } from "@/app/quiz/play/[categoryId]/_components/atoms/quiz-answer-option";

interface QuizQuestionSectionProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  progressPercentage: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onSelectAnswer: (index: number) => void;
  onNextQuestion: () => void;
}

export function QuizQuestionSection({
  question,
  currentQuestionIndex,
  totalQuestions,
  progressPercentage,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
  onNextQuestion,
}: QuizQuestionSectionProps) {
  return (
    <section className="p-4 pb-24">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progres</span>
            <span className="text-sm font-medium">
              {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed">{question.question}</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <QuizAnswerOption
            key={`${question.id}-${index}`}
            option={option}
            index={index}
            correctAnswer={question.correctAnswer}
            selectedAnswer={selectedAnswer}
            showExplanation={showExplanation}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>

      {showExplanation && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 text-chart-2">Penjelasan:</h4>
            <p className="text-sm text-foreground leading-relaxed">{question.explanation}</p>
          </CardContent>
        </Card>
      )}

      {showExplanation && (
        <Button onClick={onNextQuestion} className="w-full" data-testid="next-question">
          {currentQuestionIndex < totalQuestions - 1 ? "Soal Berikutnya" : "Selesai"}
        </Button>
      )}
    </section>
  );
}
