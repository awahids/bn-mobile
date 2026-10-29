"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { MobilePageShell } from "@/components/shared/mobile-page-shell";
import { BottomNavigation } from "@/components/shared/bottom-navigation";
import { StickyPageHeader } from "@/components/shared/sticky-page-header";
import { MODULES } from "@/data/modules";
import { cn } from "@/lib/utils";

// Bento layout: the first module gets a wide hero card, the rest are tiles.
export default function ModulesPage() {
  const router = useRouter();
  const [featured, ...rest] = MODULES;
  const FeaturedIcon = featured.icon;

  return (
    <MobilePageShell className="pb-32">
      <StickyPageHeader
        title="Semua Modul"
        subtitle={`${MODULES.length} materi belajar`}
        onBack={() => router.push("/")}
      />

      <div className="grid grid-cols-2 gap-3 px-4 py-5">
        <Link
          href={featured.href}
          className="group col-span-2 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99]"
          data-testid={`module-${featured.id}`}
        >
          <div className="flex items-start justify-between">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", featured.tileClass)}>
              <FeaturedIcon className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Mulai dari sini
            </span>
          </div>
          <h2 className="mt-4 text-lg font-semibold tracking-tight">{featured.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{featured.description}</p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
            Buka modul
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </Link>

        {rest.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.id}
              href={module.href}
              className="group flex flex-col rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
              data-testid={`module-${module.id}`}
            >
              <div className="flex items-start justify-between">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", module.tileClass)}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-3 font-semibold tracking-tight">{module.title}</h3>
              <p className="text-xs text-muted-foreground">{module.subtitle}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                {module.description}
              </p>
            </Link>
          );
        })}
      </div>

      <BottomNavigation />
    </MobilePageShell>
  );
}
