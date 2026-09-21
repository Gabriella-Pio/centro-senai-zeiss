"use client";

import {
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart as RechartsScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { ScatterPoint } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN } from "./recharts-theme";

export function ScatterChart({ data }: { data: ScatterPoint[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Orçado vs realizado" subtitle="Cada ponto é um caso formalizado. Na diagonal = estimativa perfeita.">
        <p className="chart-card__empty">Sem casos com horas estimadas e realizadas.</p>
      </ChartCard>
    );
  }

  const maxVal = Math.max(...data.flatMap((point) => [point.estimated, point.actual]), 1) * 1.1;
  const ok = data.filter((point) => point.withinTolerance);
  const bad = data.filter((point) => !point.withinTolerance);

  return (
    <ChartCard title="Orçado vs realizado" subtitle="Cada ponto é um caso formalizado. Na diagonal = estimativa perfeita.">
      <ResponsiveContainer width="100%" height={CHART_HEIGHT + 20}>
        <RechartsScatterChart margin={{ ...CHART_MARGIN, left: 12, bottom: 20 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" dataKey="estimated" name="Estimado" unit="h" domain={[0, maxVal]} tick={{ fontSize: 10 }} />
          <YAxis type="number" dataKey="actual" name="Realizado" unit="h" domain={[0, maxVal]} tick={{ fontSize: 10 }} width={44} />
          <ZAxis range={[50, 50]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as ScatterPoint;
              return (
                <div className="recharts-tooltip">
                  <p className="recharts-tooltip__label">{point.label}</p>
                  <p className="recharts-tooltip__value">Estimado: {point.estimated} h</p>
                  <p className="recharts-tooltip__value">Realizado: {point.actual} h</p>
                </div>
              );
            }}
          />
          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: maxVal, y: maxVal }]} stroke="var(--color-muted-foreground)" strokeDasharray="4 4" />
          <Legend />
          <Scatter name="Dentro de ±15%" data={ok} fill={CHART_COLORS.success} />
          <Scatter name="Fora da faixa" data={bad} fill={CHART_COLORS.accent} />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
