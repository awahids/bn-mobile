"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { SekolahIslamHeader } from "./sections/sekolah-islam-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BookOpen, 
  Heart, 
  Star, 
  ChevronRight, 
  PlayCircle,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "adab",
    title: "Adab Harian",
    description: "Belajar adab makan, tidur, dan lainnya",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50",
    darkBg: "dark:bg-rose-950/20",
    items: 12,
    completed: 4
  },
  {
    id: "doa",
    title: "Doa Pilihan",
    description: "Kumpulan doa harian untuk anak",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
    darkBg: "dark:bg-amber-950/20",
    items: 20,
    completed: 2
  },
  {
    id: "kisah",
    title: "Kisah Nabi",
    description: "Cerita inspiratif para nabi",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-50",
    darkBg: "dark:bg-blue-950/20",
    items: 25,
    completed: 0
  }
];

export function SekolahIslamPageContent() {
  const router = useRouter();
  const [progress] = useState(15);

  return (
    <MobilePageShell className="pb-24">
      <SekolahIslamHeader 
        progress={progress} 
        onBack={() => router.push("/")} 
      />

      <div className="px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-10 -mt-10 rounded-full" />
          <h2 className="text-2xl font-black tracking-tight leading-tight mb-2">
            Selamat Datang di<br />Sekolah Islam ✨
          </h2>
          <p className="text-sm font-medium opacity-90 leading-relaxed mb-6">
            Mari belajar adab, doa, dan kisah-kisah indah bersama.
          </p>
          <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl font-black uppercase text-[10px] tracking-widest px-6 h-10 shadow-lg">
            MULAI BELAJAR
          </Button>
        </div>

        {/* Modules Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-foreground tracking-tight">Kategori Belajar</h3>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">3 KATEGORI</span>
          </div>

          <div className="grid gap-4">
            {SECTIONS.map((section) => (
              <Card key={section.id} className="glass p-5 rounded-[2rem] border-transparent hover:border-primary/20 transition-all duration-300 group cursor-pointer border-none overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-3xl -mr-10 -mt-10 rounded-full" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300", section.bg, section.darkBg)}>
                    <section.icon className={cn("w-8 h-8", section.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-lg tracking-tight mb-1">{section.title}</h4>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-1">{section.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-1000", section.color.replace("text", "bg"))} 
                          style={{ width: `${(section.completed / section.items) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase text-muted-foreground/60 w-12 text-right">
                        {section.completed}/{section.items}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground/20 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-black text-foreground tracking-tight">Konten Spesial</h3>
          </div>
          
          <Card className="glass p-8 rounded-[2.5rem] border-none overflow-hidden relative bg-gradient-to-br from-chart-4/10 to-chart-4/5">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-chart-4/20 rounded-3xl flex items-center justify-center text-chart-4 shadow-xl shadow-chart-4/10">
                <Lock size={32} />
              </div>
              <div>
                <h4 className="font-black text-xl tracking-tight uppercase mb-1">Video Edukasi</h4>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Segera Hadir</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-[200px]">
                Nantikan video animasi interaktif untuk belajar lebih seru!
              </p>
            </div>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </MobilePageShell>
  );
}
