"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN } from "./recharts-theme";

export function EffortTrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Evolução do esforço" subtitle="Média mensal de horas estimadas vs realizadas">
        <p className="chart-card__empty">Sem casos formalizados suficientes para o gráfico.</p>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Evolução do esforço" subtitle="Média mensal de horas estimadas vs realizadas nos casos formalizados">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={40} />
          <Tooltip
            content={({ active, payload, label }) => (
              <RechartsTooltipContent
                active={active}
                payload={payload as never}
                label={label}
                formatValue={(value) => `${value} h`}
              />
            )}
          />
          <Legend />
          <Line type="monotone" dataKey="estimated" name="Estimado" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="actual" name="Realizado" stroke={CHART_COLORS.accent} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
