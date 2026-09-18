import { ChartCard } from "./ChartCard";

export function HourRangeChart({
  q1,
  median,
  q3,
  current,
  suggested,
}: {
  q1: number | null;
  median: number | null;
  q3: number | null;
  current?: number | null;
  suggested?: number | null;
}) {
  if (median === null || q1 === null || q3 === null) {
    return (
      <ChartCard title="Faixa de horas" subtitle="Distribuição dos casos formalizados similares">
        <p className="chart-card__empty">Histórico insuficiente para mostrar faixa. Siga as premissas do vocabulário.</p>
      </ChartCard>
    );
  }

  const min = Math.max(0, q1 - (q3 - q1) * 0.5);
  const max = q3 + (q3 - q1) * 0.5;
  const span = max - min || 1;

  function pct(value: number) {
    return `${((value - min) / span) * 100}%`;
  }

  const marker = current && current > 0 ? current : suggested;

  return (
    <ChartCard title="Faixa de horas" subtitle={`Q1 ${q1}h · mediana ${median}h · Q3 ${q3}h`}>
      <div className="chart-range">
        <div className="chart-range__track">
          <div
            className="chart-range__band"
            style={{ left: pct(q1), width: `calc(${pct(q3)} - ${pct(q1)})` }}
          />
          <div className="chart-range__median" style={{ left: pct(median) }} />
          {marker ? <div className="chart-range__marker" style={{ left: pct(marker) }} title={`${marker}h`} /> : null}
        </div>
        <div className="chart-range__labels">
          <span>{Math.round(min)}h</span>
          {marker ? <span style={{ color: "#e87722" }}>Sua estimativa: {marker}h</span> : <span />}
          <span>{Math.round(max)}h</span>
        </div>
      </div>
    </ChartCard>
  );
}
