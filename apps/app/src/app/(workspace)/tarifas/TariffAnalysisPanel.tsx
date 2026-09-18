"use client";

import { useMemo } from "react";
import { DonutChart } from "@/components/charts/DonutChart";
import {
  buildMachineCostDonut,
  buildMachineFixedDonut,
} from "@/lib/tariff-chart-data";
import { computeMachineCost, type MachineTariff } from "@/lib/machine-tariff";
import { formatCurrency } from "@/lib/pricing";

export function TariffAnalysisPanel({
  selectedMachine,
}: {
  selectedMachine?: MachineTariff;
}) {
  const computed = useMemo(
    () => (selectedMachine ? computeMachineCost(selectedMachine.inputs) : null),
    [selectedMachine],
  );
  const costDonut = useMemo(
    () => (computed ? buildMachineCostDonut(computed) : []),
    [computed],
  );
  const fixedDonut = useMemo(
    () => (computed ? buildMachineFixedDonut(computed) : []),
    [computed],
  );

  if (!selectedMachine || !computed) {
    return (
      <p className="tariffs-analysis__hint">Selecione um ativo acima para ver a análise individual.</p>
    );
  }

  return (
    <div className="tariffs-analysis">
      <div className="tariffs-analysis__section-head">
        <h3>{selectedMachine.label}</h3>
        <p>Composição da tarifa e dos custos fixos do ativo selecionado.</p>
      </div>
      <div className="tariffs-analysis__machine-charts">
        <DonutChart
          title="Composição do item 32"
          subtitle="Tarifa hora usada nos orçamentos (R$/h)"
          slices={costDonut}
          centerLabel={formatCurrency(computed.costWithAdministrative)}
          formatValue={(value) => `${formatCurrency(value)}/h`}
        />
        <DonutChart
          title="Composição dos custos fixos"
          subtitle="Depreciação, juros, espaço e manutenção (R$/ano)"
          slices={fixedDonut}
          centerLabel={formatCurrency(computed.fixedCostAnnual)}
          formatValue={(value) => formatCurrency(value)}
        />
      </div>
    </div>
  );
}
