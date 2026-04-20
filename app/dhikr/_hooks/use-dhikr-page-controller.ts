import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth";
import { useAudio } from "@/hooks/use-audio";
import { CreateDhikrCounterData, DhikrCounter, DhikrItem } from "@/lib/api-core";

export function useDhikrPageController() {
  const { status, isAuthenticated } = useAuth();
  const [currentSession, setCurrentSession] = useState<"morning" | "evening">("morning");
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [selectedDhikr, setSelectedDhikr] = useState<string | null>(null);
  const [guestCounters, setGuestCounters] = useState<Record<string, number>>({});
  const [today, setToday] = useState("");
  const [timeBasedGreeting, setTimeBasedGreeting] = useState("Dhikr Pagi");

  const queryClient = useQueryClient();
  const audio = useAudio();

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  const { data: allDhikrs = [], isLoading: isLoadingDhikrs } = useQuery({
    queryKey: ["dhikrs", "v2"],
    queryFn: async () => {
      console.log("Fetching dhikrs from API...");
      const data = await api.dhikr.getDhikrs();
      console.log("Fetched dhikrs:", data);
      return data;
    },
    staleTime: 1000 * 60 * 5, // Kurangi jadi 5 menit aja untuk testing
  });

  const { data: counters = [], error: countersError } = useQuery({
    queryKey: ["dhikr-counters", today],
    queryFn: () => api.dhikr.getCounters(today),
    enabled: status === "authenticated" && !!today,
    retry: false,
  });

  const updateCounter = useMutation({
    mutationFn: (data: CreateDhikrCounterData) => api.dhikr.updateCounter(data),
    onMutate: async (nextData: CreateDhikrCounterData) => {
      const queryKey = ["dhikr-counters", today] as const;
      await queryClient.cancelQueries({ queryKey });

      const previousCounters = queryClient.getQueryData<DhikrCounter[]>(queryKey) || [];
      const existingIndex = previousCounters.findIndex(
        (counter) =>
          counter.dhikrId === nextData.dhikrId &&
          counter.session === nextData.session &&
          counter.date === nextData.date
      );

      const fallbackTarget = allDhikrs.find((d: DhikrItem) => d.id === nextData.dhikrId)?.count || 33;
      const optimisticTarget =
        nextData.target ??
        (existingIndex >= 0 ? previousCounters[existingIndex].target : fallbackTarget);

      const optimisticCounter: DhikrCounter = {
        id:
          existingIndex >= 0
            ? previousCounters[existingIndex].id
            : `optimistic-${nextData.dhikrId}-${nextData.session}-${nextData.date}`,
        userId: existingIndex >= 0 ? previousCounters[existingIndex].userId : "",
        dhikrId: nextData.dhikrId,
        count: nextData.count,
        target: optimisticTarget,
        date: nextData.date,
        session: nextData.session,
        completed: nextData.completed ?? nextData.count >= optimisticTarget,
      };

      const nextCounters = [...previousCounters];
      if (existingIndex >= 0) {
        nextCounters[existingIndex] = optimisticCounter;
      } else {
        nextCounters.push(optimisticCounter);
      }

      queryClient.setQueryData(queryKey, nextCounters);

      return { previousCounters, queryKey };
    },
    onError: (error, _, context) => {
      if (context?.previousCounters && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousCounters);
      }
      console.error("🚨 Dhikr counter update failed:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dhikr-counters", today] });
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const now = new Date();
    const hour = now.getHours();

    if (hour >= 6 && hour < 12) {
      setCurrentSession("morning");
    } else if (hour >= 15 && hour < 19) {
      setCurrentSession("evening");
    }
  }, []);

  const currentDhikrList = useMemo(() => {
    if (!allDhikrs.length) return [];
    if (currentSession === "morning") {
      return allDhikrs.filter(
        (d: DhikrItem) => d.session === "morning" || d.session === "both"
      );
    }
    return allDhikrs.filter(
      (d: DhikrItem) => d.session === "evening" || d.session === "both"
    );
  }, [allDhikrs, currentSession]);

  const getCounterData = (dhikrId: string) => {
    const target = allDhikrs.find((d: DhikrItem) => d.id === dhikrId)?.count || 33;
    const guestCounterKey = `${today}:${currentSession}:${dhikrId}`;

    if (!isAuthenticated) {
      const count = guestCounters[guestCounterKey] || 0;
      return {
        count,
        completed: count >= target,
        target,
      };
    }

    const counter = counters.find(
      (c: DhikrCounter) => c.dhikrId === dhikrId && c.session === currentSession && c.date === today
    );

    return {
      count: counter?.count || 0,
      completed: counter?.completed || false,
      target: counter?.target || target,
    };
  };

  const handleCounterUpdate = async (dhikrId: string, newCount: number) => {
    const dhikr = allDhikrs.find((d: DhikrItem) => d.id === dhikrId);
    if (!dhikr) return;
    if (!today) return;

    if (!isAuthenticated) {
      const key = `${today}:${currentSession}:${dhikrId}`;
      setGuestCounters((prev) => ({
        ...prev,
        [key]: Math.max(0, Math.min(newCount, dhikr.count)),
      }));
      return;
    }

    await updateCounter.mutateAsync({
      dhikrId,
      count: newCount,
      target: dhikr.count,
      date: today,
      session: currentSession,
      completed: newCount >= dhikr.count,
    });
  };

  const resetAllCounters = async () => {
    if (!today) return;

    if (!isAuthenticated) {
      setGuestCounters((prev) => {
        const next = { ...prev };
        for (const dhikr of currentDhikrList) {
          next[`${today}:${currentSession}:${dhikr.id}`] = 0;
        }
        return next;
      });
      return;
    }

    for (const dhikr of currentDhikrList) {
      await handleCounterUpdate(dhikr.id, 0);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      audio.play(audioUrl);
      setAudioPlayerVisible(true);
    }
  };

  const totalCompleted = currentDhikrList.filter((dhikr: DhikrItem) => getCounterData(dhikr.id).completed).length;
  const completionPercentage = currentDhikrList.length > 0 ? Math.round((totalCompleted / currentDhikrList.length) * 100) : 0;

  const getTimeBasedGreeting = () => {
    if (typeof window === "undefined") return "Dhikr Pagi";

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Dhikr Pagi";
    if (hour >= 12 && hour < 18) return "Dhikr Siang";
    if (hour >= 18 && hour < 24) return "Dhikr Petang";
    return "Dhikr Malam";
  };

  useEffect(() => {
    setTimeBasedGreeting(getTimeBasedGreeting());
  }, []);

  const selectedDhikrTitle = useMemo(
    () => (selectedDhikr ? allDhikrs.find((d: DhikrItem) => d.id === selectedDhikr)?.transliteration || "" : ""),
    [selectedDhikr, allDhikrs]
  );

  const selectedDhikrAudioUrl = useMemo(
    () => (selectedDhikr ? allDhikrs.find((d: DhikrItem) => d.id === selectedDhikr)?.audioUrl || "" : ""),
    [selectedDhikr, allDhikrs]
  );

  return {
    status,
    isAuthenticated,
    currentSession,
    setCurrentSession,
    audioPlayerVisible,
    setAudioPlayerVisible,
    selectedDhikr,
    setSelectedDhikr,
    countersError,
    audio,
    currentDhikrList,
    totalCompleted,
    completionPercentage,
    timeBasedGreeting,
    getCounterData,
    handleCounterUpdate,
    resetAllCounters,
    playAudio,
    selectedDhikrTitle,
    selectedDhikrAudioUrl,
    isLoadingDhikrs,
  };
}
