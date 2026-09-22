"use client";

import { useState, type CSSProperties } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { DonutSlice } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";
import { CHART_HEIGHT_DONUT } from "./recharts-theme";

export function DonutChart({
  title,
  subtitle,
  slices,
  centerLabel,
  formatValue,
  compactLegend = false,
  interactive = false,
}: {
  title: string;
  subtitle?: string;
  slices: DonutSlice[];
  centerLabel?: string;
  formatValue?: (value: number) => string;
  compactLegend?: boolean;
  interactive?: boolean;
}) {
  const format = formatValue ?? ((value: number) => String(value));
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  if (slices.length === 0) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <p className="chart-card__empty">Sem dados para exibir.</p>
      </ChartCard>
    );
  }

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const data = slices.map((slice) => ({
    name: slice.label,
    value: slice.value,
    fill: slice.color,
    percent: total > 0 ? Math.round((slice.value / total) * 100) : 0,
  }));
  const active = activeIndex !== undefined ? data[activeIndex] : undefined;

  return (
    <ChartCard title={title} subtitle={subtitle} className={interactive ? "chart-card--interactive" : undefined}>
      <div className={`chart-donut${interactive ? " chart-donut--interactive" : ""}`}>
        <div className="chart-donut__visual chart-donut__visual--recharts">
          <div
            className="chart-donut__chart-area"
            style={{ "--chart-donut-height": `${CHART_HEIGHT_DONUT}px` } as CSSProperties}
          >
            <ResponsiveContainer width="100%" height={CHART_HEIGHT_DONUT}>
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="58%"
                  outerRadius="78%"
                  paddingAngle={2}
                  stroke="none"
                  activeIndex={interactive ? activeIndex : undefined}
                  onMouseEnter={interactive ? (_, index) => setActiveIndex(index) : undefined}
                  onMouseLeave={interactive ? () => setActiveIndex(undefined) : undefined}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={slices[index]?.id ?? entry.name}
                      fill={entry.fill}
                      opacity={
                        !interactive || activeIndex === undefined || activeIndex === index ? 1 : 0.32
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-donut__center-overlay" aria-hidden="true">
            {interactive && active ? (
              <>
                <span className="chart-donut__center-text chart-donut__center-text--value">
                  {format(active.value)}
                </span>
                <span className="chart-donut__center-text chart-donut__center-text--percent">
                  {active.percent}%
                </span>
              </>
            ) : centerLabel ? (
              <span className="chart-donut__center-text chart-donut__center-text--total">{centerLabel}</span>
            ) : (
              <span className="chart-donut__center-text chart-donut__center-text--percent">
                {data[0]?.percent ?? 0}%
              </span>
            )}
            </div>
          </div>
          {interactive && !active ? <p className="chart-donut__hint">Passe o mouse no anel</p> : null}
        </div>
        <div className={`chart-donut__legend${compactLegend ? " chart-donut__legend--compact" : ""}`}>
          {data.map((slice, index) => (
            <button
              key={slice.name}
              type="button"
              className={`chart-donut__legend-item${activeIndex === index ? " chart-donut__legend-item--active" : ""}`}
              onMouseEnter={interactive ? () => setActiveIndex(index) : undefined}
              onMouseLeave={interactive ? () => setActiveIndex(undefined) : undefined}
            >
              <span className="chart-legend__swatch" style={{ background: slice.fill }} aria-hidden="true" />
              <span className="chart-donut__legend-name">{slice.name}</span>
            </button>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
