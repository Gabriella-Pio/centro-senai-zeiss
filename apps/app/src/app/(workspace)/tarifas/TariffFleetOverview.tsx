"use client";

import { useMemo, useState } from "react";
import { BarChart3, ChevronDown } from "lucide-react";
import { CompositionBarChart } from "@/components/charts/CompositionBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { FleetCapacityChart } from "@/components/charts/FleetCapacityChart";
import { FleetRankingChart } from "@/components/charts/FleetRankingChart";
import { MachineCostStackChart } from "@/components/charts/MachineCostStackChart";
import { MachineRateChart } from "@/components/charts/MachineRateChart";
import { SensitivityChart } from "@/components/charts/SensitivityChart";
import { StepLineChart } from "@/components/charts/StepLineChart";
import {
  buildFleetOverviewChart,
  FLEET_OVERVIEW_GROUPS,
  type FleetOverviewChartConfig,
  type FleetOverviewGroup,
} from "@/lib/fleet-chart-data";
import { getMachineHourlyRate, type MachineTariff } from "@/lib/machine-tariff";
import { buildFleetRateRows, buildFleetStackRows } from "@/lib/tariff-chart-data";
import { formatCurrency } from "@/lib/pricing";

const FLEET_LEGEND = [
  { id: "fixed", label: "Custos fixos", color: "#0057b8" },
  { id: "variable", label: "Energia e ferramental", color: "#e87722" },
  { id: "labor", label: "Mão de obra", color: "#16a34a" },
  { id: "admin", label: "Overhead administrativo", color: "#7c3aed" },
];

function FleetOverviewChart({
  chart,
  machineTariffs,
  highlightId,
}: {
  chart: FleetOverviewChartConfig;
  machineTariffs: MachineTariff[];
  highlightId?: string;
}) {
  if (chart.kind === "rate-ranking") {
    return (
      <MachineRateChart rows={buildFleetRateRows(machineTariffs)} highlightId={highlightId} dense />
    );
  }

  if (chart.kind === "cost-stack") {
    return (
      <MachineCostStackChart
        rows={buildFleetStackRows(machineTariffs)}
        highlightId={highlightId}
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
    return (
      <SensitivityChart
        title={chart.title}
        subtitle={chart.sensitivity.subtitle}
        baselineLabel={chart.sensitivity.baselineLabel}
        stressedLabel={chart.sensitivity.stressedLabel}
        baselineValue={chart.sensitivity.baselineValue}
        stressedValue={chart.sensitivity.stressedValue}
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

  if (chart.kind === "ranking") {
    return (
      <FleetRankingChart
        title={chart.title}
        subtitle={chart.subtitle}
        slices={chart.slices ?? []}
        formatValue={chart.formatValue}
        highlightLabel={chart.highlightLabel}
      />
    );
  }

  if (chart.kind === "capacity" && chart.capacityRows) {
    return (
      <FleetCapacityChart
        title={chart.title}
        subtitle={chart.subtitle}
        rows={chart.capacityRows}
        highlightId={highlightId}
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

export function TariffFleetOverview({
  machineTariffs,
  highlightId,
}: {
  machineTariffs: MachineTariff[];
  highlightId?: string;
}) {
  const [group, setGroup] = useState<FleetOverviewGroup>("rates");

  const ctx = useMemo(
    () => ({
      tariffs: machineTariffs,
      highlightId,
      formatCurrency,
    }),
    [machineTariffs, highlightId],
  );

  const activeGroup = FLEET_OVERVIEW_GROUPS.find((item) => item.id === group) ?? FLEET_OVERVIEW_GROUPS[0];
  const charts = useMemo(
    () => activeGroup.charts.map((id) => buildFleetOverviewChart(id, ctx)),
    [activeGroup, ctx],
  );

  if (machineTariffs.length === 0) {
    return null;
  }

  const rates = machineTariffs.map((tariff) => getMachineHourlyRate(tariff));
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);

  return (
    <details className="tariffs-card tariffs-card--overview" open>
      <summary className="tariffs-card__summary" aria-labelledby="tariffs-fleet-heading">
        <span className="tariffs-card__summary-main">
          <span className="tariffs-card__chevron" aria-hidden="true">
            <ChevronDown />
          </span>
          <BarChart3 aria-hidden="true" />
          <span id="tariffs-fleet-heading">Comparativo geral</span>
        </span>
        <span className="tariffs-card__summary-hint">
          Visão do parque · {machineTariffs.length} ativos · {formatCurrency(minRate)} – {formatCurrency(maxRate)}/h
        </span>
      </summary>

      <div className="tariffs-overview__body">
        <div className="tariffs-analysis__charts-panel tariffs-overview__panel">
          <div className="tariffs-analysis__filter" role="tablist" aria-label="Grupo de visão do parque">
            {FLEET_OVERVIEW_GROUPS.map((item) => (
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

          <div className="tariffs-analysis__chart-stage tariffs-overview__charts" role="tabpanel">
            {charts.map((chart) => (
              <div key={chart.id} className="tariffs-analysis__chart-slot">
                <FleetOverviewChart
                  chart={chart}
                  machineTariffs={machineTariffs}
                  highlightId={highlightId}
                />
              </div>
            ))}
          </div>
        </div>

        {group === "structure" ? (
          <div className="tariffs-overview__legend chart-legend">
            {FLEET_LEGEND.map((item) => (
              <span key={item.id} className="chart-legend__item">
                <span className="chart-legend__swatch" style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}
