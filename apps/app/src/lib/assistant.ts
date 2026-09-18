import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import { getComparableHours } from "./record-helpers";

export type ConfidenceLevel = "none" | "low" | "medium" | "high";

export type AssistantRecommendation = {
  level: ConfidenceLevel;
  caseCount: number;
  cases: ServiceRecord[];
  median: number | null;
  q1: number | null;
  q3: number | null;
  correctionFactor: number | null;
  label: string;
  detail: string;
};

export function getConfidenceLevel(count: number): ConfidenceLevel {
  if (count === 0) {
    return "none";
  }
  if (count <= 4) {
    return "low";
  }
  if (count <= 14) {
    return "medium";
  }
  return "high";
}

function median(values: number[]) {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function quartile(values: number[], q: 0.25 | 0.75) {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] === undefined) {
    return sorted[base];
  }
  return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

export function findSimilarRecords(
  records: ServiceRecord[],
  serviceTypeId: string,
  partTraitIds: string[],
) {
  return records.filter((record) => {
    if (!record.isDemo || record.lessonStatus !== "FORMALIZED" || record.serviceStatus !== "COMPLETED") {
      return false;
    }
    if (record.serviceTypeId !== serviceTypeId) {
      return false;
    }
    if (partTraitIds.length === 0) {
      return true;
    }
    return partTraitIds.some((traitId) => record.partTraitIds.includes(traitId));
  });
}

export function buildRecommendation(cases: ServiceRecord[]): AssistantRecommendation {
  const level = getConfidenceLevel(cases.length);
  const actualHours = cases
    .map((item) => getComparableHours(item, "actual"))
    .filter((value): value is number => value !== null);
  const med = median(actualHours);
  const q1 = quartile(actualHours, 0.25);
  const q3 = quartile(actualHours, 0.75);

  let correctionFactor: number | null = null;
  if (cases.length > 0) {
    const ratios = cases
      .map((item) => {
        const estimated = getComparableHours(item, "estimated");
        const actual = getComparableHours(item, "actual");
        if (!estimated || !actual) {
          return null;
        }
        return actual / estimated;
      })
      .filter((value): value is number => value !== null);
    correctionFactor = ratios.length > 0 ? ratios.reduce((sum, value) => sum + value, 0) / ratios.length : null;
  }

  const labels: Record<ConfidenceLevel, string> = {
    none: "Sem histórico comparável",
    low: "Confiança baixa",
    medium: "Confiança média",
    high: "Confiança alta",
  };

  const details: Record<ConfidenceLevel, string> = {
    none: "Não há casos formalizados para este perfil. Siga o roteiro de premissas do vocabulário.",
    low: "Poucos casos disponíveis. Revise cada registro antes de usar como referência.",
    medium: "Faixa provável baseada na mediana e nos quartis dos casos formalizados.",
    high: "Histórico robusto. Use a faixa e o fator de correção como apoio à estimativa.",
  };

  return {
    level,
    caseCount: cases.length,
    cases,
    median: med,
    q1,
    q3,
    correctionFactor,
    label: labels[level],
    detail: details[level],
  };
}
