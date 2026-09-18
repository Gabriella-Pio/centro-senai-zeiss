import type { MachineCostInputs } from "./machine-tariff";

export type FieldHelpContent = {
  hint: string;
  formula?: string;
};

export const INPUT_FIELD_HELP: Partial<Record<keyof MachineCostInputs, FieldHelpContent>> = {
  acquisitionCost: {
    hint: "Valor pago na aquisição do equipamento, incluindo acessórios essenciais.",
  },
  usefulLifeYears: {
    hint: "Vida útil contábil usada para depreciar o investimento.",
  },
  inflationRate: {
    hint: "Taxa anual de inflação para estimar o custo de reposição teórico.",
    formula: "Reposição teórica = aquisição × (1 + inflação)^anos",
  },
  adoptedReplacementCost: {
    hint: "Valor de reposição usado nos cálculos — pode ser diferente do teórico por decisão gerencial.",
  },
  interestRatePercent: {
    hint: "Custo de oportunidade do capital investido na máquina (planilha usa o valor numérico direto, ex.: 10).",
    formula: "Juros/ano = reposição adotada × taxa ÷ horas úteis/ano",
  },
  physicalSpaceSqm: {
    hint: "Área ocupada pela máquina no laboratório (m²).",
  },
  rentPerSqmMonthly: {
    hint: "Custo mensal do metro quadrado alocado à máquina.",
    formula: "Espaço/ano = m² × aluguel/m² × 12",
  },
  maintenancePercent: {
    hint: "Percentual do custo de reposição adotado reservado para manutenção anual.",
    formula: "Manutenção/ano = reposição adotada × % ÷ 100",
  },
  machinePowerKw: {
    hint: "Potência elétrica nominal do equipamento em kW.",
  },
  operationTimePercent: {
    hint: "Percentual do tempo em que a máquina consome energia durante a operação.",
  },
  electricityCostPerKwh: {
    hint: "Custo da energia elétrica por kWh.",
    formula: "Energia/h = kW × (% operação ÷ 100) × R$/kWh",
  },
  toolingCostPerYear: {
    hint: "Custo anual de ferramental, consumíveis e calibração alocável à máquina.",
    formula: "Ferramental/h = custo anual ÷ horas úteis",
  },
  hourlySalary: {
    hint: "Salário hora médio dos turnos que operam o equipamento (item 14 da planilha).",
  },
  variableSalaryHourly: {
    hint: "Salário hora usado nos custos variáveis — pode incluir ajustes da planilha de custos de RH.",
    formula: "Salário/h = valor ÷ total de máquinas",
  },
  extraSalaryPercent: {
    hint: "Encargos e benefícios sobre o salário (FGTS, férias, etc.).",
    formula: "Encargos/h = salário/h × % ÷ 100",
  },
  administrativeOverheadPercent: {
    hint: "Overhead administrativo aplicado sobre o custo hora com mão de obra (item 32).",
    formula: "Item 32 = item 31 × (1 + % ÷ 100)",
  },
  machineCount: {
    hint: "Quantidade de máquinas iguais compartilhando o mesmo custo de salário.",
  },
  usefulHoursPerYear: {
    hint: "Horas disponíveis por ano para rateio dos custos fixos e variáveis.",
    formula: "Custo fixo/h = custo fixo/ano ÷ horas úteis",
  },
};

export type ComputedRowDef = {
  id: string;
  label: string;
  hint: string;
  formula: string;
  emphasize?: boolean;
  hourly?: boolean;
};

export const FIXED_COST_ROWS: ComputedRowDef[] = [
  {
    id: "depreciation",
    label: "Depreciação/ano",
    hint: "Perda de valor anual do investimento na máquina.",
    formula: "Reposição adotada ÷ vida útil",
  },
  {
    id: "interest",
    label: "Juros/ano",
    hint: "Custo financeiro do capital parado no equipamento.",
    formula: "Reposição adotada × taxa de juros ÷ horas úteis/ano",
  },
  {
    id: "space",
    label: "Espaço físico/ano",
    hint: "Custo anual do espaço ocupado no laboratório.",
    formula: "m² × aluguel/m² × 12 meses",
  },
  {
    id: "maintenance",
    label: "Manutenção/ano",
    hint: "Provisão anual para manutenção preventiva e corretiva.",
    formula: "Reposição adotada × % manutenção ÷ 100",
  },
  {
    id: "fixedAnnual",
    label: "Custo fixo/ano",
    hint: "Soma de todos os custos fixos anuais.",
    formula: "Depreciação + juros + espaço + manutenção",
    emphasize: true,
  },
  {
    id: "fixedHourly",
    label: "Custo fixo/hora",
    hint: "Rateio do custo fixo anual por hora disponível.",
    formula: "Custo fixo/ano ÷ horas úteis/ano",
    emphasize: true,
    hourly: true,
  },
];

export const VARIABLE_COST_ROWS: ComputedRowDef[] = [
  {
    id: "energy",
    label: "Energia/hora",
    hint: "Consumo elétrico durante o tempo de operação.",
    formula: "kW × (% operação ÷ 100) × R$/kWh",
    hourly: true,
  },
  {
    id: "tooling",
    label: "Ferramental/hora",
    hint: "Rateio horário de consumíveis e calibração.",
    formula: "Ferramental/ano ÷ horas úteis",
    hourly: true,
  },
  {
    id: "salary",
    label: "Salário/hora",
    hint: "Custo hora do operador alocado à máquina.",
    formula: "Salário variável ÷ total de máquinas",
    hourly: true,
  },
  {
    id: "extraSalary",
    label: "Encargos salariais/hora",
    hint: "Encargos e benefícios sobre o salário hora.",
    formula: "Salário/h × % encargos ÷ 100",
    hourly: true,
  },
  {
    id: "variableWithout",
    label: "Variáveis sem salário/h",
    hint: "Energia e ferramental — variam com o uso, sem mão de obra.",
    formula: "Energia/h + ferramental/h",
    hourly: true,
  },
  {
    id: "variableWith",
    label: "Variáveis com salário/h",
    hint: "Todos os custos que variam com cada hora trabalhada.",
    formula: "Salário/h + encargos/h + variáveis sem salário",
    emphasize: true,
    hourly: true,
  },
];

export const FINAL_COST_ROWS: ComputedRowDef[] = [
  {
    id: "withoutLabor",
    label: "30. Sem mão de obra",
    hint: "Custo hora da máquina sem salários — apenas fixo + energia/ferramental.",
    formula: "Custo fixo/h + variáveis sem salário/h",
    hourly: true,
  },
  {
    id: "withLabor",
    label: "31. Com mão de obra",
    hint: "Custo operacional completo no chão de fábrica.",
    formula: "Custo fixo/h + variáveis com salário/h",
    hourly: true,
  },
  {
    id: "withAdmin",
    label: "32. Com administrativo",
    hint: "Tarifa usada nos orçamentos — inclui overhead administrativo.",
    formula: "Item 31 × (1 + overhead administrativo ÷ 100)",
    emphasize: true,
    hourly: true,
  },
];
