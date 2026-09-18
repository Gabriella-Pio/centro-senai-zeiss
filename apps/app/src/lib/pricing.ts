import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import type { LabSettings } from "./demo-store-types";

export type CostLine = {
  id: string;
  label: string;
  hours: number;
  rate: number;
  subtotal: number;
};

export type QuoteCostBreakdown = {
  lines: CostLine[];
  totalCost: number;
  suggestedPrice: number;
  marginPercent: number;
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

  const totalCost = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const margin = labSettings.targetMarginPercent;
  const suggestedPrice = totalCost > 0 ? Math.round(totalCost / (1 - margin / 100)) : 0;

  if (totalCost > 0) {
    explanations.push(`Margem alvo de ${margin}% → preço sugerido ${formatCurrency(suggestedPrice)}`);
  }

  explanations.unshift(`Tarifas: ${labSettings.tariffTableLabel}`);

  return {
    lines,
    totalCost: Math.round(totalCost),
    suggestedPrice,
    marginPercent: margin,
    explanations,
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
  if (record.quoteSnapshot?.breakdown) {
    return record.quoteSnapshot.breakdown;
  }
  return computeQuoteCost({
    vocabulary,
    resourceIds: record.resourceIds,
    teamHours: record.estimatedHours ?? 0,
    equipmentHours: record.estimatedEquipmentHours ?? (record.estimatedHours ? record.estimatedHours * 0.6 : 0),
    labSettings,
  });
}

export function computeRealizedMargin(record: ServiceRecord) {
  const cost = record.actualCost ?? record.estimatedCost;
  const price = record.billedValue ?? record.proposedValue;
  return computeMarginPercent(cost, price);
}
