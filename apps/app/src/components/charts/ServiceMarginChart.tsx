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
import type { FieldHelpContent } from "@/components/FieldHelp";
import type { ServiceMarginRow } from "@/lib/chart-data";
import { CHART_HELP } from "@/lib/indicator-help";
import { ChartCard } from "./ChartCard";
import {
  CHART_COLORS,
  CHART_HEIGHT,
  CHART_MARGIN_LEFT,
  niceChartMax,
  truncateLabel,
} from "./recharts-theme";

export function ServiceMarginChart({
  data,
  chartHeight,
  help = CHART_HELP.serviceMargin,
  helpId = "chart-service-margin",
}: {
  data: ServiceMarginRow[];
  chartHeight?: number;
  help?: FieldHelpContent;
  helpId?: string;
}) {
  if (data.length === 0) {
    return (
      <ChartCard
        title="Margem por serviço"
        subtitle="Últimos 10 casos formalizados por data de entrega — margem orçada (bloco A) vs realizada (bloco B)"
        help={help}
        helpId={helpId}
      >
        <p className="chart-card__empty">Nenhum caso formalizado com margem registrada ainda.</p>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item.label,
    shortName: truncateLabel(item.label, 24),
    quoted: item.quotedMargin ?? 0,
    realized: item.realizedMargin ?? 0,
    hasQuoted: item.quotedMargin !== null,
    hasRealized: item.realizedMargin !== null,
  }));

  const maxValue = niceChartMax(
    chartData.flatMap((item) => [item.quoted, item.realized]),
    1.08,
  );
  const resolvedChartHeight = chartHeight ?? Math.max(CHART_HEIGHT, data.length * 34 + 48);

  return (
    <ChartCard
      title="Margem por serviço"
      subtitle="Últimos 10 casos formalizados por data de entrega — margem orçada (bloco A) vs realizada (bloco B)"
      help={help}
      helpId={helpId}
    >
      <ResponsiveContainer width="100%" height={resolvedChartHeight}>
        <BarChart data={chartData} layout="vertical" margin={{ ...CHART_MARGIN_LEFT, left: 4, bottom: 12 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, maxValue]}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            width={132}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const row = (payload[0]?.payload ?? {}) as {
                hasQuoted?: boolean;
                hasRealized?: boolean;
              };

              return (
                <div className="recharts-tooltip">
                  {label ? <p className="recharts-tooltip__label">{label}</p> : null}
                  {payload.map((item) => {
                    const isQuoted = item.dataKey === "quoted";
                    const hasValue = isQuoted ? row.hasQuoted : row.hasRealized;
                    const numericValue =
                      typeof item.value === "number" ? item.value : Number(item.value ?? 0);
                    const formatted = hasValue ? `${numericValue}%` : "—";

                    return (
                      <p
                        key={String(item.name ?? item.dataKey)}
                        className="recharts-tooltip__value"
                        style={{ color: item.color }}
                      >
                        {item.name ? `${item.name}: ` : ""}
                        {formatted}
                      </p>
                    );
                  })}
                </div>
              );
            }}
          />
          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 8 }} />
          <Bar dataKey="quoted" name="Orçada" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={10} />
          <Bar dataKey="realized" name="Realizada" fill={CHART_COLORS.accent} radius={[0, 4, 4, 0]} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
