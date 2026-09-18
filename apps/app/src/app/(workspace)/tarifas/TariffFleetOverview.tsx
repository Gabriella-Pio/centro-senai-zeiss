"use client";

import { useMemo, type ReactNode } from "react";
import { BarChart3 } from "lucide-react";
import { MachineCostStackChart } from "@/components/charts/MachineCostStackChart";
import { MachineRateChart } from "@/components/charts/MachineRateChart";
import { buildFleetRateRows, buildFleetStackRows } from "@/lib/tariff-chart-data";
import { getMachineHourlyRate, type MachineTariff } from "@/lib/machine-tariff";
import { formatCurrency } from "@/lib/pricing";

const FLEET_LEGEND = [
  { id: "fixed", label: "Custos fixos", color: "#0057b8" },
  { id: "variable", label: "Energia e ferramental", color: "#e87722" },
  { id: "labor", label: "Mão de obra", color: "#16a34a" },
  { id: "admin", label: "Overhead administrativo", color: "#7c3aed" },
];

export function TariffFleetOverview({
  machineTariffs,
  highlightId,
  assetPicker,
}: {
  machineTariffs: MachineTariff[];
  highlightId?: string;
  assetPicker: ReactNode;
}) {
  const fleetRates = useMemo(() => buildFleetRateRows(machineTariffs), [machineTariffs]);
  const fleetStacks = useMemo(() => buildFleetStackRows(machineTariffs), [machineTariffs]);

  if (machineTariffs.length === 0) {
    return null;
  }

  const rates = machineTariffs.map((tariff) => getMachineHourlyRate(tariff));
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);

  return (
    <section className="tariffs-overview" aria-labelledby="tariffs-fleet-heading">
      <div className="tariffs-overview__head">
        <div>
          <p className="tariffs-overview__eyebrow">
            <BarChart3 aria-hidden="true" />
            Visão do parque
          </p>
          <h2 id="tariffs-fleet-heading">Comparativo geral</h2>
        </div>
        <dl className="tariffs-overview__stats">
          <div>
            <dt>Ativos</dt>
            <dd>{machineTariffs.length}</dd>
          </div>
          <div>
            <dt>Faixa item 32</dt>
            <dd>{formatCurrency(minRate)} – {formatCurrency(maxRate)}/h</dd>
          </div>
        </dl>
      </div>

      <div className="tariffs-overview__charts">
        <MachineRateChart rows={fleetRates} highlightId={highlightId} dense />
        <MachineCostStackChart rows={fleetStacks} highlightId={highlightId} dense showLegend={false} />
      </div>

      <div className="tariffs-overview__legend chart-legend">
        {FLEET_LEGEND.map((item) => (
          <span key={item.id} className="chart-legend__item">
            <span className="chart-legend__swatch" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="tariffs-overview__assets">
        <h3>Ativos do laboratório</h3>
        {assetPicker}
      </div>
    </section>
  );
}
