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
import type { FieldHelpContent } from "@/components/FieldHelp";
import type { ScatterPoint } from "@/lib/chart-data";
import { CHART_HELP } from "@/lib/indicator-help";
import { ChartCard } from "./ChartCard";
import {
  CHART_COLORS,
  CHART_HEIGHT_WITH_LEGEND,
  CHART_MARGIN_WITH_LEGEND,
  formatChartHours,
  niceChartMax,
} from "./recharts-theme";

export function ScatterChart({
  data,
  chartHeight = CHART_HEIGHT_WITH_LEGEND,
  help = CHART_HELP.scatter,
  helpId = "chart-scatter",
}: {
  data: ScatterPoint[];
  chartHeight?: number;
  help?: FieldHelpContent;
  helpId?: string;
}) {
  if (data.length === 0) {
    return (
      <ChartCard
        title="Orçado vs realizado"
        subtitle="Cada ponto é um caso formalizado. Na diagonal = estimativa perfeita."
        help={help}
        helpId={helpId}
      >
        <p className="chart-card__empty">Sem casos com horas estimadas e realizadas.</p>
      </ChartCard>
    );
  }

  const maxVal = niceChartMax(data.flatMap((point) => [point.estimated, point.actual]));
  const ok = data.filter((point) => point.withinTolerance);
  const bad = data.filter((point) => !point.withinTolerance);

  return (
    <ChartCard
      title="Orçado vs realizado"
      subtitle="Cada ponto é um caso formalizado. Na diagonal = estimativa perfeita."
      help={help}
      helpId={helpId}
    >
      <ResponsiveContainer width="100%" height={chartHeight}>
        <RechartsScatterChart margin={{ ...CHART_MARGIN_WITH_LEGEND, left: 4 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="estimated"
            name="Estimado"
            domain={[0, maxVal]}
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value) => formatChartHours(Number(value))}
          />
          <YAxis
            type="number"
            dataKey="actual"
            name="Realizado"
            domain={[0, maxVal]}
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value) => formatChartHours(Number(value))}
            width={48}
          />
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
          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 10 }} />
          <Scatter name="Dentro de ±15%" data={ok} fill={CHART_COLORS.success} />
          <Scatter name="Fora da faixa" data={bad} fill={CHART_COLORS.accent} />
        </RechartsScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
