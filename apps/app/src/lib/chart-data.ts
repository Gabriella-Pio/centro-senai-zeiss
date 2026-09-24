import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import { isDemoFormalizedCase } from "./formalized-knowledge";
import type { LabSettings } from "./demo-store-types";
import { getComparableHours, getRecordChartLabel } from "./record-helpers";
import { computeRealizedMargin } from "./pricing";

const TOLERANCE = 0.15;

export type TrendPoint = { label: string; estimated: number; actual: number };

export type ScatterPoint = {
  id: string;
  label: string;
  estimated: number;
  actual: number;
  withinTolerance: boolean;
};

export type ParetoItem = { label: string; count: number; percent: number };

export type DonutSlice = { label: string; value: number; color: string; id?: string };

export const MARGIN_DONUT_SLICE_ABOVE = "Acima da meta";

export function countMarginDonutAboveTarget(slices: DonutSlice[]): number {
  return slices.find((slice) => slice.label === MARGIN_DONUT_SLICE_ABOVE)?.value ?? 0;
}

export type WaterfallStep = { label: string; value: number; color: string };

export type CaseBar = {
  id: string;
  label: string;
  estimated: number;
  actual: number;
};

function formalizedRecords(records: ServiceRecord[]) {
  return records.filter(isDemoFormalizedCase);
}

function monthKey(iso: string) {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date);
}

export function buildEffortTrend(records: ServiceRecord[]): TrendPoint[] {
  const formalized = formalizedRecords(records).filter(
    (record) => record.estimatedHours && record.actualHours,
  );
  const buckets = new Map<string, { estimated: number[]; actual: number[] }>();

  formalized.forEach((record) => {
    const key = monthKey(record.createdAt);
    const bucket = buckets.get(key) ?? { estimated: [], actual: [] };
    bucket.estimated.push(record.estimatedHours!);
    bucket.actual.push(record.actualHours!);
    buckets.set(key, bucket);
  });

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, bucket]) => ({
      label: monthLabel(key),
      estimated: Math.round(bucket.estimated.reduce((s, v) => s + v, 0) / bucket.estimated.length),
      actual: Math.round(bucket.actual.reduce((s, v) => s + v, 0) / bucket.actual.length),
    }));
}

export function buildScatterData(records: ServiceRecord[]): ScatterPoint[] {
  return formalizedRecords(records)
    .filter((record) => record.estimatedHours && record.actualHours)
    .map((record) => {
      const estimated = getComparableHours(record, "estimated") ?? record.estimatedHours!;
      const actual = getComparableHours(record, "actual") ?? record.actualHours!;
      const deviation = Math.abs(actual - estimated) / estimated;
      return {
        id: record.id,
        label: getRecordChartLabel(record),
        estimated,
        actual,
        withinTolerance: deviation <= TOLERANCE,
      };
    });
}

