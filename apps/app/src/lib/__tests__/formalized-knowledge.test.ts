import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import {
  canViewRecord,
  canUseCaseInKnowledge,
  countPendingFormalizationLessons,
  isDemoFormalizedCase,
} from '@/lib/formalized-knowledge';

function makeRecord(overrides: Partial<ServiceRecord> = {}): ServiceRecord {
  return {
    id: 'record-1',
    recordNumber: 'RS-2026-0001',
    company: 'Cliente',
    service: 'Serviço',
    requester: 'Contato',
    createdAt: '2026-09-15T11:00:00.000Z',
    isDemo: true,
    partTraitIds: [],
    resourceIds: [],
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

describe('formalized-knowledge', () => {
  it('identifies demo formalized completed records', () => {
    expect(isDemoFormalizedCase(makeRecord())).toBe(true);
    expect(isDemoFormalizedCase(makeRecord({ isDemo: false }))).toBe(false);
    expect(isDemoFormalizedCase(makeRecord({ lessonStatus: 'PENDING' }))).toBe(false);
  });

  it('blocks restricted records for consulta and tecnico', () => {
    const restricted = makeRecord({ visibility: 'RESTRICTED' });

    expect(canViewRecord(restricted, 'CONSULTA')).toBe(false);
    expect(canViewRecord(restricted, 'TECNICO')).toBe(false);
    expect(canViewRecord(restricted, 'VALIDADOR')).toBe(true);
    expect(canViewRecord(restricted, 'ADMIN')).toBe(true);
  });

  it('blocks restricted cases in knowledge for unauthorized roles', () => {
    const restricted = makeRecord({ visibility: 'RESTRICTED' });

    expect(canUseCaseInKnowledge(restricted, 'TECNICO')).toBe(false);
    expect(canUseCaseInKnowledge(restricted, 'VALIDADOR')).toBe(true);
  });

  it('counts pending formalization lessons only when service is completed and visible', () => {
    const pendingCompleted = makeRecord({ lessonStatus: 'PENDING' });
    const pendingDraft = makeRecord({
      id: 'record-2',
      recordNumber: 'RS-2026-0002',
      lessonStatus: 'PENDING',
      serviceStatus: 'DRAFT',
    });
    const pendingRestricted = makeRecord({
      id: 'record-3',
      recordNumber: 'RS-2026-0003',
      lessonStatus: 'PENDING',
      visibility: 'RESTRICTED',
    });

    expect(
      countPendingFormalizationLessons(
        [pendingCompleted, pendingDraft, pendingRestricted],
        'TECNICO',
      ),
    ).toBe(1);
    expect(
      countPendingFormalizationLessons(
        [pendingCompleted, pendingDraft, pendingRestricted],
        'VALIDADOR',
      ),
    ).toBe(2);
  });
});
