import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import type { UserRole } from '@/lib/api';

import {
  canUseCaseInKnowledge,
  isDemoFormalizedCase,
} from './formalized-knowledge';
import { getTotalEffortHours } from './record-helpers';
import { collectStageResourceIds, normalizeServiceStage } from './record-stages';

export type ConfidenceLevel = 'none' | 'low' | 'medium' | 'high';

export type HoursRangePosition = 'within' | 'below' | 'above';

export type AssistantRecommendation = {
  level: ConfidenceLevel;

  caseCount: number;

  cases: ServiceRecord[];

  /**
   * Mediana das horas estimadas nos casos históricos comparáveis.
   */
  median: number | null;

  /**
   * Primeiro quartil das horas estimadas.
   */
  q1: number | null;

  /**
   * Terceiro quartil das horas estimadas.
   */
  q3: number | null;

  /**
   * Relação média entre horas realizadas e horas estimadas
   * nos casos históricos comparáveis.
   */
  correctionFactor: number | null;

  /**
   * Mediana estimada ajustada pelo fator de correção (15+ casos).
   */
  suggestedHours: number | null;

  label: string;

  detail: string;
};

export type FindSimilarRecordsOptions = {
  excludeRecordId?: string;
  viewerRole?: UserRole;
};

export function getConfidenceLevel(count: number): ConfidenceLevel {
  if (count === 0) {
    return 'none';
  }

  if (count <= 4) {
    return 'low';
  }

  if (count <= 14) {
    return 'medium';
  }

  return 'high';
}

export function formatConfidenceBadge(recommendation: AssistantRecommendation): string {
  if (recommendation.level === 'none') {
    return recommendation.label;
  }

  const noun =
    recommendation.caseCount === 1 ? 'caso formalizado' : 'casos formalizados';

  return `${recommendation.label} · ${recommendation.caseCount} ${noun}`;
}

