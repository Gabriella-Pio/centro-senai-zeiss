import type { DonutSlice } from "./chart-data";
import {
  buildMachineCostSegments,
  FLEET_AVERAGE_LABEL,
} from "./tariff-chart-data";
import {
  computeMachineCost,
  getMachineHourlyRate,
  type MachineTariff,
} from "./machine-tariff";

const PALETTE = ["#0057b8", "#e87722", "#16a34a", "#7c3aed"];
const FLEET_PALETTE = ["#0057b8", "#6366f1", "#0891b2"];
const BREAKEVEN_PALETTE = ["#e87722", "#16a34a"];

export type FleetOverviewGroup = "rates" | "structure" | "capacity" | "evolution";

export type FleetOverviewChartId =
  | "rate-ranking"
  | "position"
  | "cost-stack"
  | "avg-composition"
  | "capacity-compare"
  | "breakeven-hours"
  | "avg-stages"
  | "fleet-sensitivity";

export type FleetCapacityRow = {
  id: string;
  label: string;
  neededHours: number;
  availableHours: number;
};

export type FleetOverviewChartConfig = {
  id: FleetOverviewChartId;
  title: string;
  subtitle: string;
  kind: "rate-ranking" | "cost-stack" | "donut" | "bars" | "ranking" | "step" | "sensitivity" | "capacity";
  slices?: DonutSlice[];
  centerLabel?: string;
  formatValue: (value: number) => string;
  highlightLabel?: string;
  sensitivity?: {
    baselineLabel: string;
    stressedLabel: string;
    baselineValue: number;
    stressedValue: number;
    subtitle: string;
  };
  capacityRows?: FleetCapacityRow[];
};

export type FleetOverviewContext = {
  tariffs: MachineTariff[];
  highlightId?: string;
  formatCurrency: (value: number) => string;
};

export const FLEET_OVERVIEW_GROUPS: {
  id: FleetOverviewGroup;
  label: string;
  charts: [FleetOverviewChartId, FleetOverviewChartId];
}[] = [
  { id: "rates", label: "Tarifas", charts: ["rate-ranking", "position"] },
  { id: "structure", label: "Estrutura", charts: ["cost-stack", "avg-composition"] },
  { id: "capacity", label: "Capacidade", charts: ["capacity-compare", "breakeven-hours"] },
  { id: "evolution", label: "Evolução", charts: ["avg-stages", "fleet-sensitivity"] },
];

function roundSlice(value: number) {
  return Math.round(value * 100) / 100;
}

function toDonutSlices(segments: { label: string; value: number; color: string }[]): DonutSlice[] {
  return segments
    .filter((segment) => segment.value > 0.001)
    .map((segment) => ({
      label: segment.label,
      value: roundSlice(segment.value),
      color: segment.color,
    }));
}

