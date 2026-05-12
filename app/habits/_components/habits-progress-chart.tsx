"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ChartEntry {
  day: string;
  completed: number;
}

interface HabitsProgressChartProps {
  data: ChartEntry[];
}

export function HabitsProgressChart({ data }: HabitsProgressChartProps) {
  return (
    <ChartContainer config={{ completed: { label: "Habit Selesai", color: "hsl(var(--primary))" } }}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          fontSize={11}
          fontFamily="inherit"
          fontWeight="black"
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          fontSize={11}
          fontWeight="black"
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="completed" radius={[8, 8, 0, 0]} maxBarSize={32}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.completed > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
