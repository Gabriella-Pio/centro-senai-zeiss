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
import { FLEET_AVERAGE_LABEL } from "@/lib/tariff-chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN_LEFT, slicesToBarData, truncateLabel } from "./recharts-theme";

export function FleetRankingChart({
  title,
  subtitle,
  slices,
  formatValue,
  highlightLabel,
}: {
  title: string;
  subtitle?: string;
  slices: DonutSlice[];
  formatValue?: (value: number) => string;
  highlightLabel?: string;
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
  const average = data.find((item) => item.name === FLEET_AVERAGE_LABEL)?.value;
  const chartRows = data.filter((item) => item.name !== FLEET_AVERAGE_LABEL);

  return (
    <ChartCard title={title} subtitle={subtitle} className="chart-card--interactive">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT - (average ? 28 : 0)}>
        <BarChart data={chartRows} layout="vertical" margin={CHART_MARGIN_LEFT}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={108}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value) => truncateLabel(String(value), 14)}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent active={active} payload={payload as never} label={label} formatValue={format} />
            )}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
            {chartRows.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.fill}
                opacity={highlightLabel && entry.name.includes(highlightLabel) ? 1 : 0.78}
              />
            ))}
          </Bar>
          {average ? (
            <ReferenceLine x={average} stroke={CHART_COLORS.purple} strokeDasharray="4 4" strokeWidth={2} />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
      {average ? (
        <p className="chart-ranking__caption">
          <span className="chart-ranking__caption-label">{FLEET_AVERAGE_LABEL}</span>
          <strong>{format(average)}</strong>
        </p>
      ) : null}
    </ChartCard>
  );
}
