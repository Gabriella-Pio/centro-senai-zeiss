import type { ParetoItem } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";

export function ParetoChart({ data }: { data: ParetoItem[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Causas de desvio" subtitle="Onde o laboratório mais erra na estimativa">
        <p className="chart-card__empty">Nenhuma causa registrada ainda.</p>
      </ChartCard>
    );
  }

  const max = data[0]?.count ?? 1;

  return (
    <ChartCard title="Causas de desvio" subtitle="Onde o laboratório mais erra na estimativa">
      <div className="chart-pareto">
        {data.map((item) => (
          <div key={item.label}>
            <p className="chart-pareto__label">{item.label}</p>
            <div className="chart-pareto__row">
              <div className="chart-pareto__track">
                <div className="chart-pareto__fill" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
              <span className="chart-pareto__count">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
