"use client";

import { useCallback, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LazyBottomNavigation } from "@/components/lazy";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { useAuth } from "@/hooks/use-auth";
import { getQuizCategoryById, isQuizCategoryId } from "@/data/quiz";
import { useQuizPlayController } from "@/app/quiz/play/[categoryId]/_hooks/use-quiz-play-controller";
import { QuizPlayHeader } from "@/app/quiz/play/[categoryId]/_components/sections/quiz-play-header";
import { QuizInitializingSection } from "@/app/quiz/play/[categoryId]/_components/sections/quiz-initializing-section";
import { QuizMaterialSection } from "@/app/quiz/play/[categoryId]/_components/sections/quiz-material-section";
import { QuizQuestionSection } from "@/app/quiz/play/[categoryId]/_components/sections/quiz-question-section";
import { QuizFinishedSection } from "@/app/quiz/play/[categoryId]/_components/sections/quiz-finished-section";

export function QuizPlayPageContent() {
  const params = useParams<{ categoryId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  const routeCategoryId = params?.categoryId;
  const categoryId = routeCategoryId && isQuizCategoryId(routeCategoryId) ? routeCategoryId : null;
  const category = categoryId ? getQuizCategoryById(categoryId) : undefined;
  const difficultyQuery = searchParams?.get("difficulty");
  const difficultySuffix =
    difficultyQuery === "easy" || difficultyQuery === "medium" || difficultyQuery === "hard"
      ? `?difficulty=${encodeURIComponent(difficultyQuery)}`
      : "";

  const {
    quizState,
    isInitialized,
    difficulty,
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
  } = useQuizPlayController({
    categoryId,
    isAuthenticated,
  });

  useEffect(() => {
    if (!categoryId || !category) {
      router.replace("/quiz");
    }
  }, [category, categoryId, router]);

  useEffect(() => {
    if (!categoryId || !category || isLoading || isAuthenticated) {
      return;
    }

    router.replace(`/login?callbackUrl=${encodeURIComponent(`/quiz/play/${categoryId}${difficultySuffix}`)}`);
  }, [category, categoryId, difficultySuffix, isAuthenticated, isLoading, router]);

  const goToStartPage = useCallback(() => {
    if (!categoryId) {
      router.push("/quiz");
      return;
    }

    router.push(`/quiz/start/${categoryId}${difficultySuffix}`);
  }, [categoryId, difficultySuffix, router]);

  const goToCategorySelection = useCallback(() => {
    router.push("/quiz");
  }, [router]);

  const goToHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const goToLogin = useCallback(
    (callbackUrl: string) => {
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    },
    [router]
  );

  if (!categoryId || !category || (!isLoading && !isAuthenticated)) {
    return null;
  }

  return (
    <MobilePageShell>
      <QuizPlayHeader
        quizState={quizState}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        onBack={goToStartPage}
      />

      {!isInitialized && <QuizInitializingSection />}

      {isInitialized && quizState === "material" && currentQuestion && (
        <QuizMaterialSection material={currentQuestion.material} onProceed={proceedToQuestion} />
      )}

      {isInitialized && quizState === "playing" && currentQuestion && (
        <QuizQuestionSection
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          progressPercentage={progressPercentage}
          selectedAnswer={selectedAnswer}
          showExplanation={showExplanation}
          onSelectAnswer={selectAnswer}
          onNextQuestion={nextQuestion}
        />
      )}

      {isInitialized && quizState === "finished" && (
        <QuizFinishedSection
          isAuthenticated={isAuthenticated}
          saveSkippedForGuest={saveSkippedForGuest}
          saveFailed={saveFailed}
          categoryId={category.id}
          score={score}
          totalQuestions={questions.length}
          scorePercentage={scorePercentage}
          onGoLogin={(callbackUrl) => goToLogin(difficulty ? `${callbackUrl}?difficulty=${difficulty}` : callbackUrl)}
          onPlayAgain={playAgain}
          onPickCategory={goToCategorySelection}
          onGoHome={goToHome}
        />
      )}

      <LazyBottomNavigation />
    </MobilePageShell>
  );
}
