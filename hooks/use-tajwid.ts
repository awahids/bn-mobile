import { useQuery } from "@tanstack/react-query";
import { api, TajwidRuleAPI } from "@/lib/api-core";

export function useTajwidRules() {
  return useQuery<TajwidRuleAPI[]>({
    queryKey: ["tajwid", "rules"],
    queryFn: () => api.tajwid.getRules(),
    staleTime: 1000 * 60 * 60 * 24,
  });
}
