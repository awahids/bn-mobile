import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api-client"
import type { CreateProgressData, UserProgress } from "@/lib/api-core"

type Module = UserProgress["module"]

interface ProgressQueryOptions {
  enabled?: boolean
}

export function useProgress(module?: Module, options: ProgressQueryOptions = {}) {
  const { enabled = true } = options

  return useQuery<UserProgress[]>({
    queryKey: ["progress", module ?? "all"],
    queryFn: () => api.progress.getProgress(module),
    enabled,
    retry: false,
  })
}

export function useProgressItem(module: Module, itemId: string) {
  return useQuery<UserProgress | null>({
    queryKey: ["progressItem", module, itemId],
    queryFn: () => api.progress.getProgressItem(module, itemId),
    enabled: Boolean(module && itemId),
    retry: false,
  })
}

type UpdateProgressInput = CreateProgressData & { userId?: string }

export function useUpdateProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProgressInput) => {
      const { userId: _userId, ...payload } = data
      return api.progress.updateProgress(payload)
    },
    onSuccess: (progress: UserProgress) => {
      queryClient.invalidateQueries({ queryKey: ["progress"] })
      queryClient.setQueryData(
        ["progressItem", progress.module, progress.itemId],
        progress
      )
    },
  })
}

export function useProgressStats() {
  const { data: allProgress = [] } = useProgress()

  const stats = {
    hijaiyah: {
      completed: allProgress.filter((p) => p.module === "hijaiyah" && p.completed)
        .length,
      total: 28,
      progress: 0,
    },
    quran: {
      bookmarked: allProgress.filter((p) => p.module === "quran").length,
      total: 114,
      lastRead: allProgress
        .filter((p) => p.module === "quran")
        .sort(
          (a, b) =>
            new Date(b.lastAccessed || new Date()).getTime() -
            new Date(a.lastAccessed || new Date()).getTime()
        )[0],
    },
    dhikr: {
      todayCount: allProgress.filter(
        (p) =>
          p.module === "dhikr" &&
          new Date(p.lastAccessed || new Date()).toDateString() ===
            new Date().toDateString()
      ).length,
    },
    quiz: {
      attempts: allProgress.filter((p) => p.module === "quiz").length,
      bestScore: Math.max(
        ...allProgress.filter((p) => p.module === "quiz").map((p) => p.score || 0),
        0
      ),
    },
  }

  stats.hijaiyah.progress = Math.round(
    (stats.hijaiyah.completed / stats.hijaiyah.total) * 100
  )

  return stats
}
