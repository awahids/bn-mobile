"use client";

import { Check, ChevronDown, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion as framerMotion, AnimatePresence as FramerAnimatePresence } from "framer-motion";
import { LazyDhikrCounter } from "@/components/lazy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import type { DhikrItem } from "@/lib/api-core";

const motion = framerMotion as any;
const AnimatePresence = FramerAnimatePresence as any;

interface DhikrListSectionProps {
  dhikrList: DhikrItem[];
  getCounterData: (dhikrId: string) => { count: number; completed: boolean; target: number };
  audioPlayerPreloadProps: Record<string, unknown>;
  dhikrCounterPreloadProps: Record<string, unknown>;
  onPlayDhikr: (dhikr: DhikrItem) => void;
  onUpdateCounter: (dhikrId: string, count: number) => void;
}

export function DhikrListSection({
  dhikrList,
  getCounterData,
  audioPlayerPreloadProps,
  dhikrCounterPreloadProps,
  onPlayDhikr,
  onUpdateCounter,
}: DhikrListSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [openFaedah, setOpenFaedah] = useState<Record<string, boolean>>({});
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const triggerHaptic = (type: 'light' | 'success') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      if (type === 'light') {
        window.navigator.vibrate(10);
      } else if (type === 'success') {
        window.navigator.vibrate([20, 50, 40]);
      }
    }
  };

  const handleArabicTap = (e: React.MouseEvent | React.TouchEvent, dhikrId: string, currentCount: number, targetCount: number) => {
    if (currentCount >= targetCount) return;

    const newCount = currentCount + 1;
    onUpdateCounter(dhikrId, newCount);

    // Ripple effect
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 600);

    // Haptic
    if (newCount === targetCount) {
      triggerHaptic('success');
      
      // Auto-slide after a delay
      setTimeout(() => {
        api?.scrollNext();
      }, 1200);
    } else {
      triggerHaptic('light');
    }
  };

  const syncActiveSlideHeight = useCallback(() => {
    if (!api) {
      return;
    }

    const slides = api.slideNodes();
    const activeSlide = slides[api.selectedScrollSnap()];
    const container = api.containerNode() as HTMLElement | null;
    const viewport = container?.parentElement as HTMLElement | null;

    if (!activeSlide || !viewport || !container) {
      return;
    }

    const activeContent = activeSlide.querySelector<HTMLElement>("[data-dhikr-slide-content]");
    const nextHeight = activeContent?.offsetHeight ?? activeSlide.offsetHeight;
    const safeHeight = Math.max(nextHeight, 1);

    container.style.height = `${safeHeight}px`;
    container.style.alignItems = "flex-start";
    viewport.style.transition = "height 300ms ease";
    container.style.transition = "height 300ms ease";
    viewport.style.height = `${safeHeight}px`;
    viewport.style.minHeight = `${safeHeight}px`;
    viewport.style.maxHeight = `${safeHeight}px`;
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const syncCarouselState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
      syncActiveSlideHeight();
    };

    syncCarouselState();
    api.on("select", syncCarouselState);
    api.on("reInit", syncCarouselState);

    return () => {
      api.off("select", syncCarouselState);
      api.off("reInit", syncCarouselState);
    };
  }, [api, syncActiveSlideHeight]);

  useEffect(() => {
    if (!api || typeof ResizeObserver === "undefined") {
      return;
    }

    const observeSelectedSlide = () => {
      const activeSlide = api.slideNodes()[api.selectedScrollSnap()];
      if (!activeSlide) {
        return null;
      }

      const observer = new ResizeObserver(() => {
        syncActiveSlideHeight();
      });

      observer.observe(activeSlide);
      return observer;
    };

    let observer = observeSelectedSlide();

    const handleSlideChange = () => {
      observer?.disconnect();
      observer = observeSelectedSlide();
    };

    api.on("select", handleSlideChange);
    api.on("reInit", handleSlideChange);

    return () => {
      observer?.disconnect();
      api.off("select", handleSlideChange);
      api.off("reInit", handleSlideChange);
    };
  }, [api, syncActiveSlideHeight]);

  // Reset Carousel to first item when dhikrList changes (switching sessions)
  useEffect(() => {
    if (!api) {
      return;
    }

    api.reInit();
    api.scrollTo(0);

    const totalSlides = api.scrollSnapList().length;
    setCount(totalSlides);
    setCurrent(totalSlides > 0 ? 1 : 0);

    requestAnimationFrame(() => {
      syncActiveSlideHeight();
    });
  }, [api, dhikrList, syncActiveSlideHeight]);

  useEffect(() => {
    setOpenFaedah({});
  }, [dhikrList]);

  return (
    <section className="px-6 pb-12">
      <div className="mb-4 flex items-center justify-between">
        {count > 1 && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Geser Kartu</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`h-8 px-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            isFocusMode ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/50 text-muted-foreground"
          }`}
        >
          {isFocusMode ? "Mode Fokus Aktif" : "Mode Fokus"}
        </Button>
      </div>

      <div className="relative">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-4 items-start">
          {dhikrList.map((dhikr, index) => {
            const counterData = getCounterData(dhikr.id);

            return (
              <CarouselItem key={dhikr.id} className="pl-4 basis-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-full"
                  data-dhikr-slide-content
                >
                  <Card
                    className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-700 border-none ${
                      counterData.completed
                        ? "bg-primary shadow-2xl shadow-primary/30"
                        : "bg-white/80 dark:bg-white/5 backdrop-blur-xl shadow-xl shadow-primary/5 border border-white/20"
                    }`}
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <span
                              className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
                                counterData.completed ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                              }`}
                            >
                              DZIKIR {index + 1}
                            </span>
                            {counterData.completed && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex h-5 w-5 rounded-full bg-white items-center justify-center shadow-lg"
                              >
                                <Check className="w-3 h-3 text-primary stroke-[3px]" />
                              </motion.div>
                            )}
                          </motion.div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPlayDhikr(dhikr)}
                          className={`rounded-2xl w-10 h-10 transition-all duration-300 ${
                            counterData.completed 
                              ? "bg-white/10 hover:bg-white/20 text-white shadow-lg shadow-black/10" 
                              : "bg-primary/10 hover:bg-primary/20 text-primary shadow-lg shadow-primary/5"
                          }`}
                          data-testid={`play-${dhikr.id}`}
                          {...audioPlayerPreloadProps}
                        >
                          <Volume2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={(e: React.MouseEvent | React.TouchEvent) => handleArabicTap(e, dhikr.id, counterData.count, counterData.target)}
                        className={`relative w-full mb-6 text-center py-10 px-6 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden group/arabic ${
                          counterData.completed 
                            ? "bg-white/20 border-white/30" 
                            : "bg-black/5 dark:bg-white/5 active:bg-primary/5"
                        }`}
                      >
                        {/* Progress Fill Layer */}
                        <motion.div 
                          initial={false}
                          animate={{ 
                            height: `${(counterData.count / counterData.target) * 100}%`,
                            opacity: counterData.completed ? 0.3 : 0.1
                          }}
                          className="absolute bottom-0 left-0 right-0 bg-primary pointer-events-none z-0"
                          transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                        />

                        {/* Ripple Effects Layer */}
                        <AnimatePresence>
                          {ripples.map(ripple => (
                            <motion.span
                              key={ripple.id}
                              initial={{ scale: 0, opacity: 0.5 }}
                              animate={{ scale: 4, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              style={{ 
                                left: ripple.x, 
                                top: ripple.y,
                                position: 'absolute',
                                width: '100px',
                                height: '100px',
                                background: 'hsl(var(--primary) / 0.3)',
                                borderRadius: '50%',
                                pointerEvents: 'none',
                                zIndex: 5
                              }}
                            />
                          ))}
                        </AnimatePresence>

                        <motion.div 
                          className={`relative z-10 text-4xl font-arabic leading-[1.8] text-center ${
                            counterData.completed ? "text-white" : "text-primary group-hover/arabic:scale-[1.02] transition-transform duration-500"
                          }`} 
                          dir="rtl"
                        >
                          {dhikr.arabic}
                        </motion.div>

                        {!counterData.completed && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-4 right-6 text-[10px] font-black text-primary/40 uppercase tracking-widest z-10"
                          >
                            Ketuk untuk Menghitung
                          </motion.div>
                        )}
                      </motion.button>

                      <div className={`space-y-4 mb-6 transition-all duration-500 ${isFocusMode ? "opacity-20 blur-sm pointer-events-none scale-95" : "opacity-100 blur-0"}`}>
                        <div
                          className={`rounded-2xl border p-4 ${
                            counterData.completed
                              ? "bg-white/10 border-white/20"
                              : "bg-primary/5 border-primary/10"
                          }`}
                        >
                          <p
                            className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
                              counterData.completed ? "text-white/70" : "text-primary/80"
                            }`}
                          >
                            Latin
                          </p>
                          <p
                            className={`text-sm leading-relaxed ${
                              counterData.completed ? "text-white/95" : "text-foreground/75"
                            }`}
                          >
                            {dhikr.transliteration}
                          </p>
                        </div>

                        <div className="space-y-2">
                          {dhikr.translation && (
                            <p
                              className={`text-sm font-black tracking-tight ${
                                counterData.completed ? "text-white" : "text-foreground"
                              }`}
                            >
                              {dhikr.translation}
                            </p>
                          )}
                          <p className={`text-sm font-medium leading-relaxed italic ${counterData.completed ? "text-white/90" : "text-foreground/70"}`}>
                          &quot;{dhikr.meaning}&quot;
                          </p>
                        </div>

                        {dhikr.reference && (
                          <div
                            className={`flex items-start space-x-2 text-[10px] font-black italic uppercase tracking-widest ${
                              counterData.completed ? "text-white/60" : "text-muted-foreground/60"
                            }`}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0" />
                            <span className="leading-tight">{dhikr.reference}</span>
                          </div>
                        )}

                        {dhikr.faedah && (
                          <Collapsible
                            open={!!openFaedah[dhikr.id]}
                            onOpenChange={(open) =>
                              setOpenFaedah((prev) => ({ ...prev, [dhikr.id]: open }))
                            }
                          >
                            <CollapsibleTrigger asChild>
                              <button
                                type="button"
                                className={`w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${
                                  counterData.completed
                                    ? "bg-white/10 border-white/20 text-white hover:bg-white/15"
                                    : "bg-accent/10 border-accent/20 text-foreground hover:bg-accent/15"
                                }`}
                              >
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Faedah</span>
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform ${
                                    openFaedah[dhikr.id] ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent
                              className={`mt-2 rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                                counterData.completed
                                  ? "bg-white/10 border-white/20 text-white/90"
                                  : "bg-background/70 border-border text-foreground/80"
                                }`}
                              >
                                {dhikr.faedah}
                              </CollapsibleContent>
                            </Collapsible>
                          )}
                        </div>

                      <div {...dhikrCounterPreloadProps} className={`transition-all duration-500 ${isFocusMode ? "scale-110 -translate-y-4" : ""}`}>
                        <LazyDhikrCounter
                          dhikrId={dhikr.id}
                          currentCount={counterData.count}
                          targetCount={counterData.target}
                          onUpdate={(count: number) => {
                            onUpdateCounter(dhikr.id, count);
                            
                            // Optional: Auto-slide to next if completed
                            if (!counterData.completed && count === counterData.target) {
                              triggerHaptic('success');
                              setTimeout(() => {
                                api?.scrollNext();
                              }, 1200);
                            }
                          }}
                          completed={counterData.completed}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        {/* Pagination Indicator */}
        {count > 0 && (
          <div className="flex flex-col items-center justify-center mt-4 space-y-3">
            <div className="flex items-center justify-center space-x-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className="relative group h-3 flex items-center justify-center"
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    animate={{
                      width: index + 1 === current ? 32 : 8,
                      backgroundColor:
                        index + 1 === current ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.2)",
                    }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                    className={`h-2 rounded-full transition-colors ${
                      index + 1 === current ? "" : "bg-primary/20 hover:bg-primary/40"
                    }`}
                  />
                  {index + 1 === current && (
                    <motion.div 
                      layoutId="active-dot-glow"
                      className="absolute inset-0 bg-primary/20 blur-md rounded-full -z-10"
                    />
                  )}
                </button>
              ))}
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/60 uppercase flex items-center space-x-3"
            >
              <span className="text-primary font-black">{current}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span>{count}</span>
            </motion.div>
          </div>
        )}
      </Carousel>
      {count > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => api?.scrollPrev()}
            disabled={current <= 1}
            className="pointer-events-auto h-9 w-9 rounded-full bg-background/85 border border-border/70 shadow-md hover:bg-background"
            aria-label="Geser ke dzikir sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => api?.scrollNext()}
            disabled={current >= count}
            className="pointer-events-auto h-9 w-9 rounded-full bg-background/85 border border-border/70 shadow-md hover:bg-background"
            aria-label="Geser ke dzikir berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
      </div>
    </section>
  );
}
