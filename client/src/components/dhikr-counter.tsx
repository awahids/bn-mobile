import { useState } from "react";
import { Button } from "@/client/src/components/ui/button";
import { Progress } from "@/client/src/components/ui/progress";
import { Badge } from "@/client/src/components/ui/badge";
import { Minus, Plus, RotateCcw, Check } from "lucide-react";

interface DhikrCounterProps {
  dhikrId: string;
  currentCount: number;
  targetCount: number;
  onUpdate: (count: number) => void;
  completed: boolean;
}

export function DhikrCounter({
  dhikrId,
  currentCount,
  targetCount,
  onUpdate,
  completed
}: DhikrCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = () => {
    if (currentCount < targetCount) {
      const newCount = currentCount + 1;
      onUpdate(newCount);

      // Add animation feedback
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      onUpdate(currentCount - 1);
    }
  };

  const handleReset = () => {
    onUpdate(0);
  };

  const progressPercentage = Math.min((currentCount / targetCount) * 100, 100);

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {currentCount}/{targetCount}
          </span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-2"
        />
      </div>

      {/* Counter Display */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={currentCount === 0}
          className="h-12 w-12 rounded-full"
          data-testid={`decrement-${dhikrId}`}
        >
          <Minus className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <div
            className={`text-3xl font-bold transition-all duration-200 ${isAnimating ? 'scale-110 text-chart-3' : 'text-foreground'
              }`}
          >
            {currentCount}
          </div>
          <div className="text-xs text-muted-foreground">
            {completed ? 'Selesai' : `${targetCount - currentCount} lagi`}
          </div>
        </div>

        <Button
          variant={completed ? "default" : "outline"}
          size="icon"
          onClick={handleIncrement}
          disabled={completed}
          className={`h-12 w-12 rounded-full dhikr-counter touch-target ${completed ? 'bg-chart-3 hover:bg-chart-3/90' : ''
            }`}
          data-testid={`increment-${dhikrId}`}
        >
          {completed ? (
            <Check className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground"
          data-testid={`reset-${dhikrId}`}
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>

        {completed && (
          <Badge variant="default" className="bg-chart-3">
            <Check className="w-3 h-3 mr-1" />
            Target Tercapai
          </Badge>
        )}
      </div>
    </div>
  );
}
