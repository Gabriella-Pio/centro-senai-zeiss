import type { MachineCostInputs } from "./machine-tariff";

export type MachineInputErrors = Partial<Record<keyof MachineCostInputs, string>>;

const PERCENT_FIELDS: (keyof MachineCostInputs)[] = [
  "inflationRate",
  "interestRatePercent",
  "maintenancePercent",
  "operationTimePercent",
  "extraSalaryPercent",
  "administrativeOverheadPercent",
];

const MONEY_FIELDS: (keyof MachineCostInputs)[] = [
  "acquisitionCost",
  "adoptedReplacementCost",
  "rentPerSqmMonthly",
  "electricityCostPerKwh",
  "toolingCostPerYear",
  "hourlySalary",
  "variableSalaryHourly",
];

export function validateMachineInputs(inputs: MachineCostInputs): MachineInputErrors {
  const errors: MachineInputErrors = {};

  if (inputs.usefulHoursPerYear <= 0) {
    errors.usefulHoursPerYear = "Informe horas úteis maiores que zero.";
  }
  if (inputs.usefulLifeYears < 1) {
    errors.usefulLifeYears = "Vida útil deve ser de pelo menos 1 ano.";
  }
  if (inputs.machineCount < 1) {
    errors.machineCount = "Informe pelo menos 1 máquina.";
  }

  for (const key of PERCENT_FIELDS) {
    const value = inputs[key];
    if (value !== undefined && (value < 0 || value > 100)) {
      errors[key] = "Informe um percentual entre 0 e 100.";
    }
  }

  for (const key of MONEY_FIELDS) {
    const value = inputs[key];
    if (value !== undefined && value < 0) {
      errors[key] = "Informe um valor maior ou igual a zero.";
    }
  }

  if (inputs.physicalSpaceSqm < 0) errors.physicalSpaceSqm = "Informe um valor maior ou igual a zero.";
  if (inputs.machinePowerKw < 0) errors.machinePowerKw = "Informe um valor maior ou igual a zero.";

  return errors;
}

export function hasValidationErrors(errors: MachineInputErrors) {
  return Object.keys(errors).length > 0;
}

export function tabsWithErrors(errors: MachineInputErrors) {
  const tabs = new Set<string>();
  const acquisition: (keyof MachineCostInputs)[] = [
    "acquisitionCost",
    "usefulLifeYears",
    "inflationRate",
    "adoptedReplacementCost",
    "interestRatePercent",
  ];
  const installation: (keyof MachineCostInputs)[] = [
    "physicalSpaceSqm",
    "rentPerSqmMonthly",
    "maintenancePercent",
  ];
  const operation: (keyof MachineCostInputs)[] = [
    "machinePowerKw",
    "operationTimePercent",
    "electricityCostPerKwh",
    "toolingCostPerYear",
  ];
  const labor: (keyof MachineCostInputs)[] = [
    "hourlySalary",
    "variableSalaryHourly",
    "extraSalaryPercent",
    "administrativeOverheadPercent",
    "machineCount",
    "usefulHoursPerYear",
  ];

  for (const key of Object.keys(errors) as (keyof MachineCostInputs)[]) {
    if (acquisition.includes(key)) tabs.add("acquisition");
    if (installation.includes(key)) tabs.add("installation");
    if (operation.includes(key)) tabs.add("operation");
    if (labor.includes(key)) tabs.add("labor");
  }

  return tabs;
}
