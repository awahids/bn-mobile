import { Card, CardContent } from "@/components/ui/card";

export function QuizInitializingSection() {
  return (
    <section className="p-4 pb-24">
      <Card>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Menyiapkan soal kuis...
        </CardContent>
      </Card>
    </section>
  );
}
