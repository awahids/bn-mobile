interface QuizScoreFeedbackProps {
  scorePercentage: number;
}

export function QuizScoreFeedback({ scorePercentage }: QuizScoreFeedbackProps) {
  if (scorePercentage >= 80) {
    return (
      <>
        <div className="text-4xl mb-2">🌟</div>
        <h3 className="font-semibold text-chart-4 mb-2">Luar Biasa!</h3>
        <p className="text-sm text-muted-foreground">Pengetahuan Islam Anda sangat baik. Pertahankan!</p>
      </>
    );
  }

  if (scorePercentage >= 60) {
    return (
      <>
        <div className="text-4xl mb-2">👍</div>
        <h3 className="font-semibold text-primary mb-2">Bagus!</h3>
        <p className="text-sm text-muted-foreground">Hasil yang cukup baik. Terus belajar dan tingkatkan!</p>
      </>
    );
  }

  return (
    <>
      <div className="text-4xl mb-2">📚</div>
      <h3 className="font-semibold text-muted-foreground mb-2">Terus Belajar!</h3>
      <p className="text-sm text-muted-foreground">Jangan berkecil hati. Perbanyak belajar dan coba lagi!</p>
    </>
  );
}
