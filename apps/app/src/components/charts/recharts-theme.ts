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

export const CHART_MARGIN = { top: 8, right: 16, left: 8, bottom: 8 };
export const CHART_MARGIN_LEFT = { top: 8, right: 16, left: 4, bottom: 8 };

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
