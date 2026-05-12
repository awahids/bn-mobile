"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  CheckCircle2,
  Headphones,
  Loader2,
  MapPin,
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

type QuizType = "identify" | "spot" | "audio";

const AUTO_SAVE_ANSWER_COUNT = 5;
const GUEST_QUIZ_LIMIT_STORAGE_KEY = "bn_tajwid_guest_quiz_limit_v1";
const TAJWID_MIXED_CATEGORY = "tajwid_mixed";

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

type MixedQuestion =
  | { type: "identify"; payload: IdentifyQuestion }
  | { type: "spot"; payload: SpotQuestion }
  | { type: "audio"; payload: AudioQuestion };

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

function buildMixedQuestion(rules: TajwidRuleAPI[]): MixedQuestion | null {
  const sequence = shuffle<QuizType>(["identify", "spot", "audio"]);
  for (const type of sequence) {
    if (type === "identify") {
      const payload = buildIdentifyQuestion(rules);
      if (payload) return { type, payload };
    }
    if (type === "spot") {
      const payload = buildSpotQuestion(rules);
      if (payload) return { type, payload };
    }
    if (type === "audio") {
      const payload = buildAudioQuestion(rules);
      if (payload) return { type, payload };
    }
  }
  return null;
}

function calculateScore(answers: QuizAnswer[]) {
  if (answers.length === 0) return 0;
  const correct = answers.filter((item) => item.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
}

function getQuestionTypeLabel(type: QuizType) {
  if (type === "identify") return "Tebak Hukum";
  if (type === "spot") return "Cari Bagian";
  return "Dengar & Tebak";
}

const TYPE_CONFIG = {
  identify: {
    icon: Brain,
    headerBg: "bg-chart-2/8",
    border: "border-chart-2/25",
    iconColor: "text-chart-2",
  },
  spot: {
    icon: MapPin,
    headerBg: "bg-amber-500/8",
    border: "border-amber-500/20",
    iconColor: "text-amber-600",
  },
  audio: {
    icon: Headphones,
    headerBg: "bg-violet-500/8",
    border: "border-violet-500/20",
    iconColor: "text-violet-600",
  },
} as const;

const ANSWER_LETTERS = ["A", "B", "C", "D"] as const;

function buildAnswerFromQuestion(question: MixedQuestion, selectedKey: string): {
  isCorrect: boolean;
  answer: QuizAnswer;
} {
  if (question.type === "identify") {
    const { payload } = question;
    const selectedRuleName =
      payload.options.find((option) => option.id === selectedKey)?.name ?? selectedKey;
    return {
      isCorrect: selectedKey === payload.correctRule.id,
      answer: {
        questionId: `identify:${payload.correctRule.id}:${payload.example.surah_name}:${payload.example.ayah_number}`,
        userAnswer: selectedRuleName,
        correctAnswer: payload.correctRule.name,
        isCorrect: selectedKey === payload.correctRule.id,
        timeSpent: 0,
      },
    };
  }

  if (question.type === "spot") {
    const { payload } = question;
    return {
      isCorrect: selectedKey === payload.correctSpot,
      answer: {
        questionId: `spot:${payload.targetRule.id}:${payload.example.surah_name}:${payload.example.ayah_number}`,
        userAnswer: selectedKey,
        correctAnswer: payload.correctSpot,
        isCorrect: selectedKey === payload.correctSpot,
        timeSpent: 0,
      },
    };
  }

  const { payload } = question;
  const selectedRuleName =
    payload.options.find((option) => option.id === selectedKey)?.name ?? selectedKey;
  return {
    isCorrect: selectedKey === payload.correctRule.id,
    answer: {
      questionId: `audio:${payload.correctRule.id}:${payload.example.surah_name}:${payload.example.ayah_number}`,
      userAnswer: selectedRuleName,
      correctAnswer: payload.correctRule.name,
      isCorrect: selectedKey === payload.correctRule.id,
      timeSpent: 0,
    },
  };
}

function getCorrectKey(question: MixedQuestion): string {
  if (question.type === "identify") return question.payload.correctRule.id;
  if (question.type === "spot") return question.payload.correctSpot;
  return question.payload.correctRule.id;
}

export function TajwidQuizSection({ rules }: TajwidQuizSectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const updateProgress = useUpdateProgress();

  const [question, setQuestion] = useState<MixedQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [sessionAnswers, setSessionAnswers] = useState<QuizAnswer[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isGuestQuizLocked, setIsGuestQuizLocked] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioPromptError, setAudioPromptError] = useState<string | null>(null);

  const sessionStartRef = useRef<number>(Date.now());
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
    setQuestion((prev) => prev ?? buildMixedQuestion(rules));
  }, [rules]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsGuestQuizLocked(false);
      return;
    }

    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(GUEST_QUIZ_LIMIT_STORAGE_KEY);
    setIsGuestQuizLocked(stored === "locked");
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const scorePercent = useMemo(() => {
    if (!stats.total) return 0;
    return Math.round((stats.correct / stats.total) * 100);
  }, [stats.correct, stats.total]);

  const persistSessionAttempt = useCallback(
    async (answers: QuizAnswer[], startedAtMs: number) => {
      if (!isAuthenticated || answers.length === 0) return false;

      const score = calculateScore(answers);
      const timeSpent = Math.max(1, Math.floor((Date.now() - startedAtMs) / 1000));

      try {
        setSaveError(null);
        await submitAttempt.mutateAsync({
          category: TAJWID_MIXED_CATEGORY,
          score,
          totalQuestions: answers.length,
          timeSpent,
          answers,
        });

        updateProgress.mutate({
          module: "quiz",
          itemId: TAJWID_MIXED_CATEGORY,
          progress: 100,
          completed: true,
          score,
          timeSpent,
        });

        setSaveMessage("Hasil kuis tajwid acak tersimpan.");
        return true;
      } catch {
        setSaveError("Gagal menyimpan hasil kuis. Coba lagi.");
        return false;
      }
    },
    [isAuthenticated, submitAttempt, updateProgress]
  );

  if (rules.length < 2 || !question) {
    return null;
  }

  const lockGuestQuiz = () => {
    setIsGuestQuizLocked(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GUEST_QUIZ_LIMIT_STORAGE_KEY, "locked");
    }
  };

  const goNextQuestion = () => {
    if (!isAuthenticated && isGuestQuizLocked) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setQuestion(buildMixedQuestion(rules));
    setSelectedAnswer(null);
    setAudioPromptError(null);
    setQuestionNumber((prev) => prev + 1);
  };

  const flushSession = async () => {
    const saved = await persistSessionAttempt(sessionAnswers, sessionStartRef.current);
    if (saved) {
      setSessionAnswers([]);
      sessionStartRef.current = Date.now();
    }
  };

  const submitAnswer = async (answerKey: string) => {
    if (selectedAnswer) return;
    if (!isAuthenticated && isGuestQuizLocked) return;

    setSelectedAnswer(answerKey);
    const { isCorrect, answer } = buildAnswerFromQuestion(question, answerKey);
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    const nextAnswers = [...sessionAnswers, answer];
    setSessionAnswers(nextAnswers);

    if (!isAuthenticated) {
      lockGuestQuiz();
      setSaveMessage("Sesi gratis selesai. Masuk untuk lanjut kuis berikutnya.");
      return;
    }

    if (nextAnswers.length >= AUTO_SAVE_ANSWER_COUNT) {
      const saved = await persistSessionAttempt(nextAnswers, sessionStartRef.current);
      if (saved) {
        setSessionAnswers([]);
        sessionStartRef.current = Date.now();
      }
    }
  };

  const playAudioPrompt = async () => {
    if (question.type !== "audio") return;
    if (!isAuthenticated && isGuestQuizLocked) return;

    setIsAudioLoading(true);
    setAudioPromptError(null);
    try {
      const audioUrl = await fetchTajwidExampleAudioUrl(question.payload.example);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const player = new Audio(audioUrl);
      audioRef.current = player;
      await player.play();
    } catch {
      setAudioPromptError("Gagal memutar audio ayat. Coba lagi.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const correctKey = getCorrectKey(question);
  const hasAnswered = selectedAnswer !== null;
  const config = TYPE_CONFIG[question.type];
  const TypeIcon = config.icon;

  const feedback = hasAnswered
    ? (() => {
        if (selectedAnswer === correctKey) return { ok: true, text: "Benar!" };
        if (question.type === "spot")
          return { ok: false, text: "Salah. Perhatikan pilihan yang disorot hijau." };
        const correctName =
          question.payload.options.find((o) => o.id === correctKey)?.name ?? correctKey;
        return { ok: false, text: `Salah. Jawaban: ${correctName}` };
      })()
    : null;

  return (
    <section className="space-y-4 px-4 pb-36 pt-4">
      {/* Score strip */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-foreground">{stats.correct}</span>
          <span className="text-sm text-muted-foreground">/ {stats.total} benar</span>
          {stats.total > 0 && (
            <span className="text-xs text-muted-foreground">({scorePercent}%)</span>
          )}
        </div>
        <Badge variant="outline" className="rounded-full">
          Soal #{questionNumber}
        </Badge>
      </div>

      {/* Guest locked */}
      {!isAuthenticated && isGuestQuizLocked && (
        <div className="rounded-2xl border border-amber-300/60 bg-amber-50 p-4 dark:bg-amber-950/20">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
            Kuota tamu sudah habis. Masuk untuk melanjutkan semua kuis tajwid.
          </p>
          <Button
            className="mt-3 w-full"
            onClick={() => router.push("/login?callbackUrl=/tajwid")}
          >
            Masuk untuk Lanjut
          </Button>
        </div>
      )}

      {/* Question card */}
      <div className={`overflow-hidden rounded-2xl border bg-card ${config.border}`}>
        {/* Type header */}
        <div className={`flex items-center justify-between px-4 py-2.5 ${config.headerBg}`}>
          <div className="flex items-center gap-2">
            <TypeIcon className={`h-3.5 w-3.5 ${config.iconColor}`} />
            <span className={`text-[11px] font-bold uppercase tracking-wider ${config.iconColor}`}>
              {getQuestionTypeLabel(question.type)}
            </span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            onClick={goNextQuestion}
            disabled={!isAuthenticated && isGuestQuizLocked}
          >
            <RefreshCcw className="h-3 w-3" />
            Lewati
          </button>
        </div>

        <div className="space-y-4 p-4">
          {/* Prompt */}
          <div>
            {question.type === "identify" && (
              <>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  Hukum tajwid apa yang paling tepat untuk potongan ayat berikut?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Pilih satu jawaban.</p>
              </>
            )}
            {question.type === "spot" && (
              <>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  Cari bagian yang menunjukkan hukum{" "}
                  <span className={config.iconColor}>{question.payload.targetRule.name}</span>.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pilih potongan teks yang paling sesuai dengan aturan yang dituju.
                </p>
              </>
            )}
            {question.type === "audio" && (
              <>
                <p className="text-sm font-semibold leading-snug text-foreground">
                  Dengarkan audio ayat, lalu pilih hukum tajwid yang paling tepat.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Putar audio dulu, baru pilih jawaban.
                </p>
              </>
            )}
          </div>

          {/* Verse / audio */}
          {question.type === "identify" && (
            <div className="rounded-xl bg-muted/50 px-4 py-3 text-right">
              <p className="font-arabic text-2xl leading-[2] text-foreground" dir="rtl">
                {getFocusedExcerpt(
                  question.payload.example.full_text,
                  question.payload.example.highlighted_text
                )}
              </p>
            </div>
          )}

          {question.type === "spot" && (
            <div className="rounded-xl bg-muted/50 px-4 py-3 text-right">
              <p className="font-arabic text-2xl leading-[2] text-foreground" dir="rtl">
                {question.payload.example.full_text}
              </p>
            </div>
          )}

          {question.type === "audio" && (
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">Ayat</p>
                  <p className="text-sm font-semibold text-foreground">
                    {question.payload.example.surah_name} · {question.payload.example.ayah_number}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void playAudioPrompt()}
                  disabled={isAudioLoading || (!isAuthenticated && isGuestQuizLocked)}
                  className="shrink-0 rounded-xl"
                >
                  {isAudioLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="mr-2 h-4 w-4" />
                  )}
                  {isAudioLoading ? "Memuat..." : "Putar Audio"}
                </Button>
              </div>
              {audioPromptError && (
                <p className="mt-2 text-xs text-red-600">{audioPromptError}</p>
              )}
            </div>
          )}

          {/* Answer options */}
          <div className="space-y-2">
            {question.type !== "spot" &&
              question.payload.options.map((option, idx) => {
                const isSelected = selectedAnswer === option.id;
                const showAsCorrect = !!selectedAnswer && option.id === correctKey;
                const showAsWrong = isSelected && option.id !== correctKey;
                const isDimmed = !!selectedAnswer && !showAsCorrect && !showAsWrong;
                const letter = ANSWER_LETTERS[idx] ?? String(idx + 1);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => void submitAnswer(option.id)}
                    disabled={!!selectedAnswer || (!isAuthenticated && isGuestQuizLocked)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-default ${
                      showAsCorrect
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                        : showAsWrong
                          ? "border-red-400 bg-red-500/10 text-red-700"
                          : isDimmed
                            ? "border-border/40 bg-muted/20 text-muted-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        showAsCorrect
                          ? "bg-emerald-500 text-white"
                          : showAsWrong
                            ? "bg-red-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {showAsCorrect ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : showAsWrong ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        letter
                      )}
                    </span>
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                );
              })}

            {question.type === "spot" &&
              question.payload.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const showAsCorrect = !!selectedAnswer && option === correctKey;
                const showAsWrong = isSelected && option !== correctKey;
                const isDimmed = !!selectedAnswer && !showAsCorrect && !showAsWrong;
                const letter = ANSWER_LETTERS[idx] ?? String(idx + 1);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => void submitAnswer(option)}
                    disabled={!!selectedAnswer || (!isAuthenticated && isGuestQuizLocked)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition-colors disabled:cursor-default ${
                      showAsCorrect
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                        : showAsWrong
                          ? "border-red-400 bg-red-500/10 text-red-700"
                          : isDimmed
                            ? "border-border/40 bg-muted/20 text-muted-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        showAsCorrect
                          ? "bg-emerald-500 text-white"
                          : showAsWrong
                            ? "bg-red-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {showAsCorrect ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : showAsWrong ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        letter
                      )}
                    </span>
                    <span className="w-full font-arabic text-xl" dir="rtl">
                      {option}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* Feedback after answering */}
          {feedback && (
            <div
              className={`flex items-start gap-2 rounded-xl px-4 py-3 ${
                feedback.ok
                  ? "bg-emerald-500/10 text-emerald-700"
                  : "bg-red-500/10 text-red-700"
              }`}
            >
              {feedback.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <p className="text-sm font-semibold">{feedback.text}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            {hasAnswered && !(!isAuthenticated && isGuestQuizLocked) && (
              <Button
                type="button"
                onClick={goNextQuestion}
                className="w-full bg-chart-2 text-white hover:bg-chart-2/90"
              >
                Soal Berikutnya
              </Button>
            )}
            {isAuthenticated && sessionAnswers.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={() => void flushSession()}
                disabled={submitAttempt.isPending}
              >
                {submitAttempt.isPending ? (
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-3 w-3" />
                )}
                Simpan {sessionAnswers.length} jawaban ke server
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status messages */}
      {saveMessage && (
        <p className="text-center text-xs font-medium text-emerald-600">{saveMessage}</p>
      )}
      {saveError && (
        <p className="text-center text-xs font-medium text-red-600">{saveError}</p>
      )}

      {/* Guest upsell */}
      {!isAuthenticated && !isGuestQuizLocked && (
        <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">Masuk untuk menyimpan progres kuis.</p>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full text-xs"
            onClick={() => router.push("/login?callbackUrl=/tajwid")}
          >
            Masuk
          </Button>
        </div>
      )}
    </section>
  );
}
