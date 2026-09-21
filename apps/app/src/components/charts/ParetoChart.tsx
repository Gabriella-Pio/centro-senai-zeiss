"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ParetoItem } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN_LEFT } from "./recharts-theme";

export function ParetoChart({ data }: { data: ParetoItem[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Causas de desvio" subtitle="Onde o laboratório mais erra na estimativa">
        <p className="chart-card__empty">Nenhuma causa registrada ainda.</p>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item.label,
    count: item.count,
    percent: item.percent,
  }));

  return (
    <ChartCard title="Causas de desvio" subtitle="Onde o laboratório mais erra na estimativa">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData} layout="vertical" margin={CHART_MARGIN_LEFT}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent
                active={active}
                payload={payload as never}
                label={label}
                formatValue={(value) => {
                  const percent = (payload?.[0]?.payload as { percent?: number })?.percent;
                  return percent !== undefined ? `${value} casos (${percent}%)` : `${value} casos`;
                }}
              />
            )}
          />
          <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
