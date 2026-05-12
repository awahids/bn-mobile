"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Crosshair,
  HelpCircle,
  Loader2,
  RefreshCcw,
  Save,
  Volume2,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateProgress } from "@/hooks/use-progress";
import { api, type CreateQuizAttemptData, type QuizAnswer } from "@/lib/api-client";
import { fetchTajwidExampleAudioUrl } from "@/lib/tajwid-example-audio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TajwidExampleAPI, TajwidRuleAPI } from "@/lib/api-core";

type QuizMode = "identify" | "spot" | "audio";

const AUTO_SAVE_ANSWER_COUNT = 5;
const GUEST_QUIZ_LIMIT_STORAGE_KEY = "bn_tajwid_guest_quiz_limit_v1";
const QUIZ_CATEGORY_BY_MODE: Record<QuizMode, string> = {
  identify: "tajwid_identify",
  spot: "tajwid_spot",
  audio: "tajwid_audio",
};

interface IdentifyQuestion {
  example: TajwidExampleAPI;
  correctRule: TajwidRuleAPI;
  options: TajwidRuleAPI[];
}

interface SpotQuestion {
  example: TajwidExampleAPI;
  targetRule: TajwidRuleAPI;
  options: string[];
  correctSpot: string;
}

interface AudioQuestion {
  example: TajwidExampleAPI;
  correctRule: TajwidRuleAPI;
  options: TajwidRuleAPI[];
}

