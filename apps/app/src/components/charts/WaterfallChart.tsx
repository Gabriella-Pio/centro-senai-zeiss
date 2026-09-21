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
import type { WaterfallStep } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { CHART_HEIGHT, CHART_MARGIN_LEFT, truncateLabel } from "./recharts-theme";

export type { WaterfallStep };

export function WaterfallChart({
  title,
  subtitle,
  steps,
  total,
  formatValue,
}: {
  title: string;
  subtitle?: string;
  steps: WaterfallStep[];
  total: number;
  formatValue?: (value: number) => string;
}) {
  const format = formatValue ?? ((value: number) => String(value));

  if (steps.length === 0 || total <= 0) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <p className="chart-card__empty">Sem dados para exibir.</p>
      </ChartCard>
    );
  }

  let running = 0;
  const data = steps.map((step) => {
    running += step.value;
    return {
      name: step.label,
      value: step.value,
      fill: step.color,
      running,
      percent: Math.round((step.value / total) * 100),
    };
  });

  return (
    <ChartCard title={title} subtitle={subtitle} className="chart-card--interactive chart-card--paired">
      <div className="chart-card__body chart-waterfall chart-waterfall--bars">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data} layout="vertical" margin={CHART_MARGIN_LEFT}>
            <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis
              type="category"
              dataKey="name"
              width={112}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(value) => truncateLabel(String(value), 16)}
            />
            <Tooltip
              cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload as { value: number; running: number; percent: number };
                return (
                  <div className="recharts-tooltip">
                    <p className="recharts-tooltip__label">{label}</p>
                    <p className="recharts-tooltip__value">+{format(row.value)} · {row.percent}%</p>
                    <p className="recharts-tooltip__meta">Acumulado: {format(row.running)}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card__footer chart-waterfall__total">
        <span>Total item 32</span>
        <strong>{format(total)}</strong>
      </div>
    </ChartCard>
  );
}
