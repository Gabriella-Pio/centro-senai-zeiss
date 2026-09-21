"use client";

import { useMemo, useState } from "react";
import {
  buildTariffAnalysisChart,
  TARIFF_ANALYSIS_GROUPS,
  type TariffAnalysisGroup,
} from "@/lib/tariff-chart-data";
import type { MachineCostComputed, MachineCostInputs, MachineTariff } from "@/lib/machine-tariff";
import { formatCurrency } from "@/lib/pricing";
import { TariffChartPanel } from "./TariffChartPanel";

export function TariffAssetAnalysis({
  computed,
  inputs,
  machineId,
  machineLabel,
  fleet,
}: {
  computed: MachineCostComputed;
  inputs: MachineCostInputs;
  machineId: string;
  machineLabel: string;
  fleet: MachineTariff[];
}) {
  const [group, setGroup] = useState<TariffAnalysisGroup>("overview");

  const ctx = useMemo(
    () => ({
      computed,
      inputs,
      machineId,
      machineLabel,
      fleet,
      formatCurrency,
    }),
    [computed, inputs, machineId, machineLabel, fleet],
  );

  const groups = useMemo(
    () =>
      TARIFF_ANALYSIS_GROUPS.map((item) => ({
        id: item.id,
        label: item.label,
        charts: item.charts.map((id) => buildTariffAnalysisChart(id, ctx)),
      })),
    [ctx],
  );

  return (
    <TariffChartPanel
      groups={groups}
      activeGroup={group}
      onGroupChange={setGroup}
      tablistLabel="Grupo de análise"
    />
  );
}
