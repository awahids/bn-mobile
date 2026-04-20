"use client";

import { useState } from "react";
import {
  motion as framerMotion,
  AnimatePresence as FramerAnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw, Check, Sparkles } from "lucide-react";

const motion = framerMotion as any;
const AnimatePresence = FramerAnimatePresence as any;

interface DhikrCounterProps {
  dhikrId: string;
  currentCount: number;
  targetCount: number;
  onUpdate: (count: number) => void;
  completed: boolean;
}

export function DhikrCounter({
  dhikrId,
  currentCount,
  targetCount,
  onUpdate,
  completed
}: DhikrCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Haptic feedback utility
  const triggerHaptic = (type: 'light' | 'success') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      if (type === 'light') {
        window.navigator.vibrate(10);
      } else if (type === 'success') {
        window.navigator.vibrate([20, 50, 40]);
      }
    }
  };

  const handleIncrement = () => {
    if (currentCount < targetCount) {
      const newCount = currentCount + 1;
      onUpdate(newCount);

      // Add animation feedback
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 200);

      // Trigger haptic
      if (newCount === targetCount) {
        triggerHaptic('success');
      } else {
        triggerHaptic('light');
      }
    }
  };

  const handleDecrement = () => {
    if (currentCount > 0) {
      onUpdate(currentCount - 1);
      triggerHaptic('light');
    }
  };

  const handleReset = () => {
    onUpdate(0);
  };

  const progressPercentage = Math.min((currentCount / targetCount) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Progress Bar Container */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-end px-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${completed ? 'text-white/60' : 'text-muted-foreground/60'}`}>
            PROGRES HARIAN
          </span>
          <span className={`text-sm font-black tabular-nums ${completed ? 'text-white' : 'text-primary'}`}>
            {currentCount}<span className="opacity-40 font-bold mx-1">/</span>{targetCount}
          </span>
        </div>
        <div className={`w-full h-2 rounded-full overflow-hidden p-0.5 border ${completed ? 'bg-white/10 border-white/20' : 'bg-primary/5 border-primary/10'}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className={`h-full rounded-full transition-all duration-300 ${
              completed 
                ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                : 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]'
            }`}
          />
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="flex items-center justify-between space-x-4">
        {/* Reset / Decrement Group */}
        <div className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={currentCount === 0}
              className={`h-11 w-11 rounded-2xl transition-all duration-300 ${
                completed 
                  ? 'text-white/40 hover:text-white/80 hover:bg-white/10' 
                  : 'text-muted-foreground/40 hover:text-primary hover:bg-primary/5'
              }`}
              data-testid={`reset-${dhikrId}`}
              title="Reset hitungan"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              disabled={currentCount === 0}
              className={`h-11 w-11 rounded-2xl transition-all duration-300 ${
                completed 
                  ? 'text-white/40 hover:text-white/80 hover:bg-white/10' 
                  : 'text-muted-foreground/40 hover:text-primary hover:bg-primary/5'
              }`}
              data-testid={`decrement-${dhikrId}`}
              title="Kurangi satu"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Counter Display & Main Increment Button */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          <div className="text-right flex flex-col justify-center">
            <motion.div
              key={currentCount}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`text-4xl font-black tabular-nums transition-colors duration-300 ${
                completed ? 'text-white' : 'text-foreground'
              }`}
            >
              {currentCount}
            </motion.div>
            <div className={`text-[10px] font-black uppercase tracking-widest leading-none ${
              completed ? 'text-white/60' : 'text-muted-foreground/60'
            }`}>
              {completed ? 'Selesai' : `${targetCount - currentCount} lagi`}
            </div>
          </div>

          <motion.div
            initial={false}
            animate={isAnimating ? { scale: 0.9 } : { scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Button
              variant={completed ? "secondary" : "default"}
              onClick={handleIncrement}
              disabled={completed}
              className={`h-20 w-20 rounded-[2.5rem] shadow-2xl transition-all duration-500 overflow-hidden ${
                completed 
                  ? 'bg-white/20 text-white cursor-default border border-white/30 backdrop-blur-md' 
                  : 'bg-primary text-white hover:bg-primary/90 shadow-primary/30 ring-4 ring-primary/10'
              }`}
              data-testid={`increment-${dhikrId}`}
            >
              <AnimatePresence mode="wait">
                {completed ? (
                  <motion.div
                    key="checked"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  >
                    <Check className="w-8 h-8 stroke-[3.5px]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Plus className="w-8 h-8 stroke-[3.5px]" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Ripple effect placeholder or glow */}
              {!completed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isAnimating ? { opacity: [0.5, 0], scale: [0, 2] } : {}}
                  className="absolute inset-0 bg-white/40 rounded-full pointer-events-none"
                />
              )}
            </Button>
            
            {completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-2 -right-2"
              >
                <div className="bg-white text-primary p-1.5 rounded-xl shadow-lg ring-2 ring-white/50">
                  <Sparkles className="w-3.5 h-3.5 fill-primary" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
