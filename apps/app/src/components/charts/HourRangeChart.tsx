"use client";

import {
  Bar,
  BarChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT_COMPACT } from "./recharts-theme";

export function HourRangeChart({
  q1,
  median,
  q3,
  current,
  suggested,
}: {
  q1: number | null;
  median: number | null;
  q3: number | null;
  current?: number | null;
  suggested?: number | null;
}) {
  if (median === null || q1 === null || q3 === null) {
    return (
      <ChartCard title="Faixa de horas" subtitle="Distribuição dos casos formalizados similares">
        <p className="chart-card__empty">Histórico insuficiente para mostrar faixa. Siga as premissas do vocabulário.</p>
      </ChartCard>
    );
  }

  const min = Math.max(0, q1 - (q3 - q1) * 0.5);
  const max = q3 + (q3 - q1) * 0.5;
  const marker = current && current > 0 ? current : suggested;
  const data = [{ name: "Faixa", span: max - min }];

  return (
    <ChartCard title="Faixa de horas" subtitle={`Faixa usual ${q1}h–${q3}h · mediana ${median}h`}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT_COMPACT}>
        <BarChart data={data} layout="vertical" margin={{ top: 24, right: 16, left: 16, bottom: 8 }}>
          <XAxis type="number" domain={[min, max]} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent
                active={active}
                payload={payload as never}
                label={label}
                formatValue={(value) => `${Math.round(value)} h`}
              />
            )}
          />
          <Bar dataKey="span" fill="color-mix(in srgb, var(--color-muted) 40%, transparent)" radius={6} barSize={28} />
          <ReferenceArea x1={q1} x2={q3} fill="color-mix(in srgb, var(--color-primary) 15%, transparent)" />
          <ReferenceLine x={median} stroke={CHART_COLORS.primary} strokeWidth={2} label={{ value: `Mediana ${median}h`, position: "top", fontSize: 10 }} />
          {marker ? (
            <ReferenceLine x={marker} stroke={CHART_COLORS.accent} strokeDasharray="4 4" label={{ value: `Estimativa ${marker}h`, position: "insideTopRight", fontSize: 10 }} />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
