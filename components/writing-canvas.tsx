"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { HijaiyahLetter } from "@/client/src/data/hijaiyah";
import { Card } from "@/components/ui/card";

interface WritingCanvasProps {
  letter: HijaiyahLetter;
  onComplete: () => void;
  completed: boolean;
}

export interface WritingCanvasRef {
  clearCanvas: () => void;
}

export const WritingCanvas = forwardRef<WritingCanvasRef, WritingCanvasProps>(({ letter, onComplete, completed }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [hitPoints, setHitPoints] = useState<Set<number>>(new Set());

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHitPoints(new Set());

    const rect = canvas.getBoundingClientRect();
    drawGuide(ctx, rect.width, rect.height);

    setStrokeCount(0);
  };

  const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.font = '120px var(--font-arabic)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'hsl(var(--muted-foreground))';
    ctx.fillText(letter.arabic, width / 2, height / 2);

    if (letter.strokePoints) {
      letter.strokePoints.forEach((p, index) => {
        ctx.beginPath();
        ctx.arc((p.x / 100) * width, (p.y / 100) * height, 6, 0, Math.PI * 2);
        ctx.fillStyle = hitPoints.has(index) ? '#22c55e' : 'hsl(var(--muted-foreground))';
        ctx.globalAlpha = hitPoints.has(index) ? 0.6 : 0.3;
        ctx.fill();
      });
    }
    ctx.restore();
  };

  useImperativeHandle(ref, () => ({
    clearCanvas
  }), [letter, hitPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuide(ctx, rect.width, rect.height);
  }, [letter, completed, hitPoints]);

  // Clear canvas when completed changes from true to false
  useEffect(() => {
    if (!completed && strokeCount > 0) {
      clearCanvas();
    }
  }, [completed]);

  const getEventPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX || 0 : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY || 0 : (e as React.MouseEvent).clientY;

    return {
      x: (clientX - rect.left),
      y: (clientY - rect.top)
    };
  };

  const checkPoints = (x: number, y: number) => {
    if (!letter.strokePoints || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    const newHitPoints = new Set(hitPoints);
    let changed = false;

    letter.strokePoints.forEach((p, index) => {
      const px = (p.x / 100) * rect.width;
      const py = (p.y / 100) * rect.height;
      const dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));

      if (dist < 25 && !newHitPoints.has(index)) {
        newHitPoints.add(index);
        changed = true;
      }
    });

    if (changed) {
      setHitPoints(newHitPoints);
      if (letter.strokePoints && newHitPoints.size >= letter.strokePoints.length * 0.8) {
        if (!completed) {
          setTimeout(() => onComplete(), 300);
        }
      }
    }
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    checkPoints(pos.x, pos.y);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const pos = getEventPos(e);
    checkPoints(pos.x, pos.y);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    setIsDrawing(false);
    setStrokeCount(prev => {
      const newCount = prev + 1;
      // Simple completion detection based on stroke count
      if (newCount >= 2 && !completed) {
        setTimeout(() => onComplete(), 500);
      }
      return newCount;
    });
  };

  return (
    <Card className="p-4">
      <canvas
        ref={canvasRef}
        className="w-full h-64 border-2 border-dashed border-muted-foreground/30 rounded-lg writing-canvas cursor-crosshair"
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
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Ikuti bentuk huruf yang terlihat samar dan mulai menulis
      </p>
    </Card>
  );
});
