"use client";

import { useMemo, useState } from "react";
import { TajwidRuleCard } from "@/app/tajwid/_components/atoms/tajwid-rule-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { TajwidRuleAPI } from "@/lib/api-core";

interface TajwidOverviewSectionProps {
  rules: TajwidRuleAPI[];
  selectedRule: TajwidRuleAPI;
  getRuleProgress: (ruleId: string) => { completed: boolean };
  onSelectRule: (rule: TajwidRuleAPI) => void;
}

const categoryMeta: Record<
  TajwidRuleAPI["category"],
  { title: string; subtitle: string }
> = {
  nun_sukun: {
    title: "Nun Sukun & Tanwin",
    subtitle: "5 aturan dasar untuk mengenali perubahan bunyi nun mati dan tanwin.",
  },
  mad: {
    title: "Mad",
    subtitle: "Aturan panjang bacaan yang menentukan jumlah harakat secara tepat.",
  },
  qalqalah: {
    title: "Qalqalah",
    subtitle: "Pantulan bunyi huruf tertentu ketika berada pada posisi sukun atau waqf.",
  },
  ghunnah: {
    title: "Ghunnah",
    subtitle: "Dengung wajib pada mim atau nun bertasydid.",
  },
  al: {
    title: "Alif Lam",
    subtitle: "Perbedaan lam yang dibaca jelas dan yang dilebur ke huruf setelahnya.",
  },
  waqf: {
    title: "Waqf",
    subtitle: "Panduan dasar berhenti pada ayat agar makna tetap terjaga.",
  },
};

const orderedCategories: TajwidRuleAPI["category"][] = [
  "nun_sukun",
  "mad",
  "qalqalah",
  "ghunnah",
  "al",
  "waqf",
];

export function TajwidOverviewSection({
  rules,
  selectedRule,
  getRuleProgress,
  onSelectRule,
}: TajwidOverviewSectionProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | TajwidRuleAPI["category"]>("all");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredRules = useMemo(() => {
    return rules.filter((rule) => {
      const matchCategory = activeCategory === "all" || rule.category === activeCategory;
      const matchQuery =
        normalizedQuery.length === 0 ||
        rule.name.toLowerCase().includes(normalizedQuery) ||
        rule.arabicName.toLowerCase().includes(normalizedQuery) ||
        rule.description.toLowerCase().includes(normalizedQuery) ||
        rule.triggerLetters.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchQuery;
    });
  }, [activeCategory, normalizedQuery, rules]);

  return (
    <section className="px-6 pb-36 pt-6">
      <div className="mb-6 rounded-[2rem] border border-chart-2/15 bg-gradient-to-br from-chart-2/12 via-background to-background p-5">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-chart-2">
          Semua Aturan
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-foreground">
          Pelajari tajwid per kategori
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pilih satu aturan untuk masuk ke mode belajar detail, lihat contoh ayat,
          dan dengarkan demonstrasi bacaan.
        </p>

        <div className="mt-4 space-y-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama aturan, huruf, atau deskripsi..."
            className="h-10 rounded-xl bg-background/80"
            data-testid="search-tajwid-rule"
          />
          <div className="flex flex-wrap gap-2">
            <Badge
              role="button"
              tabIndex={0}
              onClick={() => setActiveCategory("all")}
              onKeyDown={(event) => event.key === "Enter" && setActiveCategory("all")}
              className={`cursor-pointer rounded-full px-3 py-1.5 ${
                activeCategory === "all" ? "bg-chart-2 text-white" : "bg-chart-2/10 text-chart-2"
              }`}
            >
              Semua
            </Badge>
            {orderedCategories.map((category) => (
              <Badge
                key={category}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCategory(category)}
                onKeyDown={(event) => event.key === "Enter" && setActiveCategory(category)}
                className={`cursor-pointer rounded-full px-3 py-1.5 ${
                  activeCategory === category ? "bg-chart-2 text-white" : "bg-chart-2/10 text-chart-2"
                }`}
              >
                {categoryMeta[category].title}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orderedCategories.map((category) => {
          const categoryRules = filteredRules.filter((rule) => rule.category === category);
          if (categoryRules.length === 0) {
            return null;
          }

          return (
            <div
              key={category}
              className="space-y-3"
            >
              <div>
                <h3 className="text-lg font-black tracking-tight text-foreground">
                  {categoryMeta[category].title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {categoryMeta[category].subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {categoryRules.map((rule) => {
                  const progress = getRuleProgress(rule.id);

                  return (
                    <TajwidRuleCard
                      key={rule.id}
                      rule={rule}
                      isSelected={selectedRule.id === rule.id}
                      completed={progress.completed}
                      onSelect={onSelectRule}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
