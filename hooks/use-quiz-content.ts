import { useQuery } from "@tanstack/react-query";
import { api, QuizCategoryAPI, QuizQuestionAPI } from "@/lib/api-core";
import { quizCategories } from "@/data/quiz";

export function useQuizCategories() {
  return useQuery<QuizCategoryAPI[]>({
    queryKey: ["quiz", "categories"],
    queryFn: () => api.quizContent.getCategories(),
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: quizCategories as unknown as QuizCategoryAPI[],
  });
}

export function useQuizQuestions(categoryId?: string) {
  return useQuery<QuizQuestionAPI[]>({
    queryKey: ["quiz", "questions", categoryId ?? "all"],
    queryFn: () => api.quizContent.getQuestions(categoryId),
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!categoryId,
  });
}