interface TajwidQuizSectionProps {
  rules: TajwidRuleAPI[];
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function getRulesWithExamples(rules: TajwidRuleAPI[]) {
  return rules.filter((rule) => rule.examples.length > 0);
}

function getFocusedExcerpt(fullText: string, highlightedText: string) {
  if (!highlightedText || !fullText.includes(highlightedText)) return fullText;
  const start = fullText.indexOf(highlightedText);
  const before = fullText.slice(Math.max(0, start - 20), start).trimStart();
  const after = fullText
    .slice(start + highlightedText.length, start + highlightedText.length + 20)
    .trimEnd();
  return `${before ? `…${before} ` : ""}${highlightedText}${after ? ` ${after}…` : ""}`;
}

function buildIdentifyQuestion(rules: TajwidRuleAPI[]): IdentifyQuestion | null {
  const candidates = getRulesWithExamples(rules);
  if (candidates.length < 2) return null;

  const correctRule = randomItem(candidates);
  const example = randomItem(correctRule.examples);
  const distractors = shuffle(candidates.filter((rule) => rule.id !== correctRule.id)).slice(0, 3);
  const options = shuffle([correctRule, ...distractors]);

  return { example, correctRule, options };
}

function buildSpotQuestion(rules: TajwidRuleAPI[]): SpotQuestion | null {
  const candidates = getRulesWithExamples(rules).filter((rule) =>
    rule.examples.some((example) => example.highlighted_text)
  );
  if (candidates.length < 2) return null;

  const targetRule = randomItem(candidates);
  const example = randomItem(targetRule.examples);
  const correctSpot = example.highlighted_text.trim();
  if (!correctSpot) return null;

  const allHighlights = rules
    .flatMap((rule) => rule.examples.map((item) => item.highlighted_text.trim()))
    .filter((text) => text && text !== correctSpot && !example.full_text.includes(text));
  const distractors = shuffle(Array.from(new Set(allHighlights))).slice(0, 3);
  const options = shuffle([correctSpot, ...distractors]);

  return {
    example,
    targetRule,
    options,
    correctSpot,
  };
}

function buildAudioQuestion(rules: TajwidRuleAPI[]): AudioQuestion | null {
  const candidates = getRulesWithExamples(rules);
  if (candidates.length < 2) return null;

  const correctRule = randomItem(candidates);
  const example = randomItem(correctRule.examples);
  const distractors = shuffle(candidates.filter((rule) => rule.id !== correctRule.id)).slice(0, 3);
  const options = shuffle([correctRule, ...distractors]);

  return { example, correctRule, options };
}

function calculateScore(answers: QuizAnswer[]) {
  if (answers.length === 0) return 0;
  const correct = answers.filter((item) => item.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
}

export function TajwidQuizSection({ rules }: TajwidQuizSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const updateProgress = useUpdateProgress();

  const [mode, setMode] = useState<QuizMode>("identify");
  const [identifyQuestion, setIdentifyQuestion] = useState<IdentifyQuestion | null>(null);
  const [spotQuestion, setSpotQuestion] = useState<SpotQuestion | null>(null);
  const [audioQuestion, setAudioQuestion] = useState<AudioQuestion | null>(null);
  const [identifyAnswer, setIdentifyAnswer] = useState<string | null>(null);
  const [spotAnswer, setSpotAnswer] = useState<string | null>(null);
  const [audioAnswer, setAudioAnswer] = useState<string | null>(null);
  const [identifyStats, setIdentifyStats] = useState({ correct: 0, total: 0 });
  const [spotStats, setSpotStats] = useState({ correct: 0, total: 0 });
  const [audioStats, setAudioStats] = useState({ correct: 0, total: 0 });
  const [identifySessionAnswers, setIdentifySessionAnswers] = useState<QuizAnswer[]>([]);
  const [spotSessionAnswers, setSpotSessionAnswers] = useState<QuizAnswer[]>([]);
  const [audioSessionAnswers, setAudioSessionAnswers] = useState<QuizAnswer[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGuestQuizLocked, setIsGuestQuizLocked] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioPromptError, setAudioPromptError] = useState<string | null>(null);

  const identifySessionStartRef = useRef<number>(Date.now());
  const spotSessionStartRef = useRef<number>(Date.now());
  const audioSessionStartRef = useRef<number>(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const submitAttempt = useMutation({
    mutationFn: (data: CreateQuizAttemptData) => api.quiz.createAttempt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-stats"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts"] });
    },
  });

  useEffect(() => {
    if (rules.length === 0) return;
    setIdentifyQuestion((prev) => prev ?? buildIdentifyQuestion(rules));
    setSpotQuestion((prev) => prev ?? buildSpotQuestion(rules));
    setAudioQuestion((prev) => prev ?? buildAudioQuestion(rules));
  }, [rules]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsGuestQuizLocked(false);
      return;
    }

    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(GUEST_QUIZ_LIMIT_STORAGE_KEY);
    setIsGuestQuizLocked(stored === "locked");
  }, [isAuthenticated]);

  const identifyScore = useMemo(() => {
    if (!identifyStats.total) return 0;
    return Math.round((identifyStats.correct / identifyStats.total) * 100);
  }, [identifyStats.correct, identifyStats.total]);

  const spotScore = useMemo(() => {
    if (!spotStats.total) return 0;
    return Math.round((spotStats.correct / spotStats.total) * 100);
  }, [spotStats.correct, spotStats.total]);

  const audioScore = useMemo(() => {
    if (!audioStats.total) return 0;
    return Math.round((audioStats.correct / audioStats.total) * 100);
  }, [audioStats.correct, audioStats.total]);

  const persistModeAttempt = useCallback(
    async (targetMode: QuizMode, answers: QuizAnswer[], startedAtMs: number) => {
      if (!isAuthenticated || answers.length === 0) return false;

      const score = calculateScore(answers);
      const timeSpent = Math.max(1, Math.floor((Date.now() - startedAtMs) / 1000));
      const category = QUIZ_CATEGORY_BY_MODE[targetMode];

      try {
        setSaveError(null);
        await submitAttempt.mutateAsync({
          category,
          score,
          totalQuestions: answers.length,
          timeSpent,
          answers,
        });

        updateProgress.mutate({
          module: "quiz",
          itemId: category,
          progress: 100,
          completed: true,
          score,
          timeSpent,
        });

        const modeLabel =
          targetMode === "identify"
            ? "Identify Rule"
            : targetMode === "spot"
              ? "Find the Spot"
              : "Identify by Audio";
        setSaveMessage(`Hasil quiz ${modeLabel} tersimpan.`);
        return true;
      } catch {
        setSaveError("Gagal menyimpan hasil quiz. Coba lagi.");
        return false;
      }
    },
    [isAuthenticated, submitAttempt, updateProgress]
  );

  if (rules.length < 2) {
    return null;
  }

  const lockGuestQuiz = () => {
    setIsGuestQuizLocked(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GUEST_QUIZ_LIMIT_STORAGE_KEY, "locked");
    }
  };

  const nextIdentifyQuestion = () => {
    if (!isAuthenticated && isGuestQuizLocked) return;
    setIdentifyQuestion(buildIdentifyQuestion(rules));
    setIdentifyAnswer(null);
  };

  const nextSpotQuestion = () => {
    if (!isAuthenticated && isGuestQuizLocked) return;
    setSpotQuestion(buildSpotQuestion(rules));
    setSpotAnswer(null);
  };

  const nextAudioQuestion = () => {
    if (!isAuthenticated && isGuestQuizLocked) return;
    setAudioQuestion(buildAudioQuestion(rules));
    setAudioAnswer(null);
    setAudioPromptError(null);
  };

  const flushIdentifySession = async () => {
    const saved = await persistModeAttempt("identify", identifySessionAnswers, identifySessionStartRef.current);
    if (saved) {
      setIdentifySessionAnswers([]);
      identifySessionStartRef.current = Date.now();
    }
  };

  const flushSpotSession = async () => {
    const saved = await persistModeAttempt("spot", spotSessionAnswers, spotSessionStartRef.current);
    if (saved) {
      setSpotSessionAnswers([]);
      spotSessionStartRef.current = Date.now();
    }
  };

  const flushAudioSession = async () => {
    const saved = await persistModeAttempt("audio", audioSessionAnswers, audioSessionStartRef.current);
    if (saved) {
      setAudioSessionAnswers([]);
      audioSessionStartRef.current = Date.now();
    }
  };

  const submitIdentifyAnswer = async (ruleId: string) => {
    if (!identifyQuestion || identifyAnswer) return;
    if (!isAuthenticated && isGuestQuizLocked) return;

    setIdentifyAnswer(ruleId);
    const isCorrect = ruleId === identifyQuestion.correctRule.id;
    setIdentifyStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    const selectedRuleName =
      identifyQuestion.options.find((option) => option.id === ruleId)?.name ?? ruleId;
    const answer: QuizAnswer = {
      questionId: `identify:${identifyQuestion.correctRule.id}:${identifyQuestion.example.surah_name}:${identifyQuestion.example.ayah_number}`,
      userAnswer: selectedRuleName,
      correctAnswer: identifyQuestion.correctRule.name,
      isCorrect,
      timeSpent: 0,
    };

    const nextAnswers = [...identifySessionAnswers, answer];
    setIdentifySessionAnswers(nextAnswers);

    if (!isAuthenticated) {
      lockGuestQuiz();
      setSaveMessage("Sesi gratis selesai. Login untuk lanjut quiz berikutnya.");
      return;
    }

    if (nextAnswers.length >= AUTO_SAVE_ANSWER_COUNT) {
      const saved = await persistModeAttempt("identify", nextAnswers, identifySessionStartRef.current);
      if (saved) {
        setIdentifySessionAnswers([]);
        identifySessionStartRef.current = Date.now();
      }
    }
  };

  const submitSpotAnswer = async (spot: string) => {
    if (!spotQuestion || spotAnswer) return;
    if (!isAuthenticated && isGuestQuizLocked) return;

    setSpotAnswer(spot);
    const isCorrect = spot === spotQuestion.correctSpot;
    setSpotStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    const answer: QuizAnswer = {
      questionId: `spot:${spotQuestion.targetRule.id}:${spotQuestion.example.surah_name}:${spotQuestion.example.ayah_number}`,
      userAnswer: spot,
      correctAnswer: spotQuestion.correctSpot,
      isCorrect,
      timeSpent: 0,
    };

    const nextAnswers = [...spotSessionAnswers, answer];
    setSpotSessionAnswers(nextAnswers);

    if (!isAuthenticated) {
      lockGuestQuiz();
      setSaveMessage("Sesi gratis selesai. Login untuk lanjut quiz berikutnya.");
      return;
    }

    if (nextAnswers.length >= AUTO_SAVE_ANSWER_COUNT) {
      const saved = await persistModeAttempt("spot", nextAnswers, spotSessionStartRef.current);
      if (saved) {
        setSpotSessionAnswers([]);
        spotSessionStartRef.current = Date.now();
      }
    }
  };

  const submitAudioAnswer = async (ruleId: string) => {
    if (!audioQuestion || audioAnswer) return;
    if (!isAuthenticated && isGuestQuizLocked) return;

    setAudioAnswer(ruleId);
    const isCorrect = ruleId === audioQuestion.correctRule.id;
    setAudioStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    const selectedRuleName =
      audioQuestion.options.find((option) => option.id === ruleId)?.name ?? ruleId;
    const answer: QuizAnswer = {
      questionId: `audio:${audioQuestion.correctRule.id}:${audioQuestion.example.surah_name}:${audioQuestion.example.ayah_number}`,
      userAnswer: selectedRuleName,
      correctAnswer: audioQuestion.correctRule.name,
      isCorrect,
      timeSpent: 0,
    };

    const nextAnswers = [...audioSessionAnswers, answer];
    setAudioSessionAnswers(nextAnswers);

    if (!isAuthenticated) {
      lockGuestQuiz();
      setSaveMessage("Sesi gratis selesai. Login untuk lanjut quiz berikutnya.");
      return;
    }

    if (nextAnswers.length >= AUTO_SAVE_ANSWER_COUNT) {
      const saved = await persistModeAttempt("audio", nextAnswers, audioSessionStartRef.current);
      if (saved) {
        setAudioSessionAnswers([]);
        audioSessionStartRef.current = Date.now();
      }
    }
  };

  const playAudioPrompt = async () => {
    if (!audioQuestion) return;
    if (!isAuthenticated && isGuestQuizLocked) return;

    setIsAudioLoading(true);
    setAudioPromptError(null);
    try {
      const audioUrl = await fetchTajwidExampleAudioUrl(audioQuestion.example);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const player = new Audio(audioUrl);
      audioRef.current = player;
      await player.play();
    } catch {
      setAudioPromptError("Gagal memutar audio ayat. Coba ulang.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <section className="px-6 pb-36 pt-6">
      <div className="mb-6 rounded-[2rem] border border-chart-2/15 bg-gradient-to-br from-chart-2/12 via-background to-background p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-chart-2">
          Tajwid Quiz
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground">
          Validasi Pemahaman Tajwid
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Mode 1: Identify Rule. Mode 2: Find the Spot.
        </p>
        {!isAuthenticated && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-500/10 px-3 py-2">
            <p className="text-xs font-semibold text-amber-700">
              Guest hanya bisa 1 soal quiz. Login untuk lanjut semua soal.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/login?callbackUrl=/tajwid")}
            >
              Login
            </Button>
          </div>
        )}
        {saveMessage && <p className="mt-2 text-xs font-semibold text-emerald-600">{saveMessage}</p>}
        {saveError && <p className="mt-2 text-xs font-semibold text-red-600">{saveError}</p>}
      </div>

      <div className="mb-4 flex gap-2">
        <Button
          variant={mode === "identify" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setMode("identify")}
          disabled={!isAuthenticated && isGuestQuizLocked}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Identify Rule
        </Button>
        <Button
          variant={mode === "spot" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setMode("spot")}
          disabled={!isAuthenticated && isGuestQuizLocked}
        >
          <Crosshair className="mr-2 h-4 w-4" />
          Find the Spot
        </Button>
        <Button
          variant={mode === "audio" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => setMode("audio")}
          disabled={!isAuthenticated && isGuestQuizLocked}
        >
          <Volume2 className="mr-2 h-4 w-4" />
          Identify by Audio
        </Button>
      </div>

      {!isAuthenticated && isGuestQuizLocked && (
        <div className="mb-4 rounded-[1.5rem] border border-amber-300/70 bg-amber-500/10 p-4">
          <p className="text-sm font-semibold text-amber-800">
            Jatah guest sudah habis. Login untuk membuka semua quiz tajwid.
          </p>
          <Button
            className="mt-3 rounded-xl"
            onClick={() => router.push("/login?callbackUrl=/tajwid")}
          >
            Login untuk Lanjut
          </Button>
        </div>
      )}

      {mode === "identify" && identifyQuestion && (
        <div className="rounded-[1.75rem] border border-border/60 bg-card/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <Badge className="rounded-full bg-chart-2/10 text-chart-2 hover:bg-chart-2/10">
              Skor: {identifyStats.correct}/{identifyStats.total} ({identifyScore}%)
            </Badge>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                Pending simpan: {identifySessionAnswers.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextIdentifyQuestion}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Soal Baru
              </Button>
            </div>
          </div>

          <p className="text-sm font-bold text-foreground">
            Hukum tajwid apa yang paling tepat untuk potongan ayat berikut?
          </p>
          <div className="mt-3 rounded-xl bg-muted/40 p-4 text-right">
            <span className="font-arabic text-2xl leading-[1.9] text-foreground" dir="rtl">
              {getFocusedExcerpt(
                identifyQuestion.example.full_text,
                identifyQuestion.example.highlighted_text
              )}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {identifyQuestion.options.map((option) => {
              const isSelected = identifyAnswer === option.id;
              const isCorrectOption = identifyQuestion.correctRule.id === option.id;
              const showAsCorrect = identifyAnswer && isCorrectOption;
              const showAsWrong = isSelected && !isCorrectOption;

              return (
                <Button
                  key={option.id}
                  type="button"
                  variant="outline"
                  className={`justify-start rounded-xl ${
                    showAsCorrect
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                      : showAsWrong
                        ? "border-red-500 bg-red-500/10 text-red-700"
                        : ""
                  }`}
                  onClick={() => void submitIdentifyAnswer(option.id)}
                  disabled={!!identifyAnswer || (!isAuthenticated && isGuestQuizLocked)}
                >
                  {showAsCorrect && <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {showAsWrong && <XCircle className="mr-2 h-4 w-4" />}
                  {option.name}
                </Button>
              );
            })}
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => void flushIdentifySession()}
              disabled={!isAuthenticated || identifySessionAnswers.length === 0 || submitAttempt.isPending}
            >
              {submitAttempt.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Hasil Identify
            </Button>
          </div>
        </div>
      )}

      {mode === "spot" && spotQuestion && (
        <div className="rounded-[1.75rem] border border-border/60 bg-card/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <Badge className="rounded-full bg-chart-2/10 text-chart-2 hover:bg-chart-2/10">
              Skor: {spotStats.correct}/{spotStats.total} ({spotScore}%)
            </Badge>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                Pending simpan: {spotSessionAnswers.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={nextSpotQuestion}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Soal Baru
              </Button>
            </div>
          </div>

          <p className="text-sm font-bold text-foreground">
            Cari bagian ayat yang menunjukkan hukum <strong>{spotQuestion.targetRule.name}</strong>.
          </p>
          <div className="mt-3 rounded-xl bg-muted/40 p-4 text-right">
            <span className="font-arabic text-2xl leading-[1.9] text-foreground" dir="rtl">
              {spotQuestion.example.full_text}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {spotQuestion.options.map((option) => {
              const isSelected = spotAnswer === option;
              const isCorrectOption = spotQuestion.correctSpot === option;
              const showAsCorrect = spotAnswer && isCorrectOption;
              const showAsWrong = isSelected && !isCorrectOption;

              return (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  className={`justify-end rounded-xl text-right font-arabic text-xl ${
                    showAsCorrect
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                      : showAsWrong
                        ? "border-red-500 bg-red-500/10 text-red-700"
                        : ""
                  }`}
                  onClick={() => void submitSpotAnswer(option)}
                  disabled={!!spotAnswer || (!isAuthenticated && isGuestQuizLocked)}
                >
                  {option}
                </Button>
              );
            })}
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => void flushSpotSession()}
              disabled={!isAuthenticated || spotSessionAnswers.length === 0 || submitAttempt.isPending}
            >
              {submitAttempt.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Hasil Spot
            </Button>
          </div>
        </div>
      )}

      {mode === "audio" && audioQuestion && (
        <div className="rounded-[1.75rem] border border-border/60 bg-card/80 p-5">
          <div className="mb-4 flex items-center justify-between">
            <Badge className="rounded-full bg-chart-2/10 text-chart-2 hover:bg-chart-2/10">
              Skor: {audioStats.correct}/{audioStats.total} ({audioScore}%)
            </Badge>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                Pending simpan: {audioSessionAnswers.length}
              </Badge>
              <Button variant="ghost" size="sm" onClick={nextAudioQuestion}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Soal Baru
              </Button>
            </div>
          </div>

          <p className="text-sm font-bold text-foreground">
            Dengarkan audio ayat, lalu pilih hukum tajwid yang paling tepat.
          </p>
          <div className="mt-3 rounded-xl bg-muted/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold text-muted-foreground">
                {audioQuestion.example.surah_name} : {audioQuestion.example.ayah_number}
              </p>
              <Button
                type="button"
                onClick={() => void playAudioPrompt()}
                disabled={isAudioLoading || (!isAuthenticated && isGuestQuizLocked)}
                className="rounded-xl"
              >
                {isAudioLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="mr-2 h-4 w-4" />
                )}
                Putar Audio
              </Button>
            </div>
            {audioPromptError && (
              <p className="mt-2 text-xs font-semibold text-red-600">{audioPromptError}</p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {audioQuestion.options.map((option) => {
              const isSelected = audioAnswer === option.id;
              const isCorrectOption = audioQuestion.correctRule.id === option.id;
              const showAsCorrect = audioAnswer && isCorrectOption;
              const showAsWrong = isSelected && !isCorrectOption;

              return (
                <Button
                  key={option.id}
                  type="button"
                  variant="outline"
                  className={`justify-start rounded-xl ${
                    showAsCorrect
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                      : showAsWrong
                        ? "border-red-500 bg-red-500/10 text-red-700"
                        : ""
                  }`}
                  onClick={() => void submitAudioAnswer(option.id)}
                  disabled={!!audioAnswer || (!isAuthenticated && isGuestQuizLocked)}
                >
                  {showAsCorrect && <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {showAsWrong && <XCircle className="mr-2 h-4 w-4" />}
                  {option.name}
                </Button>
              );
            })}
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => void flushAudioSession()}
              disabled={!isAuthenticated || audioSessionAnswers.length === 0 || submitAttempt.isPending}
            >
              {submitAttempt.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Simpan Hasil Audio
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
