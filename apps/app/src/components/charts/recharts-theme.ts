import type { DonutSlice } from "@/lib/chart-data";

export const CHART_COLORS = {
  primary: "#0057b8",
  accent: "#e87722",
  success: "#16a34a",
  purple: "#7c3aed",
  cyan: "#0891b2",
  muted: "#94a3b8",
};

export const CHART_HEIGHT = 220;
export const CHART_HEIGHT_COMPACT = 180;
export const CHART_HEIGHT_DONUT = 176;

export const CHART_MARGIN = { top: 12, right: 20, left: 12, bottom: 12 };
export const CHART_MARGIN_WITH_LEGEND = { top: 12, right: 20, left: 12, bottom: 36 };
export const CHART_MARGIN_LEFT = { top: 12, right: 24, left: 8, bottom: 16 };

export function formatChartHours(value: number) {
  const rounded = Math.round(Number(value) * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text} h`;
}

export function niceChartMax(values: number[], padding = 1.12) {
  const max = Math.max(...values, 0);
  if (max <= 0) return 1;
  const padded = max * padding;
  if (padded <= 4) return Math.ceil(padded * 2) / 2;
  if (padded <= 24) return Math.ceil(padded);
  return Math.ceil(padded / 5) * 5;
}

export type BarDatum = {
  name: string;
  value: number;
  fill: string;
  percent?: number;
  id?: string;
};

export function slicesToBarData(slices: DonutSlice[], total?: number): BarDatum[] {
  const sum = total ?? slices.reduce((acc, slice) => acc + slice.value, 0);
  return slices.map((slice) => ({
    name: slice.label,
    value: slice.value,
    fill: slice.color,
    percent: sum > 0 ? Math.round((slice.value / sum) * 100) : 0,
    id: slice.id,
  }));
}

export function truncateLabel(label: string, max = 22) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
