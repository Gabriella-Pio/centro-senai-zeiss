import type { MachineCostInputs, MachineTariff } from "./machine-tariff";

export const DEFAULT_MACHINE_INPUTS: MachineCostInputs = {
  usefulLifeYears: 10,
  inflationRate: 3.5,
  interestRatePercent: 10,
  rentPerSqmMonthly: 5,
  maintenancePercent: 1.5,
  operationTimePercent: 50,
  electricityCostPerKwh: 0.14,
  hourlySalary: 50,
  variableSalaryHourly: 51,
  extraSalaryPercent: 65,
  administrativeOverheadPercent: 65,
  machineCount: 1,
  usefulHoursPerYear: 3900,
  acquisitionCost: 500000,
  adoptedReplacementCost: 500000,
  physicalSpaceSqm: 9,
  machinePowerKw: 10,
  toolingCostPerYear: 10000,
};

const SHARED: Pick<
  MachineCostInputs,
  | "usefulLifeYears"
  | "inflationRate"
  | "interestRatePercent"
  | "rentPerSqmMonthly"
  | "maintenancePercent"
  | "operationTimePercent"
  | "electricityCostPerKwh"
  | "hourlySalary"
  | "variableSalaryHourly"
  | "extraSalaryPercent"
  | "administrativeOverheadPercent"
  | "machineCount"
  | "usefulHoursPerYear"
> = {
  usefulLifeYears: 10,
  inflationRate: 3.5,
  interestRatePercent: 10,
  rentPerSqmMonthly: 5,
  maintenancePercent: 1.5,
  operationTimePercent: 50,
  electricityCostPerKwh: 0.14,
  hourlySalary: 50,
  variableSalaryHourly: 51,
  extraSalaryPercent: 65,
  administrativeOverheadPercent: 65,
  machineCount: 1,
  usefulHoursPerYear: 3900,
};

type MachineSeedInputs = Omit<MachineCostInputs, keyof typeof SHARED> &
  Partial<Pick<MachineCostInputs, keyof typeof SHARED>>;

function machine(id: string, resourceId: string, label: string, inputs: MachineSeedInputs): MachineTariff {
  return { id, resourceId, label, inputs: { ...SHARED, ...inputs } };
}

/** Dados do item 1 — Hora_custos_máquina.xlsx (atualizado set/2026). */
export const MACHINE_TARIFF_SEED: MachineTariff[] = [
  machine("machine-duramax", "vocab-13", "CMM DuraMax", {
    acquisitionCost: 521787.03,
    adoptedReplacementCost: 550000,
    physicalSpaceSqm: 6,
    machinePowerKw: 12,
    toolingCostPerYear: 14000,
  }),
  machine("machine-oinspect", "vocab-16", "CMM O-INSPECT", {
    acquisitionCost: 1037920.85,
    adoptedReplacementCost: 1100000,
    physicalSpaceSqm: 9,
    machinePowerKw: 15,
    toolingCostPerYear: 14000,
  }),
  machine("machine-prismo", "vocab-5", "CMM PRISMO", {
    acquisitionCost: 2983131.79,
    adoptedReplacementCost: 3300000,
    physicalSpaceSqm: 30,
    machinePowerKw: 20,
    toolingCostPerYear: 14000,
  }),
  machine("machine-contura", "vocab-17", "CMM CONTURA", {
    acquisitionCost: 992420.06,
    adoptedReplacementCost: 1000000,
    physicalSpaceSqm: 15,
    machinePowerKw: 15,
    toolingCostPerYear: 14000,
  }),
  machine("machine-bosello", "vocab-11", "BOSELLO MAX 80", {
    acquisitionCost: 2294127.22,
    adoptedReplacementCost: 2500000,
    physicalSpaceSqm: 20,
    machinePowerKw: 30,
    toolingCostPerYear: 15700,
  }),
  machine("machine-atos", "vocab-10", "ATOS Q 8M", {
    acquisitionCost: 688148.77,
    adoptedReplacementCost: 730000,
    physicalSpaceSqm: 6,
    machinePowerKw: 5,
    toolingCostPerYear: 3000,
  }),
  machine("machine-tscan", "vocab-18", "T-SCAN Hawk 2", {
    acquisitionCost: 370800.74,
    adoptedReplacementCost: 430000,
    physicalSpaceSqm: 6,
    machinePowerKw: 5,
    toolingCostPerYear: 3000,
  }),
  machine("machine-zre", "vocab-19", "ZEISS ZRE", {
    acquisitionCost: 248000,
    usefulLifeYears: 3,
    adoptedReplacementCost: 260000,
    physicalSpaceSqm: 2,
    machinePowerKw: 0.4,
    operationTimePercent: 80,
    toolingCostPerYear: 52000,
    machineCount: 2,
  }),
];
