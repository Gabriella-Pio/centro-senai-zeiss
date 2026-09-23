import type { MachineCostInputs, MachineTariff } from '../../machine-tariff';

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
  physicalSpaceSqm: 10,
  machinePowerKw: 10,
  toolingCostPerYear: 10000,
};

const SHARED: Pick<
  MachineCostInputs,
  | 'usefulLifeYears'
  | 'inflationRate'
  | 'interestRatePercent'
  | 'rentPerSqmMonthly'
  | 'maintenancePercent'
  | 'operationTimePercent'
  | 'electricityCostPerKwh'
  | 'hourlySalary'
  | 'variableSalaryHourly'
  | 'extraSalaryPercent'
  | 'administrativeOverheadPercent'
  | 'machineCount'
  | 'usefulHoursPerYear'
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

function machine(
  id: string,
  resourceId: string,
  label: string,
  inputs: MachineSeedInputs,
): MachineTariff {
  return {
    id,
    resourceId,
    label,
    inputs: { ...SHARED, ...inputs },
  };
}

/**
 * Dados fictícios para demonstração.
 * Os valores não representam equipamentos ou custos reais.
 */
export const MACHINE_TARIFF_SEED: MachineTariff[] = [
  machine('machine-demo-cmm-01', 'vocab-demo-01', 'CMM DEMO 01', {
    acquisitionCost: 1200000,
    adoptedReplacementCost: 1350000,
    physicalSpaceSqm: 25,
    machinePowerKw: 18,
    toolingCostPerYear: 12000,
  }),
  machine('machine-demo-scanner-01', 'vocab-demo-02', 'SCANNER 3D DEMO', {
    acquisitionCost: 350000,
    adoptedReplacementCost: 400000,
    physicalSpaceSqm: 8,
    machinePowerKw: 5,
    toolingCostPerYear: 3500,
  }),
  machine('machine-demo-cmm-02', 'vocab-demo-03', 'CMM DEMO 02', {
    acquisitionCost: 850000,
    adoptedReplacementCost: 950000,
    physicalSpaceSqm: 15,
    machinePowerKw: 12,
    toolingCostPerYear: 9000,
  }),
  machine('machine-demo-scanner-02', 'vocab-demo-04', 'SCANNER ÓPTICO DEMO', {
    acquisitionCost: 480000,
    adoptedReplacementCost: 520000,
    physicalSpaceSqm: 7,
    machinePowerKw: 6,
    toolingCostPerYear: 4000,
  }),
  machine('machine-demo-cmm-03', 'vocab-demo-05', 'CMM COMPACTA DEMO', {
    acquisitionCost: 620000,
    adoptedReplacementCost: 700000,
    physicalSpaceSqm: 12,
    machinePowerKw: 10,
    toolingCostPerYear: 7500,
  }),
  machine('machine-demo-scan-03', 'vocab-demo-06', 'SISTEMA DE SCAN DEMO', {
    acquisitionCost: 290000,
    adoptedReplacementCost: 330000,
    physicalSpaceSqm: 6,
    machinePowerKw: 4,
    toolingCostPerYear: 2500,
  }),
];