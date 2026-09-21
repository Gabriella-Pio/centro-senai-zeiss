import type { DonutSlice, WaterfallStep } from "./chart-data";
import {
  computeMachineCost,
  getMachineHourlyRate,
  type MachineCostComputed,
  type MachineCostInputs,
  type MachineTariff,
} from "./machine-tariff";
const PALETTE = ["#0057b8", "#e87722", "#16a34a", "#7c3aed"];
const FIXED_PALETTE = ["#0057b8", "#0891b2", "#e87722", "#7c3aed"];
const VARIABLE_PALETTE = ["#e87722", "#d97706", "#16a34a", "#059669"];
const STAGES_PALETTE = ["#0057b8", "#16a34a", "#7c3aed"];
const BREAKEVEN_PALETTE = ["#e87722", "#16a34a"];
const FLEET_PALETTE = ["#0057b8", "#6366f1", "#0891b2"];

export const FLEET_AVERAGE_LABEL = "Média do parque";

export type TariffAnalysisView =
  | "tariff"
  | "fixed"
  | "variable"
  | "stages"
  | "waterfall"
  | "sensitivity"
  | "breakeven"
  | "fleet";

export type TariffAnalysisGroup = "overview" | "operational" | "buildup" | "context";

export type TariffAnalysisChartConfig = {
  id: TariffAnalysisView;
  label: string;
  title: string;
  subtitle: string;
  kind: "donut" | "bars" | "waterfall" | "sensitivity" | "step" | "bullet" | "ranking";
  slices: DonutSlice[];
  centerLabel?: string;
  formatValue: (value: number) => string;
  waterfallSteps?: WaterfallStep[];
  waterfallTotal?: number;
  sensitivity?: {
    baselineLabel: string;
    stressedLabel: string;
    baselineValue: number;
    stressedValue: number;
  };
  highlightLabel?: string;
};

