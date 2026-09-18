import type { ScatterPoint } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";

const W = 480;
const H = 260;
const PAD = { top: 16, right: 16, bottom: 36, left: 40 };

export function ScatterChart({ data }: { data: ScatterPoint[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Orçado vs realizado" subtitle="Cada ponto é um caso formalizado. Na diagonal = estimativa perfeita.">
        <p className="chart-card__empty">Sem casos com horas estimadas e realizadas.</p>
      </ChartCard>
    );
  }

  const maxVal = Math.max(...data.flatMap((point) => [point.estimated, point.actual]), 1) * 1.15;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  function scale(value: number) {
    return (value / maxVal) * innerH;
  }

  const diagonalEnd = scale(maxVal);

  return (
    <ChartCard title="Orçado vs realizado" subtitle="Cada ponto é um caso formalizado. Na diagonal = estimativa perfeita.">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart-scatter" role="img" aria-label="Gráfico de dispersão estimado versus realizado">
        {[0, 0.5, 1].map((ratio) => {
          const y = PAD.top + innerH * (1 - ratio);
          return <line key={ratio} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} className="chart-scatter__grid" />;
        })}
        <line
          x1={PAD.left}
          y1={PAD.top + innerH}
          x2={PAD.left + diagonalEnd}
          y2={PAD.top + innerH - diagonalEnd}
          className="chart-scatter__diagonal"
        />
        {data.map((point) => {
          const cx = PAD.left + (point.estimated / maxVal) * innerW;
          const cy = PAD.top + innerH - scale(point.actual);
          return (
            <g key={point.id}>
              <circle
                cx={cx}
                cy={cy}
                r={5}
                className={`chart-scatter__dot ${point.withinTolerance ? "chart-scatter__dot--ok" : "chart-scatter__dot--bad"}`}
              />
              <title>{`${point.label}: ${point.estimated}h estimado, ${point.actual}h realizado`}</title>
            </g>
          );
        })}
        <text x={PAD.left} y={H - 8} className="chart-scatter__axis">Estimado (h)</text>
        <text x={8} y={PAD.top + 8} className="chart-scatter__axis" transform={`rotate(-90 8 ${PAD.top + 8})`}>Realizado (h)</text>
      </svg>
      <div className="chart-legend">
        <span className="chart-legend__item"><span className="chart-legend__swatch" style={{ background: "#16a34a" }} /> Dentro de ±15%</span>
        <span className="chart-legend__item"><span className="chart-legend__swatch" style={{ background: "#e87722" }} /> Fora da faixa</span>
      </div>
    </ChartCard>
  );
}
