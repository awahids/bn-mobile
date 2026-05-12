import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateQuizAttemptData, type QuizQuestionAPI } from "@/lib/api-client";
import { useQuizQuestions } from "@/hooks/use-quiz-content";
import { useUpdateProgress } from "@/hooks/use-progress";
import { type QuizCategoryId } from "@/data/quiz";

export type QuizState = "material" | "playing" | "finished";

export type QuizAnswerPayload = {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
};

const QUIZ_QUESTION_COUNT = 10;
const QUIZ_TIME_LIMIT_SECONDS = 600;

interface UseQuizPlayControllerParams {
  categoryId: QuizCategoryId | null;
  isAuthenticated: boolean;
}

export function useQuizPlayController({ categoryId, isAuthenticated }: UseQuizPlayControllerParams) {
  const { data: allQuestions = [] } = useQuizQuestions(categoryId ?? undefined);
  const [quizState, setQuizState] = useState<QuizState>("material");
  const [isInitialized, setIsInitialized] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestionAPI[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerPayload[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_LIMIT_SECONDS);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [saveSkippedForGuest, setSaveSkippedForGuest] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const queryClient = useQueryClient();
  const updateProgress = useUpdateProgress();

  const submitQuiz = useMutation({
    mutationFn: (data: CreateQuizAttemptData) => api.quiz.createAttempt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-stats"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts"] });
    },
    onError: (error) => {
      console.error("Quiz submission failed:", error);
    },
  });

  const initializeQuiz = useCallback((nextCategoryId: QuizCategoryId) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const quizQuestions = shuffled.slice(0, QUIZ_QUESTION_COUNT);
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(QUIZ_TIME_LIMIT_SECONDS);
    setStartTime(new Date());
    setSaveSkippedForGuest(false);
    setSaveFailed(false);
    setQuizState("material");
    setIsInitialized(true);
  }, [allQuestions]);

  useEffect(() => {
    if (!categoryId || allQuestions.length === 0) {
      setIsInitialized(false);
      return;
    }

    initializeQuiz(categoryId);
  }, [categoryId, allQuestions, initializeQuiz]);

  const finishQuiz = useCallback(async () => {
    if (!categoryId || !startTime || questions.length === 0) return;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const scorePercentage = Math.round((score / questions.length) * 100);

    if (isAuthenticated) {
      try {
        setSaveFailed(false);
        await submitQuiz.mutateAsync({
          category: categoryId,
          score: scorePercentage,
          totalQuestions: questions.length,
          timeSpent,
          answers,
        });
        updateProgress.mutate({
          module: "quiz",
          itemId: categoryId,
          progress: 100,
          completed: true,
          score: scorePercentage,
          timeSpent,
        });
      } catch {
        setSaveFailed(true);
      }
      setSaveSkippedForGuest(false);
    } else {
      setSaveSkippedForGuest(true);
    }

    setQuizState("finished");
  }, [answers, categoryId, isAuthenticated, questions.length, score, startTime, submitQuiz]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (quizState === "playing" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [finishQuiz, quizState, timeLeft]);

  const proceedToQuestion = useCallback(() => {
    setQuizState("playing");
  }, []);

  const selectAnswer = useCallback((answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const userAnswer = currentQuestion.options[answerIndex] || "";
    const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer] || "";

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        userAnswer,
        correctAnswer,
        isCorrect,
        timeSpent: 0,
      },
    ]);
  }, [currentQuestionIndex, questions, selectedAnswer, showExplanation]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizState("material");
      return;
    }

    finishQuiz();
  }, [currentQuestionIndex, finishQuiz, questions.length]);

  const playAgain = useCallback(() => {
    if (!categoryId) return;
    initializeQuiz(categoryId);
  }, [categoryId, initializeQuiz]);

  const currentQuestion = questions[currentQuestionIndex];

  const scorePercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((score / questions.length) * 100);
  }, [questions.length, score]);

  const progressPercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, questions.length]);

  return {
    quizState,
    isInitialized,
    questions,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    showExplanation,
    score,
    timeLeft,
    saveSkippedForGuest,
    saveFailed,
    scorePercentage,
    progressPercentage,
    proceedToQuestion,
    selectAnswer,
    nextQuestion,
    playAgain,
  };
}
