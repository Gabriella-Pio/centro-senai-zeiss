import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import type { VocabularyTerm } from '@/app/(workspace)/vocabulario/types';
import {
  buildConfidenceByServiceType,
  buildConfidenceDonut,
  confidenceLevelFromCaseCount,
} from '@/lib/chart-data';

const vocabulary: VocabularyTerm[] = [
  {
    id: 'type-a',
    label: 'Tipo A',
    class: 'SERVICE_TYPE',
    guidance: '',
    active: true,
    updatedAt: '2026-01-01',
  },
  {
    id: 'type-b',
    label: 'Tipo B',
    class: 'SERVICE_TYPE',
    guidance: '',
    active: true,
    updatedAt: '2026-01-01',
  },
  {
    id: 'inactive',
    label: 'Inativo',
    class: 'SERVICE_TYPE',
    guidance: '',
    active: false,
    updatedAt: '2026-01-01',
  },
];

function makeRecord(overrides: Partial<ServiceRecord> = {}): ServiceRecord {
  return {
    id: 'record-1',
    recordNumber: 'RS-2026-0001',
    company: 'Cliente',
    service: 'Serviço',
    requester: 'Contato',
    createdAt: '2026-09-15T11:00:00.000Z',
    isDemo: true,
    serviceTypeId: 'type-a',
    partTraitIds: [],
    resourceIds: [],
    estimatedHours: 10,
    estimatedCost: 1000,
    proposedValue: 1000,
    actualHours: 10,
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

describe('confidence by service type', () => {
  it('maps case counts to confidence levels per active service type', () => {
    const records = [
      ...Array.from({ length: 6 }, (_, index) =>
        makeRecord({ id: `a-${index}`, serviceTypeId: 'type-a' }),
      ),
      makeRecord({ id: 'b-1', serviceTypeId: 'type-b' }),
    ];

    const rows = buildConfidenceByServiceType(records, vocabulary);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ id: 'type-a', caseCount: 6, level: 'medium' });
    expect(rows[1]).toMatchObject({ id: 'type-b', caseCount: 1, level: 'low' });
  });

  it('keeps donut aggregate aligned with per-type rows', () => {
    const records = Array.from({ length: 15 }, (_, index) =>
      makeRecord({ id: `a-${index}`, serviceTypeId: 'type-a' }),
    );

    const donut = buildConfidenceDonut(records, vocabulary);
    const highSlice = donut.find((slice) => slice.label === 'Alta');

    expect(confidenceLevelFromCaseCount(15)).toBe('high');
    expect(highSlice?.value).toBe(1);
  });
});
