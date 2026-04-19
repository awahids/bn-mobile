import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizMaterialSectionProps {
  material: string;
  onProceed: () => void;
}

export function QuizMaterialSection({ material, onProceed }: QuizMaterialSectionProps) {
  return (
    <section className="p-4 pb-24">
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Pelajari Materi Berikut</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{material}</p>
        </CardContent>
      </Card>

      <Button onClick={onProceed} className="w-full h-12 text-lg font-semibold" data-testid="proceed-to-quiz">
        Mulai Kuis Sekarang
      </Button>
    </section>
  );
}
