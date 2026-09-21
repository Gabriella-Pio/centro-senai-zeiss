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
import { ChartCard } from "./ChartCard";
import { RechartsTooltipContent } from "./RechartsTooltip";
import { CHART_COLORS, CHART_HEIGHT } from "./recharts-theme";

export function SensitivityChart({
  title,
  subtitle,
  baselineLabel,
  stressedLabel,
  baselineValue,
  stressedValue,
  formatValue,
}: {
  title: string;
  subtitle: string;
  baselineLabel: string;
  stressedLabel: string;
  baselineValue: number;
  stressedValue: number;
  formatValue: (value: number) => string;
}) {
  const delta = stressedValue - baselineValue;
  const deltaPercent = baselineValue > 0 ? (delta / baselineValue) * 100 : 0;
  const deltaSign = delta >= 0 ? "+" : "";

  const data = [
    { name: baselineLabel, value: baselineValue, fill: CHART_COLORS.primary },
    { name: stressedLabel, value: stressedValue, fill: CHART_COLORS.accent },
  ];

  return (
    <ChartCard title={title} subtitle={subtitle} className="chart-card--interactive chart-card--paired">
      <div className="chart-card__body chart-sensitivity">
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            barCategoryGap="18%"
            barGap={4}
          >
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              tickMargin={8}
            />
            <YAxis tick={{ fontSize: 10 }} width={44} domain={[0, "auto"]} />
            <Tooltip
              cursor={{ fill: "color-mix(in srgb, var(--color-primary) 6%, transparent)" }}
              content={({ active, payload, label }) => (
                <RechartsTooltipContent
                  active={active}
                  payload={payload as never}
                  label={label}
                  formatValue={formatValue}
                />
              )}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={96}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-card__footer chart-sensitivity__impact">
        <span className="chart-sensitivity__impact-label">Impacto na tarifa</span>
        <span className="chart-sensitivity__impact-meta">
          <strong className="chart-sensitivity__impact-value">
            {deltaSign}{formatValue(delta)}
          </strong>
          <span className="chart-sensitivity__impact-percent">
            {deltaSign}{deltaPercent.toFixed(2)}%
          </span>
        </span>
      </div>
    </ChartCard>
  );
}
