"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const HabitsProgressChart = dynamic(() => import("./habits-progress-chart").then((m) => m.HabitsProgressChart), { ssr: false });
import {
  Plus,
  Bell,
  BellOff,
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  Pencil,
  Trash2,
  ChevronRight,
  Loader2,
  Send,
  Bot,
  X,
  Leaf
} from "lucide-react";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { useHabits, CATEGORIES, CAT_COLOR, today, getStreak, Habit, dateKeyFromDate } from "@/hooks/use-habits";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import api, { getErrorMessage, isApiError } from "@/lib/api";
import { ensureWebPushSubscription } from "@/lib/web-push";

// Custom Sections
import { HabitsHeader } from "./sections/habits-header";
import { HabitsQuickSwitch } from "./sections/habits-quick-switch";

const getLast7Days = () => Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return dateKeyFromDate(d);
});

const QUICK_PROMPTS = [
  "Evaluasi habit saya",
  "Saran habit harian",
  "Motivasi biar konsisten",
  "Buat rencana 7 hari",
  "Apa prioritas saya hari ini?",
  "Review progres minggu ini",
  "Bantu saya mulai dari nol",
  "Cara keluar dari rasa malas",
  "Perbaiki rutinitas pagi saya",
  "Perbaiki rutinitas malam saya",
  "Target kecil yang realistis",
  "Strategi saat habit terlewat",
];