export function getRecordResourceIds(record: ServiceRecord): string[] {
  const stageIds = record.stages
    ? collectStageResourceIds(record.stages.map(normalizeServiceStage))
    : [];

  return [...new Set([...record.resourceIds, ...stageIds])];
}

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function quartile(values: number[], q: 0.25 | 0.75): number | null {
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

function matchesKnowledgeCase(
  record: ServiceRecord,
  options: FindSimilarRecordsOptions = {},
): boolean {
  if (record.id === options.excludeRecordId) {
    return false;
  }

  if (!isDemoFormalizedCase(record)) {
    return false;
  }

  if (!canUseCaseInKnowledge(record, options.viewerRole)) {
    return false;
  }

  return true;
}

/**
 * Casos formalizados concluídos do mesmo tipo de serviço, sem filtros de perfil.
 */
export function countServiceFormalizedCases(
  records: ServiceRecord[],
  serviceTypeId: string,
  options: FindSimilarRecordsOptions = {},
): number {
  return records.filter(
    (record) => matchesKnowledgeCase(record, options) && record.serviceTypeId === serviceTypeId,
  ).length;
}

/**
 * Retorna casos que podem ensinar o Assistente.
 *
 * Filtros:
 * - lição formalizada + serviço concluído;
 * - mesmo tipo de serviço;
 * - traits: se informadas, basta uma em comum; senão, ignora;
 * - recursos: se informados, basta um em comum; senão, ignora.
 *
 * Usa a base demo formalizada. O modo de orçamento não filtra os casos.
 */
export function findSimilarRecords(
  records: ServiceRecord[],
  serviceTypeId: string,
  partTraitIds: string[],
  resourceIds: string[] = [],
  options: FindSimilarRecordsOptions = {},
): ServiceRecord[] {
  return records.filter((record) => {
    if (!matchesKnowledgeCase(record, options)) {
      return false;
    }

    if (record.serviceTypeId !== serviceTypeId) {
      return false;
    }

    if (
      partTraitIds.length > 0 &&
      !partTraitIds.some((traitId) => record.partTraitIds.includes(traitId))
    ) {
      return false;
    }

    if (resourceIds.length > 0) {
      const recordResources = getRecordResourceIds(record);
      if (!resourceIds.some((resourceId) => recordResources.includes(resourceId))) {
        return false;
      }
    }

    return true;
  });
}

export function getHoursRangePosition(
  currentHours: number | null,
  q1: number | null,
  q3: number | null,
): HoursRangePosition | null {
  if (currentHours === null || currentHours <= 0 || q1 === null || q3 === null) {
    return null;
  }

  if (currentHours < q1) {
    return 'below';
  }

  if (currentHours > q3) {
    return 'above';
  }

  return 'within';
}

export function needsEstimationOverrideReason(
  currentHours: number | null,
  suggestedHours: number | null,
  level: ConfidenceLevel,
): boolean {
  if (level !== 'medium' && level !== 'high') {
    return false;
  }

  if (!currentHours || !suggestedHours || suggestedHours <= 0) {
    return false;
  }

  return Math.abs(currentHours - suggestedHours) / suggestedHours > 0.15;
}

function calculateCorrectionFactor(cases: ServiceRecord[]): number | null {
  const ratios = cases
    .map((item) => {
      const estimated = getTotalEffortHours(item, 'estimated');
      const actual = getTotalEffortHours(item, 'actual');

      if (estimated === null || actual === null || estimated <= 0 || actual <= 0) {
        return null;
      }

      return actual / estimated;
    })
    .filter((value): value is number => value !== null);

  if (ratios.length === 0) {
    return null;
  }

  return ratios.reduce((sum, value) => sum + value, 0) / ratios.length;
}

export function buildRecommendation(cases: ServiceRecord[]): AssistantRecommendation {
  const level = getConfidenceLevel(cases.length);
  const count = cases.length;

  if (count === 0) {
    return {
      level,
      caseCount: 0,
      cases,
      median: null,
      q1: null,
      q3: null,
      correctionFactor: null,
      suggestedHours: null,
      label: 'Sem histórico comparável',
      detail:
        'Não há casos formalizados para este perfil. Siga o roteiro de premissas do vocabulário.',
    };
  }

  if (count <= 4) {
    return {
      level,
      caseCount: count,
      cases,
      median: null,
      q1: null,
      q3: null,
      correctionFactor: null,
      suggestedHours: null,
      label: 'Confiança baixa',
      detail: 'Poucos casos disponíveis. Revise cada registro antes de usar como referência.',
    };
  }

  const estimatedHours = cases
    .map((item) => getTotalEffortHours(item, 'estimated'))
    .filter((value): value is number => value !== null && value > 0);

  const med = median(estimatedHours);
  const q1 = quartile(estimatedHours, 0.25);
  const q3 = quartile(estimatedHours, 0.75);
  const correctionFactor = count >= 15 ? calculateCorrectionFactor(cases) : null;

  const suggestedHours =
    count >= 15 && med !== null && correctionFactor !== null
      ? Math.round(med * correctionFactor * 10) / 10
      : med !== null
        ? Math.round(med * 10) / 10
        : null;

  const labels: Record<ConfidenceLevel, string> = {
    none: 'Sem histórico comparável',
    low: 'Confiança baixa',
    medium: 'Confiança média',
    high: 'Confiança alta',
  };

  const details: Record<ConfidenceLevel, string> = {
    none: 'Não há casos formalizados para este perfil. Siga o roteiro de premissas do vocabulário.',
    low: 'Poucos casos disponíveis. Revise cada registro antes de usar como referência.',
    medium: 'Faixa provável (mediana e faixa usual) com base nos casos formalizados.',
    high: 'Histórico robusto. Use a faixa, a mediana e o fator de correção como apoio à estimativa.',
  };

  return {
    level,
    caseCount: cases.length,
    cases,
    median: med,
    q1,
    q3,
    correctionFactor,
    suggestedHours,
    label: labels[level],
    detail: details[level],
  };
}
