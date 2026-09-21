"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FleetCapacityRow } from "@/lib/fleet-chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT_COMPACT, CHART_MARGIN_LEFT, truncateLabel } from "./recharts-theme";

export function FleetCapacityChart({
  title,
  subtitle,
  rows,
  highlightId,
  formatValue,
}: {
  title: string;
  subtitle?: string;
  rows: FleetCapacityRow[];
  highlightId?: string;
  formatValue?: (value: number) => string;
}) {
  const format = formatValue ?? ((value: number) => `${Math.round(value)} h/mês`);

  if (rows.length === 0) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <p className="chart-card__empty">Sem dados para exibir.</p>
      </ChartCard>
    );
  }

  const data = rows.map((row) => ({
    name: row.label,
    id: row.id,
    needed: row.neededHours,
    available: row.availableHours,
  }));

  return (
    <ChartCard title={title} subtitle={subtitle} className="chart-card--interactive">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT_COMPACT}>
        <BarChart data={data} layout="vertical" margin={CHART_MARGIN_LEFT}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={108}
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value) => truncateLabel(String(value), 14)}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent
                active={active}
                payload={payload as never}
                label={label}
                formatValue={format}
              />
            )}
          />
          <Legend />
          <Bar dataKey="needed" name="Necessárias" fill={CHART_COLORS.accent} radius={[0, 4, 4, 0]} barSize={10}>
            {data.map((entry) => (
              <Cell
                key={`${entry.id}-needed`}
                fill={entry.id === highlightId ? CHART_COLORS.accent : "color-mix(in srgb, #e87722 72%, #fbbf24)"}
              />
            ))}
          </Bar>
          <Bar dataKey="available" name="Disponíveis" fill={CHART_COLORS.success} radius={[0, 4, 4, 0]} barSize={10}>
            {data.map((entry) => (
              <Cell
                key={`${entry.id}-available`}
                fill={entry.id === highlightId ? CHART_COLORS.success : "color-mix(in srgb, #16a34a 72%, #4ade80)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
