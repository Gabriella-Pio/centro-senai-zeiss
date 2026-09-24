import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import {
  buildRecommendation,
  countServiceFormalizedCases,
  findSimilarRecords,
  formatConfidenceBadge,
  getHoursRangePosition,
  needsEstimationOverrideReason,
} from '@/lib/assistant';

function makeCase(
  id: string,
  overrides: Partial<ServiceRecord> = {},
): ServiceRecord {
  return {
    id,
    recordNumber: `RS-2026-${id}`,
    company: 'Cliente',
    service: 'Serviço',
    requester: 'Contato',
    createdAt: '2026-09-15T11:00:00.000Z',
    isDemo: true,
    serviceTypeId: 'vocab-1',
    partTraitIds: ['vocab-23'],
    resourceIds: ['vocab-14'],
    estimatedHours: 10,
    estimatedCost: 1000,
    proposedValue: 1000,
    actualHours: 12,
    actualCost: 1000,
    billedValue: 1000,
    deliveredAt: '2026-09-20T11:00:00.000Z',
    rework: false,
    scopeChange: false,
    deviationCauseId: null,
    lesson: 'Lição',
    relatedTopicIds: [],
    visibility: 'PUBLIC',
    serviceStatus: 'COMPLETED',
    lessonStatus: 'FORMALIZED',
    assumptions: '',
    ...overrides,
  };
}

describe('findSimilarRecords', () => {
  const base = [
    makeCase('0001'),
    makeCase('0002', { partTraitIds: ['vocab-22'], resourceIds: ['vocab-18'] }),
    makeCase('0003', {
      isDemo: false,
      lessonStatus: 'FORMALIZED',
      serviceStatus: 'COMPLETED',
    }),
    makeCase('0004', { lessonStatus: 'DRAFT', serviceStatus: 'COMPLETED' }),
  ];

  it('excludes non-demo and non-formalized cases', () => {
    const cases = findSimilarRecords(base, 'vocab-1', ['vocab-23'], ['vocab-14'], {
      viewerRole: 'TECNICO',
    });

    expect(cases.map((item) => item.id)).toEqual(['0001']);
  });

  it('excludes restricted cases for roles without permission', () => {
    const restricted = makeCase('0005', { visibility: 'RESTRICTED' });
    const cases = findSimilarRecords([...base, restricted], 'vocab-1', [], [], {
      viewerRole: 'TECNICO',
    });

    expect(cases.map((item) => item.id)).not.toContain('0005');
  });

  it('includes restricted cases for validador', () => {
    const restricted = makeCase('0005', { visibility: 'RESTRICTED' });
    const cases = findSimilarRecords([...base, restricted], 'vocab-1', [], [], {
      viewerRole: 'VALIDADOR',
    });

    expect(cases.map((item) => item.id)).toContain('0005');
  });

  it('filters by traits and resources when provided', () => {
    const cases = findSimilarRecords(base, 'vocab-1', ['vocab-22'], ['vocab-18'], {
      viewerRole: 'TECNICO',
    });

    expect(cases.map((item) => item.id)).toEqual(['0002']);
  });

  it('ignores trait and resource filters when arrays are empty', () => {
    const cases = findSimilarRecords(base, 'vocab-1', [], [], { viewerRole: 'TECNICO' });

    expect(cases).toHaveLength(2);
  });

  it('excludes the current record from matches', () => {
    const cases = findSimilarRecords(base, 'vocab-1', [], [], {
      excludeRecordId: '0001',
      viewerRole: 'TECNICO',
    });

    expect(cases.map((item) => item.id)).toEqual(['0002']);
  });
});

describe('assistant helpers', () => {
  it('formats confidence badge with case count', () => {
    const badge = formatConfidenceBadge(
      buildRecommendation(Array.from({ length: 3 }, (_, index) => makeCase(String(index)))),
    );

    expect(badge).toBe('Confiança baixa · 3 casos formalizados');
  });

  it('detects hours outside the usual range', () => {
    expect(getHoursRangePosition(4, 5, 9)).toBe('below');
    expect(getHoursRangePosition(10, 5, 9)).toBe('above');
    expect(getHoursRangePosition(7, 5, 9)).toBe('within');
  });

  it('requires estimation override only for medium/high with large deviation', () => {
    expect(needsEstimationOverrideReason(11, 10, 'medium')).toBe(false);
    expect(needsEstimationOverrideReason(12, 10, 'medium')).toBe(true);
    expect(needsEstimationOverrideReason(13, 10, 'low')).toBe(false);
  });

  it('counts service formalized cases regardless of profile filters', () => {
    expect(countServiceFormalizedCases([makeCase('0001'), makeCase('0002')], 'vocab-1')).toBe(2);
  });
});
