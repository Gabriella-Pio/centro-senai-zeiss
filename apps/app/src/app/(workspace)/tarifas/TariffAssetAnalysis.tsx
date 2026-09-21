"use client";

import { useMemo, useState } from "react";
import { BulletChart } from "@/components/charts/BulletChart";
import { CompositionBarChart } from "@/components/charts/CompositionBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { FleetRankingChart } from "@/components/charts/FleetRankingChart";
import { SensitivityChart } from "@/components/charts/SensitivityChart";
import { StepLineChart } from "@/components/charts/StepLineChart";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import {
  buildTariffAnalysisChart,
  TARIFF_ANALYSIS_GROUPS,
  type TariffAnalysisChartConfig,
  type TariffAnalysisGroup,
} from "@/lib/tariff-chart-data";
import type { MachineCostComputed, MachineCostInputs, MachineTariff } from "@/lib/machine-tariff";
import { formatCurrency } from "@/lib/pricing";

function AnalysisChart({ chart }: { chart: TariffAnalysisChartConfig }) {
  if (chart.kind === "donut") {
    return (
      <DonutChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices}
        centerLabel={chart.centerLabel}
        formatValue={chart.formatValue}
        compactLegend
        interactive
      />
    );
  }

  if (chart.kind === "sensitivity" && chart.sensitivity) {
    return (
      <SensitivityChart
        title={chart.title}
        subtitle={chart.subtitle}
        baselineLabel={chart.sensitivity.baselineLabel}
        stressedLabel={chart.sensitivity.stressedLabel}
        baselineValue={chart.sensitivity.baselineValue}
        stressedValue={chart.sensitivity.stressedValue}
        formatValue={chart.formatValue}
      />
    );
  }

  if (chart.kind === "waterfall" && chart.waterfallSteps && chart.waterfallTotal) {
    return (
      <WaterfallChart
        title={chart.title}
        subtitle={chart.subtitle}
        steps={chart.waterfallSteps}
        total={chart.waterfallTotal}
        formatValue={chart.formatValue}
      />
    );
  }

  if (chart.kind === "step") {
    return (
      <StepLineChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices}
        formatValue={chart.formatValue}
      />
    );
  }

  if (chart.kind === "bullet") {
    return (
      <BulletChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices}
        formatValue={chart.formatValue}
      />
    );
  }

  if (chart.kind === "ranking") {
    return (
      <FleetRankingChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices}
        formatValue={chart.formatValue}
        highlightLabel={chart.highlightLabel}
      />
    );
  }

  return (
    <CompositionBarChart
      title={chart.title}
      subtitle={chart.subtitle}
      slices={chart.slices}
      formatValue={chart.formatValue}
    />
  );
}

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

  const activeGroup = TARIFF_ANALYSIS_GROUPS.find((item) => item.id === group) ?? TARIFF_ANALYSIS_GROUPS[0];
  const charts = useMemo(
    () => activeGroup.charts.map((id) => buildTariffAnalysisChart(id, ctx)),
    [activeGroup, ctx],
  );

  return (
    <div className="tariffs-analysis__charts-panel">
      <div className="tariffs-analysis__filter" role="tablist" aria-label="Grupo de análise">
        {TARIFF_ANALYSIS_GROUPS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={group === item.id}
            className={`tariffs-analysis__filter-btn${group === item.id ? " tariffs-analysis__filter-btn--active" : ""}`}
            onClick={() => setGroup(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="tariffs-analysis__chart-stage" role="tabpanel">
        {charts.map((chart) => (
          <div key={chart.id} className="tariffs-analysis__chart-slot">
            <AnalysisChart chart={chart} />
          </div>
        ))}
      </div>
    </div>
  );
}
