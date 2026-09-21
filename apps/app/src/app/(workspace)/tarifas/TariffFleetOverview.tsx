"use client";

import { useMemo, useState } from "react";
import { BarChart3, ChevronDown, Package, Plus } from "lucide-react";
import { Button } from "@cem/ui";
import {
  buildFleetOverviewChart,
  FLEET_OVERVIEW_GROUPS,
  type FleetOverviewGroup,
} from "@/lib/fleet-chart-data";
import { buildMachineCostSegments } from "@/lib/tariff-chart-data";
import { computeMachineCost, getMachineHourlyRate, type MachineTariff } from "@/lib/machine-tariff";
import { formatCurrency } from "@/lib/pricing";
import { TariffChartPanel } from "./TariffChartPanel";
import { TariffEmptyState } from "./TariffEmptyState";

export function TariffFleetOverview({
  machineTariffs,
  highlightId,
  canEdit,
  onAddMachine,
  onMachineSelect,
  includeArchived = false,
  onIncludeArchivedChange,
  hasArchived = false,
}: {
  machineTariffs: MachineTariff[];
  highlightId?: string;
  canEdit?: boolean;
  onAddMachine?: () => void;
  onMachineSelect?: (machineId: string) => void;
  includeArchived?: boolean;
  onIncludeArchivedChange?: (value: boolean) => void;
  hasArchived?: boolean;
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

  const groups = useMemo(
    () =>
      FLEET_OVERVIEW_GROUPS.map((item) => ({
        id: item.id,
        label: item.label,
        charts: item.charts.map((id) => buildFleetOverviewChart(id, ctx)),
      })),
    [ctx],
  );

  const fleetLegend = useMemo(() => {
    const sample = machineTariffs[0];
    if (!sample) return [];
    const segments = buildMachineCostSegments(computeMachineCost(sample.inputs));
    return segments.map((segment) => ({
      id: segment.id,
      label: segment.label,
      color: segment.color,
    }));
  }, [machineTariffs]);

  if (machineTariffs.length === 0) {
    return (
      <details className="tariffs-card tariffs-card--overview" id="tariff-fleet-overview" open>
        <summary className="tariffs-card__summary" aria-labelledby="tariffs-fleet-heading">
          <span className="tariffs-card__summary-main">
            <span className="tariffs-card__chevron" aria-hidden="true">
              <ChevronDown />
            </span>
            <BarChart3 aria-hidden="true" />
            <span id="tariffs-fleet-heading">Comparativo geral</span>
          </span>
          <span className="tariffs-card__summary-hint">Visão do parque</span>
        </summary>
        <div className="tariffs-overview__body tariffs-overview__empty">
          <TariffEmptyState
            className="tariffs-empty-state--panel"
            icon={Package}
            title="Nenhum ativo cadastrado"
            description="Cadastre ativos para comparar tarifas e montar o parque do laboratório."
            action={
              canEdit && onAddMachine ? (
                <Button type="button" size="lg" onClick={onAddMachine}>
                  <Plus aria-hidden="true" />
                  Cadastrar ativo
                </Button>
              ) : null
            }
          />
        </div>
      </details>
    );
  }

  const rates = machineTariffs.map((tariff) => getMachineHourlyRate(tariff));
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);

  const footer =
    group === "structure" && fleetLegend.length > 0
      ? (
        <div className="tariffs-overview__legend chart-legend">
          {fleetLegend.map((item) => (
            <span key={item.id} className="chart-legend__item">
              <span className="chart-legend__swatch" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      )
      : null;

  return (
    <details className="tariffs-card tariffs-card--overview" id="tariff-fleet-overview" open>
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
          {hasArchived && onIncludeArchivedChange ? (
            <label
              className="tariffs-overview__include-archived"
              onClick={(event) => event.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(event) => onIncludeArchivedChange(event.target.checked)}
                onClick={(event) => event.stopPropagation()}
              />
              Incluir arquivados
            </label>
          ) : null}
        </span>
      </summary>

      <div className="tariffs-overview__body">
        <TariffChartPanel
          groups={groups}
          activeGroup={group}
          onGroupChange={setGroup}
          tablistLabel="Grupo de visão do parque"
          context={{ machineTariffs, highlightId, onMachineSelect }}
          footer={footer}
          className="tariffs-overview__panel"
        />
      </div>
    </details>
  );
}
