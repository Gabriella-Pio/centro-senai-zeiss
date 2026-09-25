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
import type { ParetoItem } from "@/lib/chart-data";
import { CHART_HELP } from "@/lib/indicator-help";
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT, CHART_MARGIN_LEFT, truncateLabel } from "./recharts-theme";

export function ParetoChart({
  data,
  help = CHART_HELP.pareto,
  helpId = "chart-pareto",
}: {
  data: ParetoItem[];
  help?: FieldHelpContent;
  helpId?: string;
}) {
  if (data.length === 0) {
    return (
      <ChartCard
        title="Causas de desvio"
        subtitle="Onde o laboratório mais erra na estimativa"
        help={help}
        helpId={helpId}
      >
        <p className="chart-card__empty">Nenhuma causa registrada ainda.</p>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    name: item.label,
    shortName: truncateLabel(item.label, 28),
    count: item.count,
    percent: item.percent,
  }));

  return (
    <ChartCard
      title="Causas de desvio"
      subtitle="Onde o laboratório mais erra na estimativa"
      help={help}
      helpId={helpId}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={chartData} layout="vertical" margin={{ ...CHART_MARGIN_LEFT, left: 4, bottom: 12 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="shortName"
            width={148}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          />
          <Tooltip
            cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
            content={({ active, payload, label }) => (
              <RechartsTooltipContent
                active={active}
                payload={payload as never}
                label={label}
                formatValue={(value) => {
                  const percent = (payload?.[0]?.payload as { percent?: number })?.percent;
                  return percent !== undefined ? `${value} casos (${percent}%)` : `${value} casos`;
                }}
              />
            )}
          />
          <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
