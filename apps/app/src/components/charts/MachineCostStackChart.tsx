import type { MachineStackRow } from "@/lib/tariff-chart-data";
import { formatCurrency } from "@/lib/pricing";
import { ChartCard } from "./ChartCard";

export function MachineCostStackChart({
  rows,
  highlightId,
  dense = false,
  showLegend = true,
}: {
  rows: MachineStackRow[];
  highlightId?: string;
  dense?: boolean;
  showLegend?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <ChartCard title="Composição do parque" subtitle="Como cada item 32 se divide entre fixo, variável, mão de obra e administrativo">
        <p className="chart-card__empty">Cadastre máquinas para comparar composições.</p>
      </ChartCard>
    );
  }

  const legend = rows[0]?.segments ?? [];

  return (
    <ChartCard title="Composição do parque" subtitle="Proporção do item 32 (R$/h) em cada máquina">
      <div className={`chart-machine-stack${dense ? " chart-machine-stack--dense" : ""}`}>
        {rows.map((row) => (
          <div key={row.id} className={`chart-machine-stack__row${row.id === highlightId ? " chart-machine-stack__row--active" : ""}`}>
            <div className="chart-machine-stack__head">
              <span className="chart-machine-stack__label">{row.label}</span>
              <strong className="chart-machine-stack__total">{formatCurrency(row.total)}/h</strong>
            </div>
            <div className="chart-machine-stack__track" role="img" aria-label={`Composição de ${row.label}`}>
              {row.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="chart-machine-stack__segment"
                  style={{
                    width: `${(segment.value / row.total) * 100}%`,
                    background: segment.color,
                  }}
                  title={`${segment.label}: ${formatCurrency(segment.value)}/h`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {showLegend ? (
        <div className="chart-legend">
          {legend.map((segment) => (
            <span key={segment.id} className="chart-legend__item">
              <span className="chart-legend__swatch" style={{ background: segment.color }} />
              {segment.label}
            </span>
          ))}
        </div>
      ) : null}
    </ChartCard>
  );
}
