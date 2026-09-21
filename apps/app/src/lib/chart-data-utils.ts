import type { DonutSlice } from "./chart-data";
import type { MachineCostComputed, MachineCostInputs } from "./machine-tariff";
import { getMachineHourlyRate, type MachineTariff } from "./machine-tariff";

export const PALETTE = ["#0057b8", "#e87722", "#16a34a", "#7c3aed"];
export const FIXED_PALETTE = ["#0057b8", "#0891b2", "#e87722", "#7c3aed"];
export const VARIABLE_PALETTE = ["#e87722", "#d97706", "#16a34a", "#059669"];
export const STAGES_PALETTE = ["#0057b8", "#16a34a", "#7c3aed"];
export const BREAKEVEN_PALETTE = ["#e87722", "#16a34a"];
export const FLEET_PALETTE = ["#0057b8", "#6366f1", "#0891b2"];

export const FLEET_AVERAGE_LABEL = "Média do parque";

export function roundSlice(value: number) {
  return Math.round(value * 100) / 100;
}

export function toDonutSlices(
  segments: { label: string; value: number; color: string; id?: string }[],
): DonutSlice[] {
  return segments
    .filter((segment) => segment.value > 0.001)
    .map((segment) => ({
      label: segment.label,
      value: roundSlice(segment.value),
      color: segment.color,
      id: segment.id,
    }));
}

export function average(values: number[]) {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

export function computeBreakevenHours(computed: MachineCostComputed, inputs: MachineCostInputs) {
  const contribution = computed.costWithAdministrative - computed.variableWithSalary;
  const neededHours = contribution > 0 ? computed.fixedCostAnnual / contribution / 12 : 0;
  const availableHours = inputs.usefulHoursPerYear / 12;

  return { neededHours: roundSlice(neededHours), availableHours: roundSlice(availableHours) };
}

export function buildFleetRankingSlices(
  tariffs: MachineTariff[],
  options?: { highlightId?: string; highlightLabel?: (tariff: MachineTariff) => string },
): DonutSlice[] {
  const rates = tariffs.map((tariff) => getMachineHourlyRate(tariff));
  const fleetAverage = average(rates);

  const machineSlices = [...tariffs]
    .map((tariff) => ({
      id: tariff.id,
      label:
        options?.highlightLabel && tariff.id === options.highlightId
          ? options.highlightLabel(tariff)
          : tariff.label,
      value: getMachineHourlyRate(tariff),
      color: tariff.id === options?.highlightId ? FLEET_PALETTE[0] : FLEET_PALETTE[1],
    }))
    .sort((a, b) => b.value - a.value);

  const averageSlice =
    fleetAverage > 0
      ? [{ label: FLEET_AVERAGE_LABEL, value: fleetAverage, color: FLEET_PALETTE[2] }]
      : [];

  return toDonutSlices([...machineSlices, ...averageSlice]);
}
