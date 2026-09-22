import { describe, expect, it } from 'vitest';
import type { ServiceRecord } from '@/app/(workspace)/registros/types';
import {
  getRecordQuoteMode,
  needsPriceOverrideReason,
} from '@/lib/quote-mode';

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
    estimatedHours: 8,
    estimatedCost: 1000,
    proposedValue: 1500,
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
    ...overrides,
  };
}

describe('quote mode', () => {
  it('defaults to tariff when quoteMode is missing', () => {
    expect(getRecordQuoteMode(createRecord())).toBe('tariff');
  });

  it('requires override reason only in tariff mode when diverging from tariff', () => {
    expect(needsPriceOverrideReason(createRecord({ proposedValue: 1500 }), 1000)).toBe(true);
    expect(needsPriceOverrideReason(createRecord({ proposedValue: 1020 }), 1000)).toBe(false);
    expect(
      needsPriceOverrideReason(
        createRecord({ quoteMode: 'commercial_fixed', proposedValue: 1500 }),
        1000,
      ),
    ).toBe(false);
    expect(
      needsPriceOverrideReason(
        createRecord({
          quoteMode: 'hourly_package',
          hoursPackageRef: 'Pacote 120 h',
          proposedValue: 16200,
        }),
        1000,
      ),
    ).toBe(false);
  });
});