function formatCurrencyPrecise(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export type TariffAnalysisContext = {
  computed: MachineCostComputed;
  inputs: MachineCostInputs;
  machineId: string;
  machineLabel: string;
  fleet: MachineTariff[];
  formatCurrency: (value: number) => string;
};

export const TARIFF_ANALYSIS_GROUPS: {
  id: TariffAnalysisGroup;
  label: string;
  charts: [TariffAnalysisView, TariffAnalysisView];
}[] = [
  { id: "overview", label: "Visão geral", charts: ["tariff", "fixed"] },
  { id: "operational", label: "Operacional", charts: ["variable", "stages"] },
  { id: "buildup", label: "Composição", charts: ["waterfall", "sensitivity"] },
  { id: "context", label: "Contexto", charts: ["breakeven", "fleet"] },
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

export type MachineCostSegment = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type MachineRateRow = {
  id: string;
  label: string;
  rate: number;
};

export type MachineStackRow = {
  id: string;
  label: string;
  total: number;
  segments: MachineCostSegment[];
};

export function buildMachineCostSegments(computed: MachineCostComputed): MachineCostSegment[] {
  const labor = computed.salaryHourly + computed.extraSalaryHourly;
  const admin = computed.costWithAdministrative - computed.costWithLabor;

  return [
    { id: "fixed", label: "Custos fixos", value: computed.fixedCostHourly, color: PALETTE[0] },
    { id: "variable", label: "Energia e ferramental", value: computed.variableWithoutSalary, color: PALETTE[1] },
    { id: "labor", label: "Mão de obra", value: labor, color: PALETTE[2] },
    { id: "admin", label: "Overhead administrativo", value: admin, color: PALETTE[3] },
  ].filter((segment) => segment.value > 0.001);
}

export function buildMachineCostDonut(computed: MachineCostComputed): DonutSlice[] {
  return buildMachineCostSegments(computed).map((segment) => ({
    label: segment.label,
    value: roundSlice(segment.value),
    color: segment.color,
  }));
}

export function buildMachineFixedDonut(computed: MachineCostComputed): DonutSlice[] {
  return toDonutSlices([
    { label: "Depreciação", value: computed.depreciationAnnual, color: FIXED_PALETTE[0] },
    { label: "Juros", value: computed.interestAnnual, color: FIXED_PALETTE[1] },
    { label: "Espaço físico", value: computed.spaceAnnual, color: FIXED_PALETTE[2] },
    { label: "Manutenção", value: computed.maintenanceAnnual, color: FIXED_PALETTE[3] },
  ]);
}

export function buildMachineVariableDonut(computed: MachineCostComputed): DonutSlice[] {
  return toDonutSlices([
    { label: "Energia elétrica", value: computed.energyHourly, color: VARIABLE_PALETTE[0] },
    { label: "Ferramental", value: computed.toolingHourly, color: VARIABLE_PALETTE[1] },
    { label: "Salário turnos", value: computed.salaryHourly, color: VARIABLE_PALETTE[2] },
    { label: "Extras salário", value: computed.extraSalaryHourly, color: VARIABLE_PALETTE[3] },
  ]);
}

export function buildMachineStagesDonut(computed: MachineCostComputed): DonutSlice[] {
  return toDonutSlices([
    { label: "Item 30 · Sem mão de obra", value: computed.costWithoutLabor, color: STAGES_PALETTE[0] },
    { label: "Item 31 · Com mão de obra", value: computed.costWithLabor, color: STAGES_PALETTE[1] },
    { label: "Item 32 · Com overhead", value: computed.costWithAdministrative, color: STAGES_PALETTE[2] },
  ]);
}

function buildWaterfallSteps(computed: MachineCostComputed): WaterfallStep[] {
  const labor = computed.salaryHourly + computed.extraSalaryHourly;
  const admin = computed.costWithAdministrative - computed.costWithLabor;

  return [
    { label: "Custos fixos", value: computed.fixedCostHourly, color: PALETTE[0] },
    { label: "Energia e ferramental", value: computed.variableWithoutSalary, color: PALETTE[1] },
    { label: "Mão de obra", value: labor, color: PALETTE[2] },
    { label: "Overhead administrativo", value: admin, color: PALETTE[3] },
  ].filter((step) => step.value > 0.001);
}

function buildSensitivityScenario(ctx: TariffAnalysisContext) {
  const stressed = computeMachineCost({
    ...ctx.inputs,
    interestRatePercent: ctx.inputs.interestRatePercent + 2,
  });
  const from = ctx.inputs.interestRatePercent;
  const to = ctx.inputs.interestRatePercent + 2;

  return {
    baselineValue: ctx.computed.costWithAdministrative,
    stressedValue: stressed.costWithAdministrative,
    subtitle: `Simula juros de ${from}% → ${to}% a.a. sobre o custo de reposição adotado`,
  };
}

function buildBreakevenSlices(ctx: TariffAnalysisContext): DonutSlice[] {
  const contribution = ctx.computed.costWithAdministrative - ctx.computed.variableWithSalary;
  const hoursMonth =
    contribution > 0 ? ctx.computed.fixedCostAnnual / contribution / 12 : 0;
  const availableMonth = ctx.inputs.usefulHoursPerYear / 12;

  return toDonutSlices([
    { label: "Horas p/ cobrir fixos", value: hoursMonth, color: BREAKEVEN_PALETTE[0] },
    { label: "Horas úteis/mês", value: availableMonth, color: BREAKEVEN_PALETTE[1] },
  ]);
}

function buildFleetSlices(ctx: TariffAnalysisContext): DonutSlice[] {
  const rates = ctx.fleet.map((tariff) => getMachineHourlyRate(tariff));
  const average = rates.length > 0 ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : 0;

  return toDonutSlices(
    [...ctx.fleet]
      .map((tariff) => ({
        label: tariff.id === ctx.machineId ? `${tariff.label} (este ativo)` : tariff.label,
        value: getMachineHourlyRate(tariff),
        color: tariff.id === ctx.machineId ? FLEET_PALETTE[0] : FLEET_PALETTE[1],
      }))
      .sort((a, b) => b.value - a.value)
      .concat(
        average > 0
          ? [{ label: FLEET_AVERAGE_LABEL, value: average, color: FLEET_PALETTE[2] }]
          : [],
      ),
  );
}

export function buildTariffAnalysisChart(
  id: TariffAnalysisView,
  ctx: TariffAnalysisContext,
): TariffAnalysisChartConfig {
  const hourly = (value: number) => `${ctx.formatCurrency(value)}/h`;
  const { computed } = ctx;

  const charts: Record<TariffAnalysisView, TariffAnalysisChartConfig> = {
    tariff: {
      id: "tariff",
      label: "Tarifa (item 32)",
      title: "Composição do item 32",
      subtitle: "Tarifa hora usada nos orçamentos (R$/h)",
      kind: "donut",
      slices: buildMachineCostDonut(computed),
      centerLabel: ctx.formatCurrency(computed.costWithAdministrative),
      formatValue: hourly,
    },
    fixed: {
      id: "fixed",
      label: "Custos fixos",
      title: "Composição dos custos fixos",
      subtitle: "Depreciação, juros, espaço e manutenção (R$/ano)",
      kind: "bars",
      slices: buildMachineFixedDonut(computed),
      formatValue: ctx.formatCurrency,
    },
    variable: {
      id: "variable",
      label: "Custos variáveis",
      title: "Composição dos custos variáveis",
      subtitle: "Energia, ferramental e mão de obra direta (R$/h)",
      kind: "bars",
      slices: buildMachineVariableDonut(computed),
      formatValue: hourly,
    },
    stages: {
      id: "stages",
      label: "Etapas 30–32",
      title: "Evolução do custo hora",
      subtitle: "Sem mão de obra → operacional → tarifa de orçamento (R$/h)",
      kind: "step",
      slices: buildMachineStagesDonut(computed),
      formatValue: hourly,
    },
    waterfall: {
      id: "waterfall",
      label: "Waterfall",
      title: "De fixo até item 32",
      subtitle: "Como cada camada compõe a tarifa final (R$/h)",
      kind: "waterfall",
      slices: [],
      waterfallSteps: buildWaterfallSteps(computed),
      waterfallTotal: computed.costWithAdministrative,
      formatValue: hourly,
    },
    sensitivity: (() => {
      const scenario = buildSensitivityScenario(ctx);
      const hourlyPrecise = (value: number) => `${formatCurrencyPrecise(value)}/h`;
      return {
        id: "sensitivity",
        label: "Sensibilidade",
        title: "Impacto de juros +2 p.p.",
        subtitle: scenario.subtitle,
        kind: "sensitivity",
        slices: [],
        formatValue: hourlyPrecise,
        sensitivity: {
          baselineLabel: "Tarifa atual (item 32)",
          stressedLabel: "Com juros +2 p.p.",
          baselineValue: scenario.baselineValue,
          stressedValue: scenario.stressedValue,
        },
      };
    })(),
    breakeven: {
      id: "breakeven",
      label: "Ponto de equilíbrio",
      title: "Horas para cobrir custos fixos",
      subtitle: "Horas/mês necessárias vs capacidade útil do ativo",
      kind: "bullet",
      slices: buildBreakevenSlices(ctx),
      formatValue: (value) => `${Math.round(value)} h/mês`,
    },
    fleet: {
      id: "fleet",
      label: "Comparativo do parque",
      title: "Posição no parque",
      subtitle: "Tarifa item 32 vs média do parque de máquinas (R$/h)",
      kind: "ranking",
      slices: buildFleetSlices(ctx),
      formatValue: hourly,
      highlightLabel: ctx.machineLabel,
    },
  };

  return charts[id];
}

export function buildTariffAnalysisCharts(ctx: TariffAnalysisContext): TariffAnalysisChartConfig[] {
  const chartIds: TariffAnalysisView[] = [
    "tariff",
    "fixed",
    "variable",
    "stages",
    "waterfall",
    "sensitivity",
    "breakeven",
    "fleet",
  ];
  return chartIds.map((id) => buildTariffAnalysisChart(id, ctx));
}

export function buildFleetRateRows(tariffs: MachineTariff[]): MachineRateRow[] {
  return [...tariffs]
    .map((tariff) => ({
      id: tariff.id,
      label: tariff.label,
      rate: getMachineHourlyRate(tariff),
    }))
    .sort((a, b) => b.rate - a.rate);
}

export function buildFleetStackRows(tariffs: MachineTariff[]): MachineStackRow[] {
  return buildFleetRateRows(tariffs).map((row) => {
    const computed = computeMachineCost(tariffs.find((tariff) => tariff.id === row.id)!.inputs);
    const segments = buildMachineCostSegments(computed);
    return {
      id: row.id,
      label: row.label,
      total: row.rate,
      segments,
    };
  });
}
