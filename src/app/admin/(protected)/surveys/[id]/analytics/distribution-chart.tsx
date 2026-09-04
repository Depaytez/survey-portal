"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { QuestionDistribution } from "@/lib/supabase/queries/survey-analytics";

// A qualitative palette for chart series — distinct from the site's
// semantic brand tokens (primary/accent), since a chart with more than 2-3
// categories needs more visually distinguishable colors than the brand
// palette alone provides. Opens with the brand colors so small (<=3
// option) charts stay purely on-brand.
const CHART_COLORS = ["#15803d", "#b45309", "#c2410c", "#0369a1", "#7c3aed", "#be185d"];

export function DistributionChart({ distribution, recommendedVisualization }: QuestionDistribution) {
  const total = distribution.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return (
      <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        No answers yet.
      </p>
    );
  }

  // Pie/donut charts stop being readable past a handful of slices — fall
  // back to a bar chart regardless of the question's own preference once
  // there are too many categories, per the spec's own guidance against
  // misleading charts.
  const usePie =
    (recommendedVisualization === "pie_chart" || recommendedVisualization === "donut_chart") &&
    distribution.length <= 6;

  if (usePie) {
    return (
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={distribution}
            dataKey="count"
            nameKey="label"
            innerRadius={recommendedVisualization === "donut_chart" ? 50 : 0}
            outerRadius={80}
            paddingAngle={2}
          >
            {distribution.map((_, index) => (
              <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} (${Math.round((Number(value) / total) * 100)}%)`, ""]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, distribution.length * 36)}>
      <BarChart
        data={distribution}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="label"
          width={140}
          tick={{ fontSize: 11 }}
          interval={0}
        />
        <Tooltip
          formatter={(value) => [`${value} (${Math.round((Number(value) / total) * 100)}%)`, "Responses"]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