export function buildParetoCauses(records: ServiceRecord[], vocabulary: VocabularyTerm[]): ParetoItem[] {
  const formalized = formalizedRecords(records);
  const counts = new Map<string, number>();
  formalized.forEach((record) => {
    if (!record.deviationCauseId) return;
    counts.set(record.deviationCauseId, (counts.get(record.deviationCauseId) ?? 0) + 1);
  });
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  if (total === 0) return [];

  return [...counts.entries()]
    .map(([id, count]) => ({
      label: vocabulary.find((term) => term.id === id)?.label ?? id,
      count,
      percent: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function buildMarginDonut(records: ServiceRecord[], labSettings: LabSettings): DonutSlice[] {
  const formalized = formalizedRecords(records);
  let above = 0;
  let mid = 0;
  let below = 0;

  formalized.forEach((record) => {
    const margin = computeRealizedMargin(record);
    if (margin === null) return;
    if (margin >= labSettings.targetMarginPercent) above += 1;
    else if (margin >= labSettings.targetMarginPercent - 10) mid += 1;
    else below += 1;
  });

  if (above + mid + below === 0) return [];

  return [
    { label: MARGIN_DONUT_SLICE_ABOVE, value: above, color: "#16a34a" },
    { label: "Próximo da meta", value: mid, color: "#d97706" },
    { label: "Abaixo da meta", value: below, color: "#dc2626" },
  ];
}

export function buildConfidenceDonut(records: ServiceRecord[], vocabulary: VocabularyTerm[]): DonutSlice[] {
  const serviceTypes = vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active);
  let high = 0;
  let medium = 0;
  let low = 0;

  serviceTypes.forEach((type) => {
    const count = formalizedRecords(records).filter((record) => record.serviceTypeId === type.id).length;
    if (count >= 15) high += 1;
    else if (count >= 5) medium += 1;
    else low += 1;
  });

  if (high + medium + low === 0) return [];

  return [
    { label: "Alta", value: high, color: "#0057b8" },
    { label: "Média", value: medium, color: "#d97706" },
    { label: "Baixa / sem histórico", value: low, color: "#94a3b8" },
  ];
}

export function buildCaseComparison(cases: ServiceRecord[]): CaseBar[] {
  return cases.slice(0, 8).map((record) => ({
    id: record.id,
    label: getRecordChartLabel(record),
    estimated: getComparableHours(record, "estimated") ?? record.estimatedHours ?? 0,
    actual: getComparableHours(record, "actual") ?? record.actualHours ?? 0,
  }));
}

export function buildCostDonut(
  lines: { id: string; label: string; resourceLabel?: string; subtotal: number }[],
): DonutSlice[] {
  const palette = ["#0057b8", "#e87722", "#16a34a", "#7c3aed", "#0891b2", "#d97706"];
  return lines
    .filter((line) => line.subtotal > 0)
    .map((line, index) => ({
      id: line.id,
      label: line.resourceLabel ?? line.label,
      value: line.subtotal,
      color: palette[index % palette.length],
    }));
}

export type RecordFinancialSummary = {
  quotedPrice: number | null;
  actualCost: number | null;
  billedValue: number | null;
  profit: number | null;
  marginPercent: number | null;
  costVariance: number | null;
  hoursQuoted: number | null;
  hoursActual: number | null;
};

export function buildRecordFinancialSummary(record: ServiceRecord): RecordFinancialSummary {
  const quotedPrice = record.proposedValue ?? record.estimatedCost ?? null;
  const actualCost = record.actualCost ?? null;
  const billedValue = record.billedValue ?? record.proposedValue ?? null;
  const profit =
    billedValue !== null && actualCost !== null ? billedValue - actualCost : null;
  const marginPercent = computeRealizedMargin(record);
  const costVariance =
    quotedPrice !== null && actualCost !== null ? actualCost - quotedPrice : null;
  const hoursQuoted = record.estimatedHours ?? null;
  const hoursActual = record.actualHours ?? null;

  return {
    quotedPrice,
    actualCost,
    billedValue,
    profit,
    marginPercent,
    costVariance,
    hoursQuoted,
    hoursActual,
  };
}

export function buildRecordFinancialBars(summary: RecordFinancialSummary): DonutSlice[] {
  const palette = ["#397bc8", "#e08a16", "#16a34a"];
  const items: Array<{ label: string; value: number }> = [];

  if (summary.quotedPrice && summary.quotedPrice > 0) {
    items.push({ label: "Orçado", value: summary.quotedPrice });
  }
  if (summary.actualCost && summary.actualCost > 0) {
    items.push({ label: "Custo real", value: summary.actualCost });
  }
  if (summary.billedValue && summary.billedValue > 0) {
    items.push({ label: "Faturado", value: summary.billedValue });
  }

  return items.map((item, index) => ({
    label: item.label,
    value: item.value,
    color: palette[index % palette.length],
  }));
}

export function computeAssertivenessRate(records: ServiceRecord[]) {
  const formalized = formalizedRecords(records).filter(
    (record) => record.estimatedHours && record.actualHours && record.estimatedHours > 0,
  );
  if (formalized.length === 0) return 0;
  const within = formalized.filter((record) => {
    const estimated = getComparableHours(record, "estimated") ?? record.estimatedHours!;
    const actual = getComparableHours(record, "actual") ?? record.actualHours!;
    const deviation = Math.abs(actual - estimated) / estimated;
    return deviation <= TOLERANCE;
  });
  return Math.round((within.length / formalized.length) * 100);
}
