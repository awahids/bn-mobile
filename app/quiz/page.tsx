"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, isApiError } from "@/lib/api";
import { NetworkError } from "@/components/error-boundary";
import { BottomNavigation } from "@/components/bottom-navigation";
import { quizCategories, getRandomQuestions, QuizQuestion } from "@/client/src/data/quiz";
import { Button } from "@/client/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/src/components/ui/card";
import { Badge } from "@/client/src/components/ui/badge";
import { Progress } from "@/client/src/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  Check,
  X,
  Trophy,
  RotateCcw,
  Play,
  BookOpen,
  Languages,
  Globe,
  MapPin
} from "lucide-react";

const CategoryIcon = ({ icon, className }: { icon: string, className?: string }) => {
  switch (icon) {
    case 'Languages': return <Languages className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Mosque': return <MapPin className={className} />;
    case 'Globe': return <Globe className={className} />;
    default: return null;
  }
};

type QuizState = 'menu' | 'material' | 'playing' | 'finished';

export default function Quiz() {
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [startTime, setStartTime] = useState<Date | null>(null);

  const queryClient = useQueryClient();

  // Submit quiz attempt mutation
  const submitQuiz = useMutation({
    mutationFn: (data: any) => api.quiz.createAttempt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-stats'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] });
    },
    onError: (error) => {
      console.error('Quiz submission failed:', error);
      // Handle error - could show a toast or error message
    }
  });

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (quizState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [quizState, timeLeft]);

  const startQuiz = (categoryId: string) => {
    const category = quizCategories.find(c => c.id === categoryId);
    if (!category) return;

    const quizQuestions = getRandomQuestions(categoryId as any, 10);
    setQuestions(quizQuestions);
    setSelectedCategory(categoryId);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(600);
    setStartTime(new Date());
    setQuizState('material');
  };

  const proceedToQuestion = () => {
    setQuizState('playing');
  };

  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    const answerData = {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent: 0
    };

    setAnswers(prev => [...prev, answerData]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizState('material');
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!selectedCategory || !startTime) return;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    await submitQuiz.mutateAsync({
      category: selectedCategory,
      score: Math.round((score / questions.length) * 100),
      totalQuestions: questions.length,
      timeSpent,
      answers
    });

    setQuizState('finished');
  };

  const resetQuiz = () => {
    setQuizState('menu');
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(600);
    setStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => quizState === 'menu' ? router.push('/') : resetQuiz()}
              data-testid="back-button"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {quizState === 'menu' ? 'Kuis Islam' :
                  quizState === 'material' ? 'Materi Belajar' :
                    quizState === 'playing' ? 'Sedang Kuis' : 'Hasil Kuis'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {(quizState === 'playing' || quizState === 'material') && `Soal ${currentQuestionIndex + 1}/${questions.length}`}
              </p>
            </div>
          </div>

          {quizState === 'playing' && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Category Selection Menu */}
      {quizState === 'menu' && (
        <section className="p-4 pb-24">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Pilih Kategori Kuis</h2>
            <p className="text-sm text-muted-foreground">
              Pelajari materi dan uji pengetahuan Islam Anda
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {quizCategories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-md transition-all card-hover"
                onClick={() => startQuiz(category.id)}
                data-testid={`category-${category.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-${category.color}/20 rounded-xl flex items-center justify-center`}>
                      <CategoryIcon icon={category.icon} className={`w-8 h-8 text-${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">10 Soal</Badge>
                        <Badge variant="outline">Materi + Kuis</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Material Screen */}
      {quizState === 'material' && currentQuestion && (
        <section className="p-4 pb-24">
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Pelajari Materi Berikut</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {currentQuestion.material}
              </p>
            </CardContent>
          </Card>

          <Button
            onClick={proceedToQuestion}
            className="w-full h-12 text-lg font-semibold"
            data-testid="proceed-to-quiz"
          >
            Mulai Kuis Sekarang
          </Button>
        </section>
      )}

      {/* Quiz Playing */}
      {quizState === 'playing' && currentQuestion && (
        <section className="p-4 pb-24">
          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "quiz-option text-left h-auto p-4 justify-start";

              if (showExplanation) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += " correct bg-chart-2/10 border-chart-2 text-chart-2";
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  buttonClass += " incorrect bg-destructive/10 border-destructive text-destructive";
                }
              }

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => selectAnswer(index)}
                  disabled={showExplanation}
                  data-testid={`option-${index}`}
                >
                  <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center mr-3 text-xs font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1">{option}</span>
                  {showExplanation && index === currentQuestion.correctAnswer && (
                    <Check className="w-4 h-4 ml-2" />
                  )}
                  {showExplanation && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                    <X className="w-4 h-4 ml-2" />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-chart-2">Penjelasan:</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Next Button */}
          {showExplanation && (
            <Button
              onClick={nextQuestion}
              className="w-full"
              data-testid="next-question"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Selesai'}
            </Button>
          )}
        </section>
      )}

      {/* Quiz Results */}
      {quizState === 'finished' && (
        <section className="p-4 pb-24">
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-chart-4" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Kuis Selesai!</h2>
              <p className="text-muted-foreground mb-4">
                Berikut adalah hasil kuis Anda
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-4">{score}</div>
                  <div className="text-xs text-muted-foreground">Benar</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{questions.length - score}</div>
                  <div className="text-xs text-muted-foreground">Salah</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Skor</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={resetQuiz}
                  className="w-full"
                  data-testid="play-again"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Main Lagi
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="w-full"
                  data-testid="back-home"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Score Feedback */}
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                {Math.round((score / questions.length) * 100) >= 80 ? (
                  <>
                    <div className="text-4xl mb-2">🌟</div>
                    <h3 className="font-semibold text-chart-4 mb-2">Luar Biasa!</h3>
                    <p className="text-sm text-muted-foreground">
                      Pengetahuan Islam Anda sangat baik. Pertahankan!
                    </p>
                  </>
                ) : Math.round((score / questions.length) * 100) >= 60 ? (
                  <>
                    <div className="text-4xl mb-2">👍</div>
                    <h3 className="font-semibold text-primary mb-2">Bagus!</h3>
                    <p className="text-sm text-muted-foreground">
                      Hasil yang cukup baik. Terus belajar dan tingkatkan!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">📚</div>
                    <h3 className="font-semibold text-muted-foreground mb-2">Terus Belajar!</h3>
                    <p className="text-sm text-muted-foreground">
                      Jangan berkecil hati. Perbanyak belajar dan coba lagi!
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <BottomNavigation />
    </div>
  );
}