import { describe, expect, it } from 'vitest';
import type { ServiceStage } from '@/app/(workspace)/registros/types';
import type { VocabularyTerm } from '@/app/(workspace)/vocabulario/types';
import { DEFAULT_LAB_SETTINGS } from '@/lib/demo/demo-store-types';
import { computeStageQuoteCost, resolveQuoteBreakdown } from '@/lib/pricing';

const vocabulary: VocabularyTerm[] = [
  {
    id: 'vocab-10',
    label: 'ATOS Q',
    class: 'RESOURCE',
    guidance: '',
    active: true,
    updatedAt: '2026-09-01T00:00:00.000Z',
    hourlyRate: 200,
  },
  {
    id: 'vocab-19',
    label: 'ZEISS ZRE',
    class: 'RESOURCE',
    guidance: '',
    active: true,
    updatedAt: '2026-09-01T00:00:00.000Z',
    hourlyRate: 150,
  },
];

describe('stage quote pricing', () => {
  it('sums hours per stage without extra margin', () => {
    const stages: ServiceStage[] = [
      {
        id: 'stage-1',
        serviceTypeId: 'vocab-2',
        label: 'Digitalização 3D',
        resourceId: 'vocab-10',
        resourceIds: ['vocab-10'],
        estimatedHours: 8,
        actualHours: null,
      },
      {
        id: 'stage-2',
        serviceTypeId: 'vocab-9',
        label: 'Engenharia reversa',
        resourceId: 'vocab-19',
        resourceIds: ['vocab-19'],
        estimatedHours: 4,
        actualHours: null,
      },
    ];

    const breakdown = computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings: DEFAULT_LAB_SETTINGS,
    });

    expect(breakdown.suggestedPrice).toBe(8 * 200 + 4 * 150);
    expect(breakdown.marginPercent).toBe(0);
    expect(breakdown.tariffAsPrice).toBe(true);
    expect(breakdown.lines).toHaveLength(2);
    expect(breakdown.lines[0]?.serviceLabel).toBe('Digitalização 3D');
    expect(breakdown.lines[0]?.resourceLabel).toBe('ATOS Q');
    expect(breakdown.unitPrice).toBe(8 * 200 + 4 * 150);
  });

  it('multiplies unit price by batch quantity', () => {
    const stages: ServiceStage[] = [
      {
        id: 'stage-1',
        serviceTypeId: 'vocab-2',
        label: 'Inspeção',
        resourceId: 'vocab-10',
        resourceIds: ['vocab-10'],
        estimatedHours: 5,
        actualHours: null,
      },
    ];

    const breakdown = computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings: DEFAULT_LAB_SETTINGS,
      quantity: 16,
    });

    expect(breakdown.unitPrice).toBe(5 * 200);
    expect(breakdown.suggestedPrice).toBe(5 * 200 * 16);
    expect(breakdown.quantity).toBe(16);
  });

  it('ignores legacy snapshot team labor when stages exist', () => {
    const breakdown = resolveQuoteBreakdown(
      {
        id: 'record-1',
        recordNumber: 'RS-2026-0001',
        company: 'Cliente',
        service: 'Serviço',
        requester: 'Contato',
        createdAt: '2026-09-15T11:00:00.000Z',
        isDemo: true,
        partTraitIds: [],
        resourceIds: ['vocab-10'],
        estimatedHours: 8,
        estimatedCost: 9999,
        proposedValue: 9999,
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
        serviceStatus: 'QUOTED',
        lessonStatus: 'DRAFT',
        assumptions: '',
        stages: [
          {
            id: 'stage-1',
            serviceTypeId: 'vocab-2',
            label: 'Digitalização 3D',
            resourceId: 'vocab-10',
            resourceIds: ['vocab-10'],
            estimatedHours: 8,
            actualHours: null,
          },
        ],
        quoteSnapshot: {
          savedAt: '2026-09-15T11:00:00.000Z',
          tariffTableLabel: 'Legado',
          teamHourlyRate: 50,
          targetMarginPercent: 35,
          resourceRates: {},
          breakdown: {
            lines: [
              {
                id: 'team',
                label: 'Mão de obra técnica',
                hours: 8,
                rate: 50,
                subtotal: 400,
              },
            ],
            totalCost: 400,
            suggestedPrice: 615,
            marginPercent: 35,
            explanations: [],
          },
        },
      },
      vocabulary,
      DEFAULT_LAB_SETTINGS,
    );

    expect(breakdown.lines).toHaveLength(1);
    expect(breakdown.lines[0]?.resourceLabel).toBe('ATOS Q');
    expect(breakdown.lines.some((line) => line.id === 'team')).toBe(false);
    expect(breakdown.suggestedPrice).toBe(1600);
  });
});
