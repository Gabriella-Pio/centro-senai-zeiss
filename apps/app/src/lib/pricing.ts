import type { ServiceRecord, ServiceStage } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import { getStageResourceId } from "@/lib/record-stages";
import type { LabSettings } from "./demo-store-types";

export type CostLine = {
  id: string;
  label: string;
  serviceLabel?: string;
  resourceLabel?: string;
  hours: number;
  rate: number;
  subtotal: number;
};

export type StageHoursField = "estimatedHours" | "actualHours";

export type QuoteCostBreakdown = {
  lines: CostLine[];
  totalCost: number;
  suggestedPrice: number;
  marginPercent: number;
  /** Tarifa hora-máquina (item 32) já é preço — sem margem adicional. */
  tariffAsPrice?: boolean;
  /** Preço de uma peça (antes de multiplicar pelo lote). */
  unitPrice?: number;
  quantity?: number;
  explanations: string[];
};

export type PriceHistoryStats = {
  count: number;
  median: number | null;
  q1: number | null;
  q3: number | null;
  min: number | null;
  max: number | null;
};

export type QuoteSnapshot = {
  savedAt: string;
  tariffTableLabel: string;
  teamHourlyRate: number;
  targetMarginPercent: number;
  resourceRates: Record<string, number>;
  breakdown: QuoteCostBreakdown;
};

function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function quartile(values: number[], q: 0.25 | 0.75) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] === undefined) return sorted[base];
  return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

export function computeQuoteCost(input: {
  vocabulary: VocabularyTerm[];
  resourceIds: string[];
  teamHours: number;
  equipmentHours: number;
  labSettings: LabSettings;
  resourceRates?: Record<string, number>;
  teamHourlyRate?: number;
}): QuoteCostBreakdown {
  const { vocabulary, resourceIds, teamHours, equipmentHours, labSettings, resourceRates, teamHourlyRate } = input;
  const effectiveTeamRate = teamHourlyRate ?? labSettings.teamHourlyRate;
  const lines: CostLine[] = [];
  const explanations: string[] = [];

  if (teamHours > 0) {
    lines.push({
      id: "team",
      label: "Mão de obra técnica",
      hours: teamHours,
      rate: effectiveTeamRate,
      subtotal: teamHours * effectiveTeamRate,
    });
    explanations.push(`${teamHours} h de equipe × ${formatCurrency(effectiveTeamRate)}/h`);
  }

  const resources = resourceIds
    .map((id) => vocabulary.find((term) => term.id === id && term.class === "RESOURCE"))
    .filter((term): term is VocabularyTerm => Boolean(term));

  if (equipmentHours > 0 && resources.length > 0) {
    const hoursPerResource = equipmentHours / resources.length;
    resources.forEach((resource) => {
      const rate = resourceRates?.[resource.id] ?? resource.hourlyRate ?? 0;
      if (rate <= 0) return;
      lines.push({
        id: resource.id,
        label: resource.label,
        hours: hoursPerResource,
        rate,
        subtotal: hoursPerResource * rate,
      });
      explanations.push(
        `${hoursPerResource.toFixed(1)} h em ${resource.label} × ${formatCurrency(rate)}/h`,
      );
    });
  }

  const tariffTotal = lines
    .filter((line) => line.id !== "team")
    .reduce((sum, line) => sum + line.subtotal, 0);
  const teamTotal = lines.find((line) => line.id === "team")?.subtotal ?? 0;
  const margin = labSettings.targetMarginPercent;
  const teamPrice = teamTotal > 0 ? teamTotal / (1 - margin / 100) : 0;
  const suggestedPrice = Math.round(tariffTotal + teamPrice);
  const totalCost = Math.round(tariffTotal + teamTotal);
  const tariffAsPrice = tariffTotal > 0;

  if (tariffTotal > 0) {
    explanations.push("Tarifa hora-máquina (item 32) tratada como preço — sem margem adicional.");
  }
  if (teamTotal > 0) {
    explanations.push(`Mão de obra com margem alvo de ${margin}% → ${formatCurrency(Math.round(teamPrice))}`);
  }

  explanations.unshift(`Tarifas: ${labSettings.tariffTableLabel}`);

  return {
    lines,
    totalCost,
    suggestedPrice,
    marginPercent: teamTotal > 0 ? margin : 0,
    tariffAsPrice,
    explanations,
  };
}

