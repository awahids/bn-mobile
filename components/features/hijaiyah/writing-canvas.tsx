"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import type { HijaiyahLetterAPI as HijaiyahLetter } from "@/lib/api-core";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WritingCanvasProps {
  letter: HijaiyahLetter;
  onComplete: () => void;
  completed: boolean;
  className?: string;
}

export interface WritingCanvasRef {
  clearCanvas: () => void;
}

export const WritingCanvas = forwardRef<WritingCanvasRef, WritingCanvasProps>(({ letter, onComplete, completed, className }, ref) => {
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);

  // Function to get the real Arabic font family from computed styles
  const getArabicFont = useCallback(() => {
    if (typeof window === "undefined") return "serif";
    const container = containerRef.current;
    if (!container) return "serif";
    
    // Try to get font from the container which should have --font-arabic available
    const style = window.getComputedStyle(container);
    const fontVar = style.getPropertyValue('--font-arabic');
    
    if (fontVar && fontVar.trim()) {
      return fontVar.replace(/['"]/g, '');
    }
    
    return 'Amiri, "Noto Naskh Arabic", serif';
  }, []);

  const clearCanvas = () => {
    const drawingCanvas = drawingCanvasRef.current;
    if (!drawingCanvas) return;

    const ctx = drawingCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    setStrokeCount(0);
  };

  const drawGuide = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const dpr = window.devicePixelRatio || 1;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    
    ctx.save();
    ctx.scale(dpr, dpr);
    
    // Draw ghost letter - slightly more visible since dots are gone
    ctx.globalAlpha = 0.25; 
    const fontSize = Math.min(width, height) * 0.65;
    const arabicFont = getArabicFont();
    
    ctx.font = `${fontSize}px ${arabicFont}, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    
    // Position the letter higher to make room for tails (descenders)
    const yOffset = height * 0.02; 
    ctx.fillText(letter.arabic, width / 2, height / 2 - yOffset);
    ctx.restore();
  }, [letter.arabic, getArabicFont]);

  useImperativeHandle(ref, () => ({
    clearCanvas
  }));

  const initCanvases = useCallback(() => {
    const container = containerRef.current;
    const guideCanvas = guideCanvasRef.current;
    const drawingCanvas = drawingCanvasRef.current;
    if (!container || !guideCanvas || !drawingCanvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    if (guideCanvas.width !== rect.width * dpr || guideCanvas.height !== rect.height * dpr) {
      [guideCanvas, drawingCanvas].forEach(canvas => {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      });
    }

    const dCtx = drawingCanvas.getContext('2d');
    if (dCtx) {
      dCtx.setTransform(1, 0, 0, 1, 0, 0);
      dCtx.scale(dpr, dpr);
      dCtx.strokeStyle = 'hsl(var(--primary))';
      dCtx.lineWidth = 16;
      dCtx.lineCap = 'round';
      dCtx.lineJoin = 'round';
    }

    const gCtx = guideCanvas.getContext('2d');
    if (gCtx) {
      drawGuide(gCtx, rect.width, rect.height);
    }
  }, [drawGuide]);

  useEffect(() => {
    initCanvases();
    const timer = setTimeout(initCanvases, 200);
    window.addEventListener('resize', initCanvases);
    return () => {
      window.removeEventListener('resize', initCanvases);
      clearTimeout(timer);
    };
  }, [initCanvases]);

  useEffect(() => {
    if (!completed && strokeCount > 0) {
      clearCanvas();
    }
  }, [completed]);

  const getEventPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX || 0 : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || 0 : (e as React.MouseEvent).clientY;

    return {
      x: (clientX - rect.left),
      y: (clientY - rect.top)
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    if ('touches' in e) {
       if (e.cancelable) e.preventDefault();
       if (e.touches.length === 0) return;
    } else {
       e.preventDefault();
    }
    
    setIsDrawing(true);
    const pos = getEventPos(e);
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    if ('touches' in e && e.cancelable) e.preventDefault();

    const pos = getEventPos(e);
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    setStrokeCount(prev => {
      const newCount = prev + 1;
      // Complete after 2 strokes
      if (newCount >= 2 && !completed) {
        setTimeout(() => onComplete(), 500);
      }
      return newCount;
    });
  };

  return (
    <Card className={cn("p-4 overflow-hidden", className)}>
      <div 
        ref={containerRef}
        className="w-full h-80 relative border-2 border-dashed border-muted-foreground/30 rounded-2xl overflow-hidden bg-muted/5 touch-none"
      >
        <canvas
          ref={guideCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ touchAction: 'none' }}
        />
        <canvas
          ref={drawingCanvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          style={{ touchAction: 'none' }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          data-testid="writing-canvas"
        />
      </div>
      <div className="flex flex-col items-center mt-5 space-y-1">
        <h4 className="text-base font-bold text-foreground">
          Latihan: {letter.name}
        </h4>
        <p className="text-xs text-muted-foreground text-center">
          Tuliskan huruf di atas mengikuti pola yang ada
        </p>
      </div>
    </Card>
  );
});

WritingCanvas.displayName = "WritingCanvas";
