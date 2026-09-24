import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import { buildMarginDonut, countMarginDonutAboveTarget } from '@/lib/chart-data';
import type { LabSettings } from '@/lib/demo/demo-store-types';

const labSettings: LabSettings = {
  tariffTableLabel: 'Demo',
  teamHourlyRate: 95,
  targetMarginPercent: 35,
};

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

describe('buildMarginDonut above-target lookup', () => {
  it('counts cases above target for KPI/resumo alignment', () => {
    const records = [
      makeRecord({
        id: 'above-target',
        recordNumber: 'RS-2026-0002',
        actualCost: 500,
        billedValue: 1000,
      }),
      makeRecord({
        id: 'below-target',
        recordNumber: 'RS-2026-0003',
        actualCost: 950,
        billedValue: 1000,
      }),
    ];

    const marginDonut = buildMarginDonut(records, labSettings);
    const aboveTarget = countMarginDonutAboveTarget(marginDonut);
    const marginTotal = marginDonut.reduce((sum, slice) => sum + slice.value, 0);
    const abovePercent = marginTotal > 0 ? Math.round((aboveTarget / marginTotal) * 100) : 0;

    expect(aboveTarget).toBe(1);
    expect(abovePercent).toBe(50);
  });
});
