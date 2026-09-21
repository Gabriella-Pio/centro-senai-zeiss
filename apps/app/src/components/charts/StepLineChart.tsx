"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DonutSlice } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN, slicesToBarData } from "./recharts-theme";

export function StepLineChart({
  title,
  subtitle,
  slices,
  formatValue,
}: {
  title: string;
  subtitle?: string;
  slices: DonutSlice[];
  formatValue?: (value: number) => string;
}) {
  const format = formatValue ?? ((value: number) => String(value));

  if (slices.length === 0) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <p className="chart-card__empty">Sem dados para exibir.</p>
      </ChartCard>
    );
  }

  const data = slicesToBarData(slices).map((item) => ({
    name: item.name.replace(/^Item \d+ · /, ""),
    value: item.value,
    fill: item.fill,
    percent: item.percent,
  }));

  return (
    <ChartCard title={title} subtitle={subtitle} className="chart-card--interactive">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
          <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} width={48} />
          <Tooltip
            content={({ active, payload, label }) => (
              <RechartsTooltipContent active={active} payload={payload} label={label} formatValue={format} />
            )}
          />
          <Line
            type="stepAfter"
            dataKey="value"
            stroke={CHART_COLORS.primary}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CHART_COLORS.primary, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
