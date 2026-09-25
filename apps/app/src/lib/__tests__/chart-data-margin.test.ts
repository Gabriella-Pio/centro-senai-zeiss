import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import { buildServiceMarginRows } from '@/lib/chart-data';

function makeRecord(overrides: Partial<ServiceRecord> = {}): ServiceRecord {
  return {
    id: 'record-1',
    recordNumber: 'RS-2026-0001',
    company: 'Cliente',
    service: 'Serviço',
    requester: 'Contato',
    createdAt: '2026-09-15T11:00:00.000Z',
    isDemo: true,
    serviceTypeId: 'vocab-1',
    partTraitIds: [],
    resourceIds: [],
    estimatedHours: 10,
    estimatedCost: 1000,
    proposedValue: 1500,
    actualHours: 10,
    actualCost: 500,
    billedValue: 1500,
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

describe('buildServiceMarginRows', () => {
  it('returns quoted and realized margins per formalized case', () => {
    const rows = buildServiceMarginRows([
      makeRecord({
        id: 'record-1',
        recordNumber: 'RS-2026-0001',
        estimatedCost: 1000,
        proposedValue: 1500,
        actualCost: 500,
        billedValue: 1500,
      }),
      makeRecord({
        id: 'record-2',
        recordNumber: 'RS-2026-0002',
        createdAt: '2026-09-10T11:00:00.000Z',
        deliveredAt: '2026-09-22T11:00:00.000Z',
        estimatedCost: 800,
        proposedValue: 1000,
        actualCost: 950,
        billedValue: 1000,
      }),
    ]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      label: '0002',
      quotedMargin: 20,
      realizedMargin: 5,
    });
    expect(rows[1]).toMatchObject({
      label: '0001',
      quotedMargin: 33,
      realizedMargin: 67,
    });
  });
});