export function computeStageQuoteCost(input: {
  vocabulary: VocabularyTerm[];
  stages: ServiceStage[];
  labSettings: LabSettings;
  resourceRates?: Record<string, number>;
  hoursField?: StageHoursField;
  quantity?: number;
}): QuoteCostBreakdown {
  const {
    vocabulary,
    stages,
    labSettings,
    resourceRates,
    hoursField = "estimatedHours",
    quantity = 1,
  } = input;
  const lines: CostLine[] = [];
  const explanations: string[] = [];
  const effectiveQuantity = Math.max(1, quantity);

  stages.forEach((stage) => {
    const resourceId = getStageResourceId(stage);
    const hours = stage[hoursField];
    if (!resourceId || !hours || hours <= 0) {
      return;
    }
    const resource = vocabulary.find((term) => term.id === resourceId && term.class === "RESOURCE");
    const rate = resourceRates?.[resourceId] ?? resource?.hourlyRate ?? 0;
    if (!resource || rate <= 0) {
      return;
    }
    lines.push({
      id: stage.id,
      label: `${stage.label} · ${resource.label}`,
      serviceLabel: stage.label,
      resourceLabel: resource.label,
      hours,
      rate,
      subtotal: hours * rate,
    });
    explanations.push(
      `${hours} h · ${stage.label} em ${resource.label} × ${formatCurrency(rate)}/h`,
    );
  });

  const unitPrice = Math.round(lines.reduce((sum, line) => sum + line.subtotal, 0));
  const suggestedPrice = Math.round(unitPrice * effectiveQuantity);
  const isBatch = effectiveQuantity > 1;
  const isActual = hoursField === "actualHours";

  if (unitPrice > 0) {
    explanations.push(
      isActual
        ? "Custo real por etapa com tarifa item 32."
        : "Tarifa item 32 por etapa — já inclui mão de obra, encargos e overhead administrativo.",
    );
    if (isBatch) {
      explanations.push(
        `Horas informadas por peça · lote de ${effectiveQuantity} peças.`,
      );
    }
  }

  explanations.unshift(`Tarifas: ${labSettings.tariffTableLabel}`);

  return {
    lines,
    totalCost: suggestedPrice,
    suggestedPrice,
    unitPrice,
    quantity: isBatch ? effectiveQuantity : undefined,
    marginPercent: 0,
    tariffAsPrice: true,
    explanations,
  };
}

export function buildStageQuoteSnapshot(input: {
  vocabulary: VocabularyTerm[];
  stages: ServiceStage[];
  labSettings: LabSettings;
}): QuoteSnapshot {
  const breakdown = computeStageQuoteCost(input);
  const resourceRates: Record<string, number> = {};
  input.stages.forEach((stage) => {
    const resourceId = getStageResourceId(stage);
    if (!resourceId) {
      return;
    }
    const term = input.vocabulary.find((item) => item.id === resourceId);
    if (term?.hourlyRate) {
      resourceRates[resourceId] = term.hourlyRate;
    }
  });
  return {
    savedAt: new Date().toISOString(),
    tariffTableLabel: input.labSettings.tariffTableLabel,
    teamHourlyRate: input.labSettings.teamHourlyRate,
    targetMarginPercent: 0,
    resourceRates,
    breakdown,
  };
}

export function buildPriceHistory(cases: ServiceRecord[]): PriceHistoryStats {
  const prices = cases
    .map((record) => {
      if (!record.proposedValue || record.proposedValue <= 0) {
        return null;
      }
      const quantity = record.quantity ?? 1;
      return quantity > 1 ? record.proposedValue / quantity : record.proposedValue;
    })
    .filter((value): value is number => value !== null);

  return {
    count: prices.length,
    median: median(prices),
    q1: quartile(prices, 0.25),
    q3: quartile(prices, 0.75),
    min: prices.length > 0 ? Math.min(...prices) : null,
    max: prices.length > 0 ? Math.max(...prices) : null,
  };
}

export function computeMarginPercent(cost: number | null, price: number | null) {
  if (!cost || !price || price <= 0) return null;
  return Math.round(((price - cost) / price) * 100);
}

export function buildQuoteSnapshot(input: {
  vocabulary: VocabularyTerm[];
  resourceIds: string[];
  teamHours: number;
  equipmentHours: number;
  labSettings: LabSettings;
}): QuoteSnapshot {
  const breakdown = computeQuoteCost(input);
  const resourceRates: Record<string, number> = {};
  input.resourceIds.forEach((id) => {
    const term = input.vocabulary.find((item) => item.id === id);
    if (term?.hourlyRate) {
      resourceRates[id] = term.hourlyRate;
    }
  });
  return {
    savedAt: new Date().toISOString(),
    tariffTableLabel: input.labSettings.tariffTableLabel,
    teamHourlyRate: input.labSettings.teamHourlyRate,
    targetMarginPercent: input.labSettings.targetMarginPercent,
    resourceRates,
    breakdown,
  };
}

export function resolveQuoteBreakdown(
  record: ServiceRecord,
  vocabulary: VocabularyTerm[],
  labSettings: LabSettings,
): QuoteCostBreakdown {
  if (record.stages && record.stages.length > 0) {
    return computeStageQuoteCost({
      vocabulary,
      stages: record.stages,
      labSettings,
      quantity: record.quantity ?? 1,
      resourceRates: record.quoteSnapshot?.resourceRates,
    });
  }
  if (record.quoteSnapshot?.breakdown) {
    return record.quoteSnapshot.breakdown;
  }
  return computeQuoteCost({
    vocabulary,
    resourceIds: record.resourceIds,
    teamHours: 0,
    equipmentHours: record.estimatedHours ?? 0,
    labSettings,
    resourceRates: record.quoteSnapshot?.resourceRates,
  });
}

export function computeRealizedMargin(record: ServiceRecord) {
  const cost = record.actualCost ?? record.estimatedCost;
  const price = record.billedValue ?? record.proposedValue;
  return computeMarginPercent(cost, price);
}
