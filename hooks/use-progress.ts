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
