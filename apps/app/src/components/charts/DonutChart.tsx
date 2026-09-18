import type { DonutSlice } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function DonutChart({
  title,
  subtitle,
  slices,
  centerLabel,
  formatValue,
}: {
  title: string;
  subtitle?: string;
  slices: DonutSlice[];
  centerLabel?: string;
  formatValue?: (value: number) => string;
}) {
  const format = formatValue ?? ((value: number) => String(value));
  if (slices.length === 0) {
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <p className="chart-card__empty">Sem dados para exibir.</p>
      </ChartCard>
    );
  }

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let angle = 0;
  const cx = 60;
  const cy = 60;
  const r = 48;
  const stroke = 14;

  const arcs = slices.map((slice) => {
    const sliceAngle = (slice.value / total) * 360;
    const path = describeArc(cx, cy, r, angle, angle + sliceAngle - 0.5);
    angle += sliceAngle;
    return { ...slice, path };
  });

  const mainPercent = Math.round((slices[0].value / total) * 100);

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <div className="chart-donut">
        <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label={title}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-muted)" strokeWidth={stroke} />
          {arcs.map((arc) => (
            <path key={arc.label} d={arc.path} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="butt" />
          ))}
          <text x={cx} y={cy - 4} textAnchor="middle" className="chart-donut__center">
            {centerLabel ?? `${mainPercent}%`}
          </text>
          {centerLabel ? null : (
            <text x={cx} y={cy + 12} textAnchor="middle" className="chart-donut__center-label">
              {slices[0].label}
            </text>
          )}
        </svg>
        <div className="chart-donut__legend">
          {slices.map((slice) => (
            <div key={slice.label} className="chart-donut__legend-item">
              <span>
                <span className="chart-legend__swatch" style={{ background: slice.color }} />
                {slice.label}
              </span>
              <strong>{format(slice.value)}</strong>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
