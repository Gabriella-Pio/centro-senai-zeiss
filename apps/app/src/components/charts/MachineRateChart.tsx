import type { MachineRateRow } from "@/lib/tariff-chart-data";
import { formatCurrency } from "@/lib/pricing";
import { ChartCard } from "./ChartCard";

export function MachineRateChart({
  rows,
  highlightId,
  dense = false,
}: {
  rows: MachineRateRow[];
  highlightId?: string;
  dense?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <ChartCard title="Tarifa hora do parque" subtitle="Item 32 — usada nos orçamentos">
        <p className="chart-card__empty">Cadastre máquinas para comparar tarifas.</p>
      </ChartCard>
    );
  }

  const max = rows[0]?.rate ?? 1;

  return (
    <ChartCard title="Tarifa hora do parque" subtitle="Item 32 (com administrativo) — maior para menor">
      <div className={`chart-machine-rates${dense ? " chart-machine-rates--dense" : ""}`}>
        {rows.map((row) => (
          <div key={row.id} className={`chart-machine-rates__row${row.id === highlightId ? " chart-machine-rates__row--active" : ""}`}>
            <span className="chart-machine-rates__label">{row.label}</span>
            <div className="chart-machine-rates__track">
              <div
                className="chart-machine-rates__fill"
                style={{ width: `${(row.rate / max) * 100}%` }}
              />
            </div>
            <strong className="chart-machine-rates__value">{formatCurrency(row.rate)}/h</strong>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
