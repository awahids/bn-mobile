"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAudio } from "@/hooks/use-audio";
import { useProgress, useUpdateProgress } from "@/hooks/use-progress";
import { useTajwidRules } from "@/hooks/use-tajwid";
import { fetchTajwidExampleAudioUrl } from "@/lib/tajwid-example-audio";
import type { TajwidExampleAPI, TajwidRuleAPI } from "@/lib/api-core";

export function useTajwidPageController() {
  const { status, isAuthenticated } = useAuth();
  const { data: rules = [] } = useTajwidRules();
  const [selectedRule, setSelectedRule] = useState<TajwidRuleAPI | null>(null);
  const [currentTab, setCurrentTab] = useState<"learn" | "overview" | "quiz">("learn");
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(false);
  const [loadingExampleAudioKey, setLoadingExampleAudioKey] = useState<string | null>(null);
  const [guestCompletedRules, setGuestCompletedRules] = useState<string[]>([]);
  const trackedRuleIdsRef = useRef<Set<string>>(new Set());

  const { data: progressData = [] } = useProgress("tajwid", {
    enabled: status === "authenticated",
  });
  const updateProgress = useUpdateProgress();
  const audio = useAudio();

  useEffect(() => {
    if (rules.length > 0 && !selectedRule) {
      setSelectedRule(rules[0]);
    }
  }, [rules, selectedRule]);

  useEffect(() => {
    if (!selectedRule) {
      return;
    }

    if (!isAuthenticated) {
      setGuestCompletedRules((prev) =>
        prev.includes(selectedRule.id) ? prev : [...prev, selectedRule.id]
      );
      return;
    }

    if (trackedRuleIdsRef.current.has(selectedRule.id)) {
      return;
    }

    trackedRuleIdsRef.current.add(selectedRule.id);
    updateProgress.mutate({
      module: "tajwid",
      itemId: selectedRule.id,
      progress: 100,
      completed: true,
      score: 0,
      timeSpent: 0,
    });
  }, [isAuthenticated, selectedRule, updateProgress]);

  const getRuleProgress = (ruleId: string) => {
    if (!isAuthenticated) {
      const completed = guestCompletedRules.includes(ruleId);
      return {
        progress: completed ? 100 : 0,
        completed,
      };
    }

    const progress = progressData.find((item) => item.itemId === ruleId);
    return {
      progress: progress?.progress ?? 0,
      completed: progress?.completed ?? false,
    };
  };

  const navigateToRule = (direction: "prev" | "next") => {
    if (!selectedRule) {
      return;
    }

    const currentIndex = rules.findIndex((rule) => rule.id === selectedRule.id);
    if (direction === "prev" && currentIndex > 0) {
      setSelectedRule(rules[currentIndex - 1]);
    }
    if (direction === "next" && currentIndex < rules.length - 1) {
      setSelectedRule(rules[currentIndex + 1]);
    }
  };

  const openAudioPlayer = (rule: TajwidRuleAPI) => {
    if (!rule.audioUrl) {
      return;
    }

    audio.setMeta({
      title: rule.name,
      subtitle: rule.arabicName,
    });
    audio.play(rule.audioUrl);
    setAudioPlayerVisible(true);
  };

  const openExampleAudio = async (example: TajwidExampleAPI) => {
    const exampleKey = `${example.surah_name}:${example.ayah_number}`;
    setLoadingExampleAudioKey(exampleKey);

    try {
      const audioUrl = await fetchTajwidExampleAudioUrl(example);
      audio.setMeta({
        title: `${example.surah_name} : ${example.ayah_number}`,
        subtitle: selectedRule?.name ?? "Contoh Ayat Tajwid",
      });
      await audio.play(audioUrl);
      setAudioPlayerVisible(true);
    } catch {
      if (selectedRule?.audioUrl) {
        audio.setMeta({
          title: selectedRule.name,
          subtitle: selectedRule.arabicName,
        });
        await audio.play(selectedRule.audioUrl);
        setAudioPlayerVisible(true);
      }
    } finally {
      setLoadingExampleAudioKey(null);
    }
  };

  const completedCount = isAuthenticated
    ? progressData.filter((item) => item.completed).length
    : guestCompletedRules.length;
  const totalRules = rules.length || 15;
  const overallProgress = Math.round((completedCount / totalRules) * 100);
  const selectedRuleIndex = selectedRule
    ? rules.findIndex((rule) => rule.id === selectedRule.id)
    : -1;

  const selectedRuleProgress = useMemo(() => {
    return selectedRule
      ? getRuleProgress(selectedRule.id)
      : { progress: 0, completed: false };
  }, [isAuthenticated, guestCompletedRules, progressData, selectedRule]);

  return {
    isAuthenticated,
    rules,
    selectedRule,
    setSelectedRule,
    selectedRuleIndex,
    selectedRuleProgress,
    currentTab,
    setCurrentTab,
    audioPlayerVisible,
    setAudioPlayerVisible,
    audio,
    completedCount,
    totalRules,
    overallProgress,
    getRuleProgress,
    navigateToRule,
    openAudioPlayer,
    openExampleAudio,
    loadingExampleAudioKey,
  };
}
