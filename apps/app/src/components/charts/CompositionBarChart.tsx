"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DonutSlice } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_HEIGHT, CHART_MARGIN_LEFT, slicesToBarData, truncateLabel } from "./recharts-theme";

export function CompositionBarChart({
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

  const data = slicesToBarData(slices);

  return (
    <ChartCard title={title} subtitle={subtitle} className="chart-card--interactive">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={data} layout="vertical" margin={CHART_MARGIN_LEFT}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={108}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value) => truncateLabel(String(value), 16)}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent active={active} payload={payload as never} label={label} formatValue={format} />
            )}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
