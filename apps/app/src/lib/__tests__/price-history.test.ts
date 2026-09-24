import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import { buildRecommendation } from '@/lib/assistant';
import {
  buildPriceHistory,
  resolveHistoricalSuggestedPrice,
  resolveSuggestedPrice,
} from '@/lib/pricing';

function makeCase(id: string, proposedValue: number, quantity = 1): ServiceRecord {
  return {
    id,
    recordNumber: `RS-2026-${id}`,
    company: 'Cliente',
    service: 'Serviço',
    requester: 'Contato',
    createdAt: '2026-09-15T11:00:00.000Z',
    isDemo: true,
    partTraitIds: [],
    resourceIds: [],
    estimatedHours: 10,
    estimatedCost: proposedValue,
    proposedValue,
    quantity,
    actualHours: 12,
    actualCost: proposedValue,
    billedValue: proposedValue,
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
  };
}

describe('buildPriceHistory', () => {
  it('returns individual cases without aggregate stats for 1–4 records', () => {
    const history = buildPriceHistory([makeCase('0001', 630)]);

    expect(history.count).toBe(1);
    expect(history.median).toBeNull();
    expect(history.q1).toBeNull();
    expect(history.q3).toBeNull();
    expect(history.cases).toHaveLength(1);
    expect(history.cases?.[0]?.unitPrice).toBe(630);
  });

  it('computes median and quartiles from 5 cases onward', () => {
    const history = buildPriceHistory([
      makeCase('0001', 100),
      makeCase('0002', 200),
      makeCase('0003', 300),
      makeCase('0004', 400),
      makeCase('0005', 500),
    ]);

    expect(history.count).toBe(5);
    expect(history.cases).toBeUndefined();
    expect(history.median).toBe(300);
    expect(history.q1).toBe(200);
    expect(history.q3).toBe(400);
  });
});

describe('resolveSuggestedPrice', () => {
  it('keeps tariff as reference in tariff mode even with historical cases', () => {
    const price = resolveSuggestedPrice({
      quoteMode: 'tariff',
      tariffPrice: 37438,
      historicalCases: [makeCase('0001', 630)],
    });

    expect(price).toBe(37438);
  });

  it('does not use historical median with fewer than 5 cases', () => {
    const price = resolveSuggestedPrice({
      quoteMode: 'commercial_fixed',
      tariffPrice: 37438,
      historicalCases: [makeCase('0001', 630)],
    });

    expect(price).toBe(37438);
    expect(resolveHistoricalSuggestedPrice([makeCase('0001', 630)])).toBe(0);
  });
});

describe('buildRecommendation', () => {
  it('suppresses aggregate stats for 1–4 cases', () => {
    const recommendation = buildRecommendation([makeCase('0001', 630)]);

    expect(recommendation.level).toBe('low');
    expect(recommendation.cases).toHaveLength(1);
    expect(recommendation.median).toBeNull();
    expect(recommendation.q1).toBeNull();
    expect(recommendation.q3).toBeNull();
    expect(recommendation.correctionFactor).toBeNull();
    expect(recommendation.suggestedHours).toBeNull();
  });

  it('uses median without correction factor for 5–14 cases', () => {
    const recommendation = buildRecommendation(
      Array.from({ length: 6 }, (_, index) => makeCase(String(index + 1).padStart(4, '0'), 100 + index * 10)),
    );

    expect(recommendation.level).toBe('medium');
    expect(recommendation.median).not.toBeNull();
    expect(recommendation.correctionFactor).toBeNull();
    expect(recommendation.suggestedHours).toBe(recommendation.median);
  });
});