export function HabitsPageContent() {
  const router = useRouter();
  const { status, isAuthenticated } = useAuth();
  const {
    habits,
    completions,
    loaded,
    toggleHabit,
    saveHabit,
    deleteHabit,
    stats,
    isSyncing
  } = useHabits();

  const [tab, setTab] = useState<"dashboard" | "progress" | "coach">("dashboard");
  const [modal, setModal] = useState(false);
  const [editH, setEditH] = useState<Habit | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "Health",
    reminderTime: "",
    reminderEnabled: false
  });
  const [aiMsg, setAiMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [notif, setNotif] = useState<NotificationPermission>("default");
  const [notifSyncing, setNotifSyncing] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [pushReady, setPushReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotif(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (notif !== "granted" || status !== "authenticated" || !isAuthenticated) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        await ensureWebPushSubscription();
        if (!cancelled) {
          setNotifError("");
          setPushReady(true);
        }
      } catch (error) {
        if (!cancelled) {
          setPushReady(false);
          setNotifError(getErrorMessage(error) || "Gagal sinkronisasi push notification.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [notif, status, isAuthenticated]);

  const requestNotif = async () => {
    if (status !== "authenticated" || !isAuthenticated) {
      router.push("/login?callbackUrl=/habits");
      return;
    }

    setNotifSyncing(true);
    try {
      const permission = await ensureWebPushSubscription();
      setNotif(permission);
      setNotifError("");
      setPushReady(permission === "granted");
    } catch (error) {
      const message = getErrorMessage(error);
      setPushReady(false);
      setNotifError(message || "Gagal mengaktifkan push notification.");
    } finally {
      setNotifSyncing(false);
    }
  };

  const onSave = () => {
    if (!form.name.trim()) return;
    saveHabit({
      name: form.name,
      category: form.category,
      reminderTime: form.reminderTime,
      reminderEnabled: form.reminderEnabled && !!form.reminderTime
    }, editH?.id);
    setModal(false);
  };

  const openAdd = () => {
    setForm({ name: "", category: "Health", reminderTime: "", reminderEnabled: false });
    setEditH(null);
    setModal(true);
  };

  const openEdit = (h: Habit) => {
    setForm({
      name: h.name,
      category: h.category,
      reminderTime: h.reminderTime || "",
      reminderEnabled: !!h.reminderEnabled
    });
    setEditH(h);
    setModal(true);
  };

  const askAI = async (prompt: string) => {
    setAiLoading(true);
    setAiMsg("");

    const summary = habits.length ? habits.map(h => {
      const s = getStreak(h.id, completions);
      const w = getLast7Days().filter(d => completions[d]?.[h.id]).length;
      return `- ${h.name} (${h.category}): ${w}/7 days, ${s}-day streak`;
    }).join("\n") : "Belum ada habit.";

    try {
      const data = await api.post<{ content?: string }>(
        "/ai/coach",
        {
          message: `Ringkasan habit saya:\n${summary}\n\nProgress hari ini: ${stats.rate}% selesai\n\nPermintaan: ${prompt}`
        }
      );

      setAiMsg(
        data?.content || "Coach belum memberi respons. Silakan coba lagi."
      );
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        setAiMsg("Silakan login untuk menggunakan AI Coach.");
        return;
      }
      const message = getErrorMessage(error);
      setAiMsg(
        message || "Tidak bisa terhubung ke AI Coach. Silakan coba lagi."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const weeklyData = useMemo(() => {
    return getLast7Days().map(d => ({
      day: new Date(d + "T12:00:00").toLocaleDateString("id-ID", { weekday: "short" }),
      completed: habits.filter(h => completions[d]?.[h.id]).length,
    }));
  }, [habits, completions]);

  if (!loaded) return (
    <div className="flex h-screen w-full items-center justify-center bg-background gap-3">
      <Loader2 className="animate-spin text-primary" size={24} />
      <span className="text-muted-foreground font-medium">Loading Habits...</span>
    </div>
  );

  return (
    <MobilePageShell className="pb-44">
      <HabitsHeader
        rate={stats.rate}
        onBack={() => router.push("/")}
      />

      <div className="px-6 py-8">

        {/* --- DASHBOARD --- */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-white shadow-md shadow-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10 rounded-full" />
              <div className="relative flex justify-between items-center mb-8">
                <div>
                  <div className="text-6xl font-bold tracking-tight leading-none">{stats.rate}%</div>
                  <div className="text-xs font-bold opacity-80 tracking-wide mt-2">Penyelesaian Hari Ini</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{stats.doneToday}/{stats.totalHabits}</div>
                  <div className="text-xs font-bold opacity-80 tracking-wide mt-1">Selesai</div>
                </div>
              </div>
              <Progress value={stats.rate} className="h-2.5 bg-white/20" />
            </div>

            {notif !== "granted" && (
              <div className="glass p-5 rounded-3xl flex items-center justify-between gap-3 border-primary/10">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BellOff size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold">Aktifkan Notifikasi</h4>
                    <p className="text-xs text-muted-foreground font-medium">Bantu Anda tetap konsisten</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestNotif}
                  disabled={notifSyncing}
                  className="shrink-0 rounded-full border-primary/20 hover:bg-primary/5 text-primary text-xs font-bold h-9"
                >
                  {notifSyncing ? "Menyambung..." : "Aktifkan"}
                </Button>
              </div>
            )}

            {notifError && (
              <Card className="p-4 rounded-2xl border-destructive/20 bg-destructive/5 text-destructive text-xs font-semibold">
                {notifError}
              </Card>
            )}

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground tracking-tight">Habit Saya</h3>
                {isSyncing && (
                  <div className="flex items-center gap-2 text-primary">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs font-bold tracking-wide">Sinkronisasi...</span>
                  </div>
                )}
              </div>
              <Button onClick={openAdd} size="sm" className="rounded-full px-4 gap-2 font-bold text-xs tracking-wide h-10">
                <Plus size={16} /> Tambah
              </Button>
            </div>

            <div className="space-y-4">
              {habits.length === 0 ? (
                <Card className="flex flex-col items-center px-6 py-10 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Leaf size={28} />
                  </div>
                  <p className="font-semibold text-foreground">Belum ada habit</p>
                  <p className="mt-1 text-sm text-muted-foreground">Mulai dari satu kebiasaan kecil, misalnya tilawah 1 halaman.</p>
                  <Button onClick={openAdd} size="sm" className="mt-5 rounded-full px-5 gap-2">
                    <Plus size={16} /> Tambah Habit
                  </Button>
                </Card>
              ) : (
                habits.map((h) => {
                  const done = !!completions[today()]?.[h.id];
                  const streak = getStreak(h.id, completions);
                  const color = CAT_COLOR[h.category] || "#6b7280";

                  return (
                    <div
                      key={h.id}
                      className={cn(
                        "group relative glass p-5 rounded-3xl border-transparent transition-all duration-300 flex items-center gap-5",
                        done ? "bg-primary/5 border-primary/10" : "hover:border-primary/20"
                      )}
                    >
                      <button
                        onClick={() => toggleHabit(h.id)}
                        className={cn(
                          "transition-transform active:scale-95",
                          done ? "text-primary" : "text-muted-foreground/20"
                        )}
                      >
                        {done ? <CheckCircle2 size={40} /> : <Circle size={40} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4 className={cn("font-bold text-lg tracking-tight truncate", done && "text-primary/40 line-through")}>{h.name}</h4>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <Badge
                            variant="secondary"
                            className="rounded-lg text-[11px] font-bold px-2 py-0.5"
                            style={{ backgroundColor: `${color}15`, color: color }}
                          >
                            {h.category}
                          </Badge>
                          {h.reminderEnabled && h.reminderTime && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60">
                              <Clock size={12} /> {h.reminderTime}
                            </div>
                          )}
                          {streak > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-500">
                              <Flame size={12} fill="currentColor" /> {streak} hari
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => openEdit(h)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground/30 hover:text-foreground hover:bg-muted transition-all"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- PROGRESS --- */}
        {tab === "progress" && (
          <div className="space-y-10">
            <section>
              <h3 className="text-sm font-bold tracking-wide mb-6 text-foreground/60 px-1">Aktivitas Mingguan</h3>
              <div className="glass p-8 rounded-3xl border-primary/5 h-72">
                <HabitsProgressChart data={weeklyData} />
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold tracking-wide mb-6 text-foreground/60 px-1">Detail Konsistensi</h3>
              <div className="space-y-6">
                {habits.length === 0 ? (
                  <p className="text-center py-20 text-muted-foreground font-bold tracking-wide opacity-40">Belum ada data</p>
                ) : habits.map(h => {
                  const color = CAT_COLOR[h.category] || "#6b7280";
                  const streak = getStreak(h.id, completions);
                  const days = getLast7Days();
                  const weekDone = days.filter(d => completions[d]?.[h.id]).length;
                  const percent = Math.round((weekDone / 7) * 100);

                  return (
                    <Card key={h.id} className="glass p-6 rounded-3xl border-primary/5 space-y-6 overflow-hidden relative border-none">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 rounded-full" />
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <h4 className="font-bold text-lg tracking-tight mb-2">{h.name}</h4>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-muted-foreground tracking-wide">{weekDone}/7 HARI MINGGU INI</span>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-orange-500 tracking-wide">
                              <Flame size={14} fill="currentColor" /> {streak} hari streak
                            </span>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-primary leading-none">{percent}%</div>
                      </div>

                      <div className="flex gap-2.5 relative z-10">
                        {days.map((d, i) => {
                          const isDone = !!completions[d]?.[h.id];
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <div
                                className={cn(
                                  "w-full h-10 rounded-xl transition-all border duration-500",
                                  isDone
                                    ? "bg-primary border-primary shadow-lg shadow-primary/20"
                                    : "bg-muted/30 border-white/5"
                                )}
                              />
                              <span className="text-[11px] font-bold text-muted-foreground/40">
                                {new Date(d + "T12:00:00").toLocaleDateString("id-ID", { weekday: "narrow" })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* --- AI COACH --- */}
        {tab === "coach" && (
          <div className="flex flex-col h-[calc(100vh-280px)] space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-md shadow-indigo-500/20 flex items-center gap-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10 rounded-full" />
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 relative z-10 shadow-inner">
                <Bot size={40} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold tracking-tight leading-tight">AI Coach</h3>
                <p className="text-xs font-bold opacity-80 tracking-wide mt-1">Konsultan Habit Pribadi</p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {QUICK_PROMPTS.map(q => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  disabled={aiLoading}
                  onClick={() => askAI(q)}
                  className="rounded-full whitespace-nowrap bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-400 font-bold text-xs tracking-wide px-5 h-9"
                >
                  <ChevronRight size={14} className="mr-1" /> {q}
                </Button>
              ))}
            </div>

            <div className="flex-1 flex flex-col gap-6 overflow-hidden bg-muted/20 rounded-3xl p-6 border border-border/50">
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-none">
                {aiMsg && (
                  <div className="glass p-6 rounded-3xl border-indigo-100/50 bg-indigo-50/20 text-sm leading-relaxed font-semibold text-foreground/80 animate-in fade-in slide-in-from-bottom-4 shadow-sm italic px-8">
                    &ldquo;{aiMsg}&rdquo;
                  </div>
                )}

                {aiLoading && (
                  <div className="flex flex-col items-center justify-center py-20 gap-4 text-indigo-500/50">
                    <Loader2 size={40} className="animate-spin" />
                    <p className="text-xs font-bold tracking-wide animate-pulse">Berpikir...</p>
                  </div>
                )}

                {!aiMsg && !aiLoading && (
                  <div className="flex flex-col items-center justify-center py-24 opacity-20 text-center px-10">
                    <Bot size={64} className="mb-6" />
                    <p className="text-xs font-bold leading-relaxed tracking-wide italic">Tanyakan apa saja untuk memulai konsistensi harian anda</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Input
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && aiInput.trim()) { askAI(aiInput); setAiInput(""); } }}
                  placeholder="Kirim pesan ke Coach..."
                  className="rounded-2xl border-indigo-100 dark:border-indigo-900 bg-background/80 h-14 text-sm px-6 font-medium shadow-inner"
                />
                <Button
                  onClick={() => { if (aiInput.trim()) { askAI(aiInput); setAiInput(""); } }}
                  disabled={aiLoading || !aiInput.trim()}
                  className="rounded-2xl w-14 h-14 p-0 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-400/20 text-white"
                >
                  <Send size={24} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <HabitsQuickSwitch
        currentTab={tab}
        onChangeTab={setTab}
      />

      {/* Add/Edit Modal */}
      {modal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={e => e.target === e.currentTarget && setModal(false)}
          onKeyDown={e => e.key === "Escape" && setModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="habit-modal-title"
            className="bg-card w-full max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-300"
          >
            <div className="p-6 sm:p-10 space-y-8">
              <div className="flex justify-between items-center px-1">
                <h3 id="habit-modal-title" className="text-2xl font-bold tracking-tight">{editH ? "Edit Habit" : "Habit Baru"}</h3>
                <button type="button" aria-label="Tutup" onClick={() => setModal(false)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2 px-1">
                  <label htmlFor="habit-name" className="text-xs font-bold tracking-wide text-muted-foreground/60 ml-1">Nama Habit</label>
                  <Input
                    id="habit-name"
                    autoFocus
                    onKeyDown={e => e.key === "Enter" && onSave()}
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Contoh: Minum Air Putih..."
                    className="rounded-2xl h-14 px-5 text-sm font-semibold border-muted bg-muted/30"
                  />
                </div>

                <div className="space-y-3 px-1 text-center">
                  <label className="text-xs font-bold tracking-wide text-muted-foreground/60">Pilih Kategori</label>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {CATEGORIES.map(c => (
                      <button
                        key={c}
                        type="button"
                        aria-pressed={form.category === c}
                        onClick={() => setForm(p => ({ ...p, category: c }))}
                        className={cn(
                          "px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all border-2",
                          form.category === c
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-muted/50 border-transparent text-muted-foreground/60 hover:bg-muted"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/40 p-5 sm:p-8 rounded-3xl space-y-6 border border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                        <Bell size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-tight leading-tight">Pengingat</h4>
                        <p className="text-xs text-muted-foreground font-bold tracking-wide opacity-60">Notifikasi harian</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.reminderEnabled}
                      aria-label="Pengingat harian"
                      onClick={() => setForm(p => ({ ...p, reminderEnabled: !p.reminderEnabled }))}
                      className={cn(
                        "w-14 h-8 rounded-full relative transition-all duration-300",
                        form.reminderEnabled ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1.5 w-5 h-5 rounded-full bg-white transition-all shadow-md shadow-black/20",
                        form.reminderEnabled ? "right-1.5" : "left-1.5"
                      )} />
                    </button>
                  </div>

                  {form.reminderEnabled && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <Input
                        type="time"
                        aria-label="Jam pengingat"
                        value={form.reminderTime}
                        onChange={e => setForm(p => ({ ...p, reminderTime: e.target.value }))}
                        className="rounded-2xl h-14 bg-background px-6 font-bold tracking-wide text-lg text-center"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button onClick={onSave} disabled={!form.name.trim()} className="h-16 rounded-3xl font-bold text-xs tracking-wide shadow-lg shadow-primary/30">
                  {editH ? "Simpan perubahan" : "Mulai habit ini"}
                </Button>

                {editH && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (!window.confirm(`Hapus habit "${editH.name}"? Riwayat centangnya juga akan hilang.`)) return;
                      deleteHabit(editH.id);
                      setModal(false);
                    }}
                    className="h-12 rounded-2xl font-bold text-destructive/60 hover:bg-destructive/5 text-xs tracking-wide"
                  >
                    <Trash2 size={16} className="mr-2" /> Hapus habit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </MobilePageShell>
  );
}
