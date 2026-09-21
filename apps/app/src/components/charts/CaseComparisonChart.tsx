"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CaseBar } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN_LEFT } from "./recharts-theme";

export function CaseComparisonChart({ data }: { data: CaseBar[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Casos similares" subtitle="Horas orçadas vs realizadas em cada registro formalizado">
        <p className="chart-card__empty">Selecione um tipo de serviço para ver casos comparáveis.</p>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item.label,
    estimated: item.estimated,
    actual: item.actual,
  }));

  return (
    <ChartCard title="Casos similares" subtitle="Horas orçadas vs realizadas em cada registro formalizado">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData} layout="vertical" margin={CHART_MARGIN_LEFT}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
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
          <Bar dataKey="estimated" name="Orçado" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={10} />
          <Bar dataKey="actual" name="Realizado" fill={CHART_COLORS.accent} radius={[0, 4, 4, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
