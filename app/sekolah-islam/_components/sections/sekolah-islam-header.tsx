"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SekolahIslamHeaderProps {
  totalSchools: number;
  canAdd: boolean;
  onAdd: () => void;
  onBack: () => void;
}

export function SekolahIslamHeader({ totalSchools, canAdd, onAdd, onBack }: SekolahIslamHeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">Sekolah Islam</h1>
            <div className="flex items-center space-x-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                DIREKTORI SEKOLAH
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-right mr-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
            <p className="text-base font-black text-primary leading-none">{totalSchools}</p>
          </div>
          <Button
            onClick={onAdd}
            disabled={!canAdd}
            size="icon"
            className="rounded-2xl h-10 w-10"
            aria-label="Tambah sekolah"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
