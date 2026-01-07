import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/client/src/lib/queryClient";
import type { UserProgress, InsertUserProgress } from "@/shared/schema";

export function useProgress(module?: string) {
  return useQuery<UserProgress[]>({
    queryKey: ["/api/progress", module].filter(Boolean),
    enabled: true,
  });
}

export function useProgressItem(module: string, itemId: string) {
  return useQuery<UserProgress | null>({
    queryKey: ["/api/progress", module, itemId],
    enabled: !!(module && itemId),
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertUserProgress) => {
      const response = await apiRequest("POST", "/api/progress", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate all progress queries
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });

      // Update specific progress item
      queryClient.setQueryData(
        ["/api/progress", data.module, data.itemId],
        data
      );
    },
  });
}

export function useProgressStats() {
  const { data: allProgress = [] } = useProgress();

  const stats = {
    hijaiyah: {
      completed: allProgress.filter(p => p.module === 'hijaiyah' && p.completed).length,
      total: 28,
      progress: 0,
    },
    quran: {
      bookmarked: allProgress.filter(p => p.module === 'quran').length,
      total: 114,
      lastRead: allProgress
        .filter(p => p.module === 'quran')
        .sort((a, b) => new Date(b.lastAccessed || new Date()).getTime() - new Date(a.lastAccessed || new Date()).getTime())[0],
    },
    dhikr: {
      todayCount: allProgress.filter(p =>
        p.module === 'dhikr' &&
        new Date(p.lastAccessed || new Date()).toDateString() === new Date().toDateString()
      ).length,
    },
    quiz: {
      attempts: allProgress.filter(p => p.module === 'quiz').length,
      bestScore: Math.max(...allProgress.filter(p => p.module === 'quiz').map(p => p.score || 0), 0),
    },
  };

  stats.hijaiyah.progress = Math.round((stats.hijaiyah.completed / stats.hijaiyah.total) * 100);

  return stats;
}
