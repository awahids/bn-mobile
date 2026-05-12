import { useQuery } from "@tanstack/react-query";
import { api, HijaiyahLetterAPI } from "@/lib/api-core";
import { hijaiyahLetters } from "@/data/hijaiyah";

export function useHijaiyahLetters() {
  return useQuery<HijaiyahLetterAPI[]>({
    queryKey: ["hijaiyah", "letters"],
    queryFn: () => api.hijaiyah.getLetters(),
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: hijaiyahLetters as HijaiyahLetterAPI[],
  });
}

export function useHijaiyahLetterById(id: string | null) {
  return useQuery<HijaiyahLetterAPI>({
    queryKey: ["hijaiyah", "letters", id],
    queryFn: () => api.hijaiyah.getLetterById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
