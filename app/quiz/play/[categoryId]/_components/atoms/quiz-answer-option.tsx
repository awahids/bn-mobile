import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizAnswerOptionProps {
  option: string;
  index: number;
  correctAnswer: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  onSelect: (index: number) => void;
}

export function QuizAnswerOption({
  option,
  index,
  correctAnswer,
  selectedAnswer,
  showExplanation,
  onSelect,
}: QuizAnswerOptionProps) {
  const isCorrectOption = index === correctAnswer;
  const isWrongSelectedOption = index === selectedAnswer && index !== correctAnswer;

  return (
    <Button
      variant="outline"
      className={cn(
        "quiz-option text-left h-auto p-4 justify-start",
        showExplanation && isCorrectOption && "correct bg-chart-2/10 border-chart-2 text-chart-2",
        showExplanation && isWrongSelectedOption && "incorrect bg-destructive/10 border-destructive text-destructive"
      )}
      onClick={() => onSelect(index)}
      disabled={showExplanation}
      data-testid={`option-${index}`}
    >
      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center mr-3 text-xs font-medium">
        {String.fromCharCode(65 + index)}
      </div>
      <span className="flex-1">{option}</span>
      {showExplanation && isCorrectOption && <Check className="w-4 h-4 ml-2" />}
      {showExplanation && isWrongSelectedOption && <X className="w-4 h-4 ml-2" />}
    </Button>
  );
}
