"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Save,
  Shuffle,
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
  if (type === "identify") return "Identify Rule";
  if (type === "spot") return "Find the Spot";
  return "Identify by Audio";
}

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

        setSaveMessage("Hasil Tajwid Quiz acak tersimpan.");
        return true;
      } catch {
        setSaveError("Gagal menyimpan hasil quiz. Coba lagi.");
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
      setSaveMessage("Sesi gratis selesai. Login untuk lanjut quiz berikutnya.");
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
      setAudioPromptError("Gagal memutar audio ayat. Coba ulang.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  const correctKey = getCorrectKey(question);
  const hasAnswered = selectedAnswer !== null;

  return (
    <section className="px-6 pb-36 pt-6">
      <div className="mb-6 rounded-[2rem] border border-chart-2/15 bg-gradient-to-br from-chart-2/12 via-background to-background p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-chart-2">
          Tajwid Quiz
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground">
          Quiz Acak Semua Tipe
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Tipe soal diacak otomatis: Identify Rule, Find the Spot, atau Identify by Audio.
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

      <div className="rounded-[1.75rem] border border-border/60 bg-card/80 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Badge className="rounded-full bg-chart-2/10 text-chart-2 hover:bg-chart-2/10">
            Skor: {stats.correct}/{stats.total} ({scorePercent}%)
          </Badge>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              Soal #{questionNumber}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Tipe: {getQuestionTypeLabel(question.type)}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Pending simpan: {sessionAnswers.length}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={goNextQuestion}
              disabled={!isAuthenticated && isGuestQuizLocked}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Lewati
            </Button>
          </div>
        </div>

        {question.type === "identify" && (
          <>
            <p className="text-sm font-bold text-foreground">
              Hukum tajwid apa yang paling tepat untuk potongan ayat berikut?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pilih satu jawaban, lalu lanjut ke soal berikutnya.
            </p>
            <div className="mt-3 rounded-xl bg-muted/40 p-4 text-right">
              <span className="font-arabic text-2xl leading-[1.9] text-foreground" dir="rtl">
                {getFocusedExcerpt(
                  question.payload.example.full_text,
                  question.payload.example.highlighted_text
                )}
              </span>
            </div>
          </>
        )}

        {question.type === "spot" && (
          <>
            <p className="text-sm font-bold text-foreground">
              Cari bagian ayat yang menunjukkan hukum{" "}
              <strong>{question.payload.targetRule.name}</strong>.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pilih potongan teks yang paling sesuai dengan rule target.
            </p>
            <div className="mt-3 rounded-xl bg-muted/40 p-4 text-right">
              <span className="font-arabic text-2xl leading-[1.9] text-foreground" dir="rtl">
                {question.payload.example.full_text}
              </span>
            </div>
          </>
        )}

        {question.type === "audio" && (
          <>
            <p className="text-sm font-bold text-foreground">
              Dengarkan audio ayat, lalu pilih hukum tajwid yang paling tepat.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Putar audio dulu, baru pilih jawaban.
            </p>
            <div className="mt-3 rounded-xl bg-muted/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  {question.payload.example.surah_name} : {question.payload.example.ayah_number}
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
          </>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2">
          {question.type !== "spot" &&
            question.payload.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const showAsCorrect = selectedAnswer && option.id === correctKey;
              const showAsWrong = isSelected && option.id !== correctKey;

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
                  onClick={() => void submitAnswer(option.id)}
                  disabled={!!selectedAnswer || (!isAuthenticated && isGuestQuizLocked)}
                >
                  {showAsCorrect && <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {showAsWrong && <XCircle className="mr-2 h-4 w-4" />}
                  {option.name}
                </Button>
              );
            })}

          {question.type === "spot" &&
            question.payload.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const showAsCorrect = selectedAnswer && option === correctKey;
              const showAsWrong = isSelected && option !== correctKey;

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
                  onClick={() => void submitAnswer(option)}
                  disabled={!!selectedAnswer || (!isAuthenticated && isGuestQuizLocked)}
                >
                  {option}
                </Button>
              );
            })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {hasAnswered && !(!isAuthenticated && isGuestQuizLocked) && (
            <Button
              type="button"
              onClick={goNextQuestion}
              className="rounded-xl bg-chart-2 text-white hover:bg-chart-2/90"
            >
              Lanjut Soal Berikutnya
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => void flushSession()}
            disabled={!isAuthenticated || sessionAnswers.length === 0 || submitAttempt.isPending}
          >
            {submitAttempt.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Simpan Hasil
          </Button>
          <Badge variant="outline" className="rounded-full">
            <Shuffle className="mr-1 h-3 w-3" />
            Acak Antar Tipe
          </Badge>
        </div>
      </div>
    </section>
  );
}
