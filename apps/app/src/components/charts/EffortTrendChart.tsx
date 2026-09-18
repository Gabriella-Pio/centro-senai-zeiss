import type { TrendPoint } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";

const W = 480;
const H = 200;
const PAD = { top: 16, right: 12, bottom: 28, left: 36 };

function buildPath(points: TrendPoint[], key: "estimated" | "actual", max: number) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  if (points.length === 0) return "";
  const step = points.length > 1 ? innerW / (points.length - 1) : 0;
  return points
    .map((point, index) => {
      const x = PAD.left + index * step;
      const y = PAD.top + innerH - (point[key] / max) * innerH;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export function EffortTrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Evolução do esforço" subtitle="Média mensal de horas estimadas vs realizadas">
        <p className="chart-card__empty">Sem casos formalizados suficientes para o gráfico.</p>
      </ChartCard>
    );
  }

  const max = Math.max(...data.flatMap((point) => [point.estimated, point.actual]), 1) * 1.1;
  const estimatedPath = buildPath(data, "estimated", max);
  const actualPath = buildPath(data, "actual", max);
  const innerH = H - PAD.top - PAD.bottom;
  const step = data.length > 1 ? (W - PAD.left - PAD.right) / (data.length - 1) : 0;

  return (
    <ChartCard title="Evolução do esforço" subtitle="Média mensal de horas estimadas vs realizadas nos casos formalizados">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-line" role="img" aria-label="Gráfico de linha comparando horas estimadas e realizadas">
        {[0, 0.5, 1].map((ratio) => {
          const y = PAD.top + innerH * (1 - ratio);
          return <line key={ratio} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} className="chart-line__grid" />;
        })}
        <path d={estimatedPath} fill="none" stroke="#0057b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={actualPath} fill="none" stroke="#e87722" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((point, index) => {
          const x = PAD.left + index * step;
          return (
            <text key={point.label} x={x} y={H - 6} textAnchor="middle" className="chart-line__axis">
              {point.label}
            </text>
          );
        })}
      </svg>
      <div className="chart-legend">
        <span className="chart-legend__item"><span className="chart-legend__swatch" style={{ background: "#0057b8" }} /> Estimado</span>
        <span className="chart-legend__item"><span className="chart-legend__swatch" style={{ background: "#e87722" }} /> Realizado</span>
      </div>
    </ChartCard>
  );
}
