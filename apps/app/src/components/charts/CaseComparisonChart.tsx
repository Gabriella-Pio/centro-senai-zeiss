import type { CaseBar } from "@/lib/chart-data";
import { ChartCard } from "./ChartCard";

export function CaseComparisonChart({ data }: { data: CaseBar[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Casos similares" subtitle="Horas orçadas vs realizadas em cada registro formalizado">
        <p className="chart-card__empty">Selecione um tipo de serviço para ver casos comparáveis.</p>
      </ChartCard>
    );
  }

  const max = Math.max(...data.flatMap((item) => [item.estimated, item.actual]), 1);

  return (
    <ChartCard title="Casos similares" subtitle="Horas orçadas vs realizadas em cada registro formalizado">
      <div className="chart-bars">
        {data.map((item) => (
          <div key={item.id} className="chart-bars__row">
            <span className="chart-bars__label">{item.label}</span>
            <div className="chart-bars__track">
              <div className="chart-bars__bar chart-bars__bar--estimated" style={{ width: `${(item.estimated / max) * 100}%` }} title={`Estimado: ${item.estimated}h`} />
              <div className="chart-bars__bar chart-bars__bar--actual" style={{ width: `${(item.actual / max) * 100}%` }} title={`Realizado: ${item.actual}h`} />
            </div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <span className="chart-legend__item"><span className="chart-legend__swatch" style={{ background: "#0057b8" }} /> Orçado</span>
        <span className="chart-legend__item"><span className="chart-legend__swatch" style={{ background: "#e87722" }} /> Realizado</span>
      </div>
    </ChartCard>
  );
}
