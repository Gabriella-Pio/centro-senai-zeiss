import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import type { UserRole } from '@/lib/api';
import {
  buildConfidenceDonut,
  buildEffortTrend,
  buildServiceMarginRows,
  computeAssertivenessRate,
} from '@/lib/chart-data';
import { canViewRecord, countPendingFormalizationLessons } from '@/lib/formalized-knowledge';
import { computeIndicators } from '@/lib/indicators';
import type { LabSettings } from '@/lib/demo/demo-store-types';

const labSettings: LabSettings = {
  tariffTableLabel: 'Demo',
  teamHourlyRate: 95,
  targetMarginPercent: 35,
};

function makeRecord(overrides: Partial<ServiceRecord> = {}): ServiceRecord {
  return {
    id: 'record-public',
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
    actualCost: 600,
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

function visibleRecordsForRole(records: ServiceRecord[], role: UserRole) {
  return records.filter((record) => canViewRecord(record, role));
}

function countPendingLessons(records: ServiceRecord[], role: UserRole) {
  return countPendingFormalizationLessons(records, role);
}

describe('record visibility in aggregates', () => {
  const restrictedOutlier = makeRecord({
    id: 'record-restricted',
    recordNumber: 'RS-2026-0099',
    visibility: 'RESTRICTED',
    estimatedHours: 10,
    actualHours: 20,
    actualCost: 900,
    billedValue: 1000,
  });

  const records = [makeRecord(), restrictedOutlier];

  it.each(['TECNICO', 'CONSULTA'] as const)(
    'excludes restricted formalized records from metrics for %s',
    (role) => {
      const visible = visibleRecordsForRole(records, role);

      expect(computeIndicators(visible, [], labSettings).totalFormalized).toBe(1);
      expect(computeAssertivenessRate(visible)).toBe(100);
      expect(buildEffortTrend(visible)).toHaveLength(1);
      expect(buildServiceMarginRows(visible)).toHaveLength(1);
      expect(buildServiceMarginRows(records)).toHaveLength(2);
    },
  );

  it.each(['VALIDADOR', 'ADMIN'] as const)(
    'includes restricted formalized records in metrics for %s',
    (role) => {
      const visible = visibleRecordsForRole(records, role);

      expect(computeIndicators(visible, [], labSettings).totalFormalized).toBe(2);
      expect(computeAssertivenessRate(visible)).toBe(50);
      expect(buildEffortTrend(visible)).toHaveLength(1);
    },
  );

  it('includes restricted service types in confidence donut only for authorized roles', () => {
    const vocabulary = [
      {
        id: 'vocab-1',
        label: 'Tipo A',
        class: 'SERVICE_TYPE' as const,
        guidance: '',
        active: true,
        updatedAt: '2026-01-01',
      },
      {
        id: 'vocab-2',
        label: 'Tipo B',
        class: 'SERVICE_TYPE' as const,
        guidance: '',
        active: true,
        updatedAt: '2026-01-01',
      },
    ];

    const restrictedType = makeRecord({
      id: 'record-restricted-type',
      recordNumber: 'RS-2026-0100',
      visibility: 'RESTRICTED',
      serviceTypeId: 'vocab-2',
    });

    const dataset = [makeRecord(), restrictedType];

    expect(buildConfidenceDonut(visibleRecordsForRole(dataset, 'TECNICO'), vocabulary)).toEqual(
      buildConfidenceDonut([makeRecord()], vocabulary),
    );
    expect(
      buildConfidenceDonut(visibleRecordsForRole(dataset, 'VALIDADOR'), vocabulary).reduce(
        (sum, slice) => sum + slice.value,
        0,
      ),
    ).toBe(2);
  });

  it.each(['TECNICO', 'CONSULTA'] as const)(
    'does not count restricted pending lessons for %s',
    (role) => {
      const pendingPublic = makeRecord({
        id: 'pending-public',
        recordNumber: 'RS-2026-0101',
        lessonStatus: 'PENDING',
      });
      const pendingRestricted = makeRecord({
        id: 'pending-restricted',
        recordNumber: 'RS-2026-0102',
        visibility: 'RESTRICTED',
        lessonStatus: 'PENDING',
      });

      expect(countPendingLessons([pendingPublic, pendingRestricted], role)).toBe(1);
    },
  );

  it.each(['VALIDADOR', 'ADMIN'] as const)('counts restricted pending lessons for %s', (role) => {
    const pendingPublic = makeRecord({
      id: 'pending-public',
      recordNumber: 'RS-2026-0101',
      lessonStatus: 'PENDING',
    });
    const pendingRestricted = makeRecord({
      id: 'pending-restricted',
      recordNumber: 'RS-2026-0102',
      visibility: 'RESTRICTED',
      lessonStatus: 'PENDING',
    });

    expect(countPendingLessons([pendingPublic, pendingRestricted], role)).toBe(2);
  });
});
