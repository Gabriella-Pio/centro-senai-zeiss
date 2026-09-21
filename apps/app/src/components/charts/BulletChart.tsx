"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DonutSlice } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN_LEFT } from "./recharts-theme";

export function BulletChart({
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

  if (slices.length < 2) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <p className="chart-card__empty">Sem dados para exibir.</p>
      </ChartCard>
    );
  }

  const needed = slices[0];
  const capacity = slices[1];
  const data = [
    { name: needed.label, value: needed.value, fill: needed.color },
    { name: capacity.label, value: capacity.value, fill: capacity.color },
  ];

  return (
    <ChartCard title={title} subtitle={subtitle} className="chart-card--interactive">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT - 24}>
        <BarChart data={data} layout="vertical" margin={CHART_MARGIN_LEFT}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent active={active} payload={payload as never} label={label} formatValue={format} />
            )}
          />
          <ReferenceLine
            x={capacity.value}
            stroke={CHART_COLORS.success}
            strokeDasharray="4 4"
            label={{ value: `Capacidade ${format(capacity.value)}`, position: "insideTopRight", fontSize: 10 }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="chart-bullet__caption">
        {format(needed.value)} necessárias · {format(capacity.value)} disponíveis
        {needed.value > capacity.value ? " · acima da capacidade" : " · dentro da capacidade"}
      </p>
    </ChartCard>
  );
}