function average(values: number[]) {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function buildFleetRankingSlices(tariffs: MachineTariff[], highlightId?: string): DonutSlice[] {
  const rates = tariffs.map((tariff) => getMachineHourlyRate(tariff));
  const fleetAverage = average(rates);

  return toDonutSlices(
    [...tariffs]
      .map((tariff) => ({
        label: tariff.label,
        value: getMachineHourlyRate(tariff),
        color: tariff.id === highlightId ? FLEET_PALETTE[0] : FLEET_PALETTE[1],
      }))
      .sort((a, b) => b.value - a.value)
      .concat(
        fleetAverage > 0
          ? [{ label: FLEET_AVERAGE_LABEL, value: fleetAverage, color: FLEET_PALETTE[2] }]
          : [],
      ),
  );
}

export function buildFleetAverageComposition(tariffs: MachineTariff[]): DonutSlice[] {
  if (tariffs.length === 0) return [];

  const segmentsByMachine = tariffs.map((tariff) => buildMachineCostSegments(computeMachineCost(tariff.inputs)));
  const segmentIds = ["fixed", "variable", "labor", "admin"] as const;

  return toDonutSlices(
    segmentIds.map((id, index) => ({
      label: segmentsByMachine[0].find((segment) => segment.id === id)?.label ?? id,
      value: average(segmentsByMachine.map((segments) => segments.find((segment) => segment.id === id)?.value ?? 0)),
      color: PALETTE[index],
    })),
  );
}

export function buildFleetAverageStages(tariffs: MachineTariff[]): DonutSlice[] {
  if (tariffs.length === 0) return [];

  const computed = tariffs.map((tariff) => computeMachineCost(tariff.inputs));
  return toDonutSlices([
    {
      label: "Item 30 · Sem mão de obra",
      value: average(computed.map((item) => item.costWithoutLabor)),
      color: "#0057b8",
    },
    {
      label: "Item 31 · Com mão de obra",
      value: average(computed.map((item) => item.costWithLabor)),
      color: "#16a34a",
    },
    {
      label: "Item 32 · Com overhead",
      value: average(computed.map((item) => item.costWithAdministrative)),
      color: "#7c3aed",
    },
  ]);
}

export function buildFleetCapacityRows(tariffs: MachineTariff[]): FleetCapacityRow[] {
  return tariffs
    .map((tariff) => {
      const computed = computeMachineCost(tariff.inputs);
      const contribution = computed.costWithAdministrative - computed.variableWithSalary;
      const neededHours = contribution > 0 ? computed.fixedCostAnnual / contribution / 12 : 0;

      return {
        id: tariff.id,
        label: tariff.label,
        neededHours: roundSlice(neededHours),
        availableHours: roundSlice(tariff.inputs.usefulHoursPerYear / 12),
      };
    })
    .sort((a, b) => b.neededHours - a.neededHours);
}

export function buildFleetBreakevenHoursSlices(tariffs: MachineTariff[]): DonutSlice[] {
  return toDonutSlices(
    buildFleetCapacityRows(tariffs).map((row) => ({
      label: row.label,
      value: row.neededHours,
      color: BREAKEVEN_PALETTE[0],
    })),
  );
}

function buildFleetSensitivityScenario(tariffs: MachineTariff[]) {
  const baselineRates = tariffs.map((tariff) => getMachineHourlyRate(tariff));
  const stressedRates = tariffs.map((tariff) =>
    computeMachineCost({
      ...tariff.inputs,
      interestRatePercent: tariff.inputs.interestRatePercent + 2,
    }).costWithAdministrative,
  );

  const baselineValue = average(baselineRates);
  const stressedValue = average(stressedRates);
  const from = average(tariffs.map((tariff) => tariff.inputs.interestRatePercent));
  const to = from + 2;

  return {
    baselineValue,
    stressedValue,
    subtitle: `Média do parque com juros de ${from.toFixed(0)}% → ${to.toFixed(0)}% a.a.`,
  };
}

export function buildFleetOverviewChart(
  id: FleetOverviewChartId,
  ctx: FleetOverviewContext,
): FleetOverviewChartConfig {
  const hourly = (value: number) => `${ctx.formatCurrency(value)}/h`;
  const highlight = ctx.tariffs.find((tariff) => tariff.id === ctx.highlightId);

  const charts: Record<FleetOverviewChartId, FleetOverviewChartConfig> = {
    "rate-ranking": {
      id: "rate-ranking",
      kind: "rate-ranking",
      title: "Tarifa hora do parque",
      subtitle: "Item 32 — usada nos orçamentos (R$/h)",
      formatValue: hourly,
    },
    position: {
      id: "position",
      kind: "ranking",
      title: "Posição no parque",
      subtitle: "Tarifa item 32 vs média do parque (R$/h)",
      slices: buildFleetRankingSlices(ctx.tariffs, ctx.highlightId),
      formatValue: hourly,
      highlightLabel: highlight?.label,
    },
    "cost-stack": {
      id: "cost-stack",
      kind: "cost-stack",
      title: "Composição por ativo",
      subtitle: "Fixo, variável, mão de obra e overhead em cada máquina (R$/h)",
      formatValue: hourly,
    },
    "avg-composition": {
      id: "avg-composition",
      kind: "donut",
      title: "Composição média do parque",
      subtitle: "Média aritmética das camadas do item 32 (R$/h)",
      slices: buildFleetAverageComposition(ctx.tariffs),
      centerLabel: ctx.formatCurrency(average(ctx.tariffs.map((tariff) => getMachineHourlyRate(tariff)))),
      formatValue: hourly,
    },
    "capacity-compare": {
      id: "capacity-compare",
      kind: "capacity",
      title: "Fixos vs capacidade",
      subtitle: "Horas/mês necessárias para cobrir fixos vs horas úteis disponíveis",
      capacityRows: buildFleetCapacityRows(ctx.tariffs),
      formatValue: (value) => `${Math.round(value)} h/mês`,
    },
    "breakeven-hours": {
      id: "breakeven-hours",
      kind: "bars",
      title: "Horas para cobrir fixos",
      subtitle: "Quanto cada ativo precisa rodar por mês só para pagar custos fixos",
      slices: buildFleetBreakevenHoursSlices(ctx.tariffs),
      formatValue: (value) => `${Math.round(value)} h/mês`,
    },
    "avg-stages": {
      id: "avg-stages",
      kind: "step",
      title: "Evolução média 30–32",
      subtitle: "Média do parque: sem mão de obra → operacional → tarifa (R$/h)",
      slices: buildFleetAverageStages(ctx.tariffs),
      formatValue: hourly,
    },
    "fleet-sensitivity": (() => {
      const scenario = buildFleetSensitivityScenario(ctx.tariffs);
      return {
        id: "fleet-sensitivity",
        kind: "sensitivity",
        title: "Impacto de juros no parque",
        subtitle: scenario.subtitle,
        formatValue: hourly,
        sensitivity: {
          baselineLabel: "Média atual (item 32)",
          stressedLabel: "Média com juros +2 p.p.",
          baselineValue: scenario.baselineValue,
          stressedValue: scenario.stressedValue,
          subtitle: scenario.subtitle,
        },
      };
    })(),
  };

  return charts[id];
}
