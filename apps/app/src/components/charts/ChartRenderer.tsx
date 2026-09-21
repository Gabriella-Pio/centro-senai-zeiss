"use client";

import { BulletChart } from "@/components/charts/BulletChart";
import { CompositionBarChart } from "@/components/charts/CompositionBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { FleetCapacityChart } from "@/components/charts/FleetCapacityChart";
import { FleetRankingChart } from "@/components/charts/FleetRankingChart";
import { MachineCostStackChart } from "@/components/charts/MachineCostStackChart";
import { MachineRateChart } from "@/components/charts/MachineRateChart";
import { SensitivityChart } from "@/components/charts/SensitivityChart";
import { StepLineChart } from "@/components/charts/StepLineChart";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import type { FleetCapacityRow, FleetOverviewChartConfig } from "@/lib/fleet-chart-data";
import type { MachineTariff } from "@/lib/machine-tariff";
import { buildFleetRateRows, buildFleetStackRows } from "@/lib/tariff-chart-data";
import type { TariffAnalysisChartConfig } from "@/lib/tariff-chart-data";

export type RenderableChartConfig = TariffAnalysisChartConfig | FleetOverviewChartConfig;

export type ChartRendererContext = {
  machineTariffs?: MachineTariff[];
  highlightId?: string;
  onMachineSelect?: (machineId: string) => void;
};

function isFleetChart(chart: RenderableChartConfig): chart is FleetOverviewChartConfig {
  return (
    chart.kind === "rate-ranking" ||
    chart.kind === "cost-stack" ||
    chart.kind === "capacity"
  );
}

export function ChartRenderer({
  chart,
  context,
}: {
  chart: RenderableChartConfig;
  context?: ChartRendererContext;
}) {
  if (chart.kind === "rate-ranking" && context?.machineTariffs) {
    return (
      <MachineRateChart
        rows={buildFleetRateRows(context.machineTariffs)}
        highlightId={context.highlightId}
        onMachineSelect={context.onMachineSelect}
        dense
      />
    );
  }

  if (chart.kind === "cost-stack" && context?.machineTariffs) {
    return (
      <MachineCostStackChart
        rows={buildFleetStackRows(context.machineTariffs)}
        highlightId={context.highlightId}
        onMachineSelect={context.onMachineSelect}
        dense
        showLegend={false}
      />
    );
  }

  if (chart.kind === "donut") {
    return (
      <DonutChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices ?? []}
        centerLabel={chart.centerLabel}
        formatValue={chart.formatValue}
        compactLegend
        interactive
      />
    );
  }

  if (chart.kind === "sensitivity" && chart.sensitivity) {
    const subtitle = isFleetChart(chart) ? chart.sensitivity.subtitle : chart.subtitle;
    return (
      <SensitivityChart
        title={chart.title}
        subtitle={subtitle}
        baselineLabel={chart.sensitivity.baselineLabel}
        stressedLabel={chart.sensitivity.stressedLabel}
        baselineValue={chart.sensitivity.baselineValue}
        stressedValue={chart.sensitivity.stressedValue}
        formatValue={chart.formatValue}
      />
    );
  }

  if (chart.kind === "waterfall" && chart.waterfallSteps && chart.waterfallTotal !== undefined) {
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
        slices={chart.slices ?? []}
        formatValue={chart.formatValue}
      />
    );
  }

  if (chart.kind === "bullet") {
    return (
      <BulletChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices ?? []}
        formatValue={chart.formatValue}
      />
    );
  }

  if (chart.kind === "ranking") {
    return (
      <FleetRankingChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices ?? []}
        formatValue={chart.formatValue}
        highlightLabel={chart.highlightLabel}
        onMachineSelect={context?.onMachineSelect}
      />
    );
  }

  if (chart.kind === "capacity" && chart.capacityRows) {
    return (
      <FleetCapacityChart
        title={chart.title}
        subtitle={chart.subtitle}
        rows={chart.capacityRows as FleetCapacityRow[]}
        highlightId={context?.highlightId}
        onMachineSelect={context?.onMachineSelect}
        formatValue={chart.formatValue}
      />
    );
  }

  return (
    <CompositionBarChart
      title={chart.title}
      subtitle={chart.subtitle}
      slices={chart.slices ?? []}
      formatValue={chart.formatValue}
    />
  );
}
