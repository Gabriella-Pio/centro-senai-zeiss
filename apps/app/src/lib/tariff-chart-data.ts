import type { DonutSlice } from "./chart-data";
import { computeMachineCost, getMachineHourlyRate, type MachineCostComputed, type MachineTariff } from "./machine-tariff";

const PALETTE = ["#0057b8", "#e87722", "#16a34a", "#7c3aed"];
const FIXED_PALETTE = ["#0057b8", "#0891b2", "#6366f1", "#7c3aed"];

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
    value: Math.round(segment.value * 100) / 100,
    color: segment.color,
  }));
}

export function buildMachineFixedDonut(computed: MachineCostComputed): DonutSlice[] {
  return [
    { label: "Depreciação", value: computed.depreciationAnnual, color: FIXED_PALETTE[0] },
    { label: "Juros", value: computed.interestAnnual, color: FIXED_PALETTE[1] },
    { label: "Espaço físico", value: computed.spaceAnnual, color: FIXED_PALETTE[2] },
    { label: "Manutenção", value: computed.maintenanceAnnual, color: FIXED_PALETTE[3] },
  ]
    .filter((segment) => segment.value > 0.01)
    .map((segment) => ({
      ...segment,
      value: Math.round(segment.value * 100) / 100,
    }));
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
