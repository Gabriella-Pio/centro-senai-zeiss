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
import type { FieldHelpContent } from "@/components/FieldHelp";
import {
  CONFIDENCE_LEVEL_COLORS,
  CONFIDENCE_LEVEL_LABELS,
  type ServiceTypeConfidenceRow,
} from "@/lib/chart-data";
import { CHART_HELP } from "@/lib/indicator-help";
import { ChartCard } from "./ChartCard";
import {
  CHART_HEIGHT,
  CHART_MARGIN_LEFT,
  niceChartMax,
  truncateLabel,
} from "./recharts-theme";

export function ConfidenceByServiceTypeChart({
  data,
  help = CHART_HELP.confidenceByServiceType,
  helpId = "chart-confidence-by-service-type",
}: {
  data: ServiceTypeConfidenceRow[];
  help?: FieldHelpContent;
  helpId?: string;
}) {
  if (data.length === 0) {
    return (
      <ChartCard
        title="Confiança por tipo de serviço"
        subtitle="Casos formalizados por tipo ativo no vocabulário"
        help={help}
        helpId={helpId}
      >
        <p className="chart-card__empty">Nenhum tipo de serviço ativo no vocabulário.</p>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item.label,
    shortName: truncateLabel(item.label, 42),
    count: item.caseCount,
    fill: CONFIDENCE_LEVEL_COLORS[item.level],
    levelLabel: CONFIDENCE_LEVEL_LABELS[item.level],
  }));

  const maxValue = niceChartMax(chartData.map((item) => item.count));
  const chartHeight = Math.max(CHART_HEIGHT, data.length * 30 + 56);
  const highCount = data.filter((item) => item.level === "high").length;

  return (
    <ChartCard
      title="Confiança por tipo de serviço"
      subtitle={`${highCount} de ${data.length} tipos com confiança alta no Assistente`}
      help={help}
      helpId={helpId}
    >
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={chartData} layout="vertical" margin={{ ...CHART_MARGIN_LEFT, left: 4, bottom: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, maxValue]}
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            width={220}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const row = (payload[0]?.payload ?? {}) as { count?: number; levelLabel?: string };

              return (
                <div className="recharts-tooltip">
                  {label ? <p className="recharts-tooltip__label">{label}</p> : null}
                  <p className="recharts-tooltip__value">
                    {row.count ?? 0} {row.count === 1 ? "caso formalizado" : "casos formalizados"}
                  </p>
                  <p className="recharts-tooltip__value">Confiança {row.levelLabel?.toLowerCase()}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="count" name="Casos formalizados" radius={[0, 6, 6, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-confidence-legend" aria-hidden="true">
        {(Object.keys(CONFIDENCE_LEVEL_LABELS) as Array<keyof typeof CONFIDENCE_LEVEL_LABELS>).map(
          (level) => (
            <span key={level} className="chart-confidence-legend__item">
              <span
                className="chart-legend__swatch"
                style={{ background: CONFIDENCE_LEVEL_COLORS[level] }}
              />
              {CONFIDENCE_LEVEL_LABELS[level]} ({level === "high" ? "≥15" : level === "medium" ? "5–14" : "0–4"} casos)
            </span>
          ),
        )}
      </div>
    </ChartCard>
  );
}
