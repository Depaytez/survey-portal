"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TrendPoint } from "@/lib/supabase/queries/survey-analytics";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const hasAnyResponses = data.some((point) => point.count > 0);

  if (!hasAnyResponses) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No responses in this window yet.
      </p>
    );
  }

  const formatted = data.map((point) => ({
    ...point,
    label: new Date(point.day).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-zinc-200, #e4e4e7)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={20}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={30} />
        <Tooltip
          formatter={(value) => [value, "Responses"]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
