export type MachineCostInputs = {
  acquisitionCost: number;
  usefulLifeYears: number;
  inflationRate: number;
  adoptedReplacementCost: number;
  interestRatePercent: number;
  physicalSpaceSqm: number;
  rentPerSqmMonthly: number;
  maintenancePercent: number;
  machinePowerKw: number;
  operationTimePercent: number;
  electricityCostPerKwh: number;
  toolingCostPerYear: number;
  hourlySalary: number;
  /** Salário usado nos custos variáveis (item 26) — pode vir da planilha de custos de RH. */
  variableSalaryHourly?: number;
  extraSalaryPercent: number;
  administrativeOverheadPercent: number;
  machineCount: number;
  usefulHoursPerYear: number;
};

export type MachineCostComputed = {
  theoreticalReplacementCost: number;
  depreciationAnnual: number;
  interestAnnual: number;
  spaceAnnual: number;
  maintenanceAnnual: number;
  fixedCostAnnual: number;
  fixedCostHourly: number;
  energyHourly: number;
  toolingHourly: number;
  salaryHourly: number;
  extraSalaryHourly: number;
  variableWithoutSalary: number;
  variableWithSalary: number;
  costWithoutLabor: number;
  costWithLabor: number;
  costWithAdministrative: number;
};

export type MachineTariff = {
  id: string;
  resourceId: string;
  label: string;
  inputs: MachineCostInputs;
};

export function createMachineTariff(input: {
  id: string;
  resourceId: string;
  label: string;
  inputs: MachineCostInputs;
}): MachineTariff {
  return {
    id: input.id,
    resourceId: input.resourceId,
    label: input.label,
    inputs: input.inputs,
  };
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function computeTheoreticalReplacementCost(inputs: MachineCostInputs) {
  return round2(
    inputs.acquisitionCost * Math.pow(1 + inputs.inflationRate / 100, inputs.usefulLifeYears),
  );
}

export function computeMachineCost(inputs: MachineCostInputs): MachineCostComputed {
  const {
    adoptedReplacementCost,
    usefulLifeYears,
    interestRatePercent,
    physicalSpaceSqm,
    rentPerSqmMonthly,
    maintenancePercent,
    machinePowerKw,
    operationTimePercent,
    electricityCostPerKwh,
    toolingCostPerYear,
    hourlySalary,
    variableSalaryHourly,
    extraSalaryPercent,
    administrativeOverheadPercent,
    machineCount,
    usefulHoursPerYear,
  } = inputs;

  const depreciationAnnual = adoptedReplacementCost / usefulLifeYears;
  const interestAnnual = (adoptedReplacementCost * interestRatePercent) / usefulHoursPerYear;
  const spaceAnnual = physicalSpaceSqm * rentPerSqmMonthly * 12;
  const maintenanceAnnual = adoptedReplacementCost * maintenancePercent / 100;
  const fixedCostAnnual = depreciationAnnual + interestAnnual + spaceAnnual + maintenanceAnnual;
  const fixedCostHourly = fixedCostAnnual / usefulHoursPerYear;

  const energyHourly =
    machinePowerKw * (operationTimePercent / 100) * electricityCostPerKwh;
  const toolingHourly = toolingCostPerYear / usefulHoursPerYear;
  const salaryHourly = (variableSalaryHourly ?? hourlySalary) / machineCount;
  const extraSalaryHourly = salaryHourly * extraSalaryPercent / 100;
  const variableWithoutSalary = energyHourly + toolingHourly;
  const variableWithSalary = salaryHourly + extraSalaryHourly + variableWithoutSalary;
  const costWithoutLabor = fixedCostHourly + variableWithoutSalary;
  const costWithLabor = fixedCostHourly + variableWithSalary;
  const costWithAdministrative =
    costWithLabor * (1 + administrativeOverheadPercent / 100);

  return {
    theoreticalReplacementCost: computeTheoreticalReplacementCost(inputs),
    depreciationAnnual: round2(depreciationAnnual),
    interestAnnual: round2(interestAnnual),
    spaceAnnual: round2(spaceAnnual),
    maintenanceAnnual: round2(maintenanceAnnual),
    fixedCostAnnual: round2(fixedCostAnnual),
    fixedCostHourly: round2(fixedCostHourly),
    energyHourly: round2(energyHourly),
    toolingHourly: round2(toolingHourly),
    salaryHourly: round2(salaryHourly),
    extraSalaryHourly: round2(extraSalaryHourly),
    variableWithoutSalary: round2(variableWithoutSalary),
    variableWithSalary: round2(variableWithSalary),
    costWithoutLabor: round2(costWithoutLabor),
    costWithLabor: round2(costWithLabor),
    costWithAdministrative: round2(costWithAdministrative),
  };
}

/** Tarifa hora usada nos orçamentos — item 32 da planilha (com administrativo). */
export function getMachineHourlyRate(tariff: MachineTariff) {
  return computeMachineCost(tariff.inputs).costWithAdministrative;
}

export function applyMachineTariffsToVocabulary<T extends { id: string; class: string; hourlyRate?: number }>(
  vocabulary: T[],
  tariffs: MachineTariff[],
): T[] {
  const rateByResource = new Map(
    tariffs.map((tariff) => [tariff.resourceId, getMachineHourlyRate(tariff)]),
  );
  return vocabulary.map((term) =>
    term.class === "RESOURCE" && rateByResource.has(term.id)
      ? { ...term, hourlyRate: round2(rateByResource.get(term.id)!) }
      : term,
  );
}
