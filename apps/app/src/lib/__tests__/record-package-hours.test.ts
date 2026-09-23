import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import { syncPackageHoursFromStages } from '@/lib/record-package-hours';

const serviceTypes = [
  {
    id: 'vocab-1',
    label: 'Inspeção',
    class: 'SERVICE_TYPE' as const,
    guidance: '',
    active: true,
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function createRecord(overrides: Partial<ServiceRecord> = {}): ServiceRecord {
  return {
    id: 'record-test',
    recordNumber: 'RS-2026-0099',
    company: 'Empresa',
    service: 'Serviço',
    requester: 'Cliente',
    createdAt: '2026-09-18T08:42:00.000Z',
    isDemo: true,
    partTraitIds: [],
    resourceIds: [],
    estimatedHours: null,
    estimatedCost: null,
    proposedValue: null,
    assumptions: '',
    serviceStatus: 'DRAFT',
    actualHours: null,
    actualCost: null,
    billedValue: null,
    deliveredAt: null,
    rework: false,
    scopeChange: false,
    deviationCauseId: null,
    lesson: '',
    relatedTopicIds: [],
    visibility: 'PUBLIC',
    quantity: 1,
    stages: [],
    lessonStatus: 'DRAFT',
    quoteMode: 'hourly_package',
    ...overrides,
  };
}

describe('syncPackageHoursFromStages', () => {
  it('returns null outside package mode', () => {
    expect(
      syncPackageHoursFromStages(createRecord({ quoteMode: 'tariff' }), serviceTypes),
    ).toBeNull();
  });

  it('sums stage hours in package mode', () => {
    expect(
      syncPackageHoursFromStages(
        createRecord({
          stages: [
            {
              id: 'stage-1',
              serviceTypeId: 'vocab-1',
              label: 'Treinamento',
              resourceIds: [],
              estimatedHours: 40,
              actualHours: null,
            },
            {
              id: 'stage-2',
              serviceTypeId: 'vocab-1',
              label: 'Análises',
              resourceIds: [],
              estimatedHours: 80,
              actualHours: null,
            },
          ],
        }),
        serviceTypes,
      ),
    ).toBe(120);
  });
});
