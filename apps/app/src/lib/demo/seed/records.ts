import type { ServiceRecord, ServiceStage } from '@/app/(workspace)/registros/types';

import {
  buildQuoteSnapshot,
  buildStageQuoteSnapshot,
  computeStageQuoteCost,
} from '../../pricing';

import { DEFAULT_LAB_SETTINGS } from '../../demo/demo-store-types';

import { SEED_VOCABULARY } from '../seed/vocabulary';

function priceFromStages(
  stages: ServiceStage[],
  options: {
    quantity?: number;
    savedAt?: string;
    hoursField?: 'estimatedHours' | 'actualHours';
  } = {},
) {
  const quantity = options.quantity ?? 1;
  const snapshot = buildStageQuoteSnapshot({
    vocabulary: SEED_VOCABULARY,
    stages,
    labSettings: DEFAULT_LAB_SETTINGS,
  });
  if (options.savedAt) {
    snapshot.savedAt = options.savedAt;
  }
  const breakdown = computeStageQuoteCost({
    vocabulary: SEED_VOCABULARY,
    stages,
    labSettings: DEFAULT_LAB_SETTINGS,
    quantity,
    hoursField: options.hoursField,
  });
  return {
    quoteSnapshot: { ...snapshot, breakdown },
    cost: breakdown.suggestedPrice,
  };
}

const record1CreatedAt = '2026-09-15T11:00:00.000Z';

const record1Stages: ServiceStage[] = [
  {
    id: 'record-1-stage-1',
    serviceTypeId: 'vocab-1',
    label: 'Digitalização 3D',
    resourceId: 'vocab-14',
    resourceIds: ['vocab-14'],
    estimatedHours: 8,
    actualHours: null,
  },
  {
    id: 'record-1-stage-2',
    serviceTypeId: 'vocab-2',
    label: 'Engenharia reversa',
    resourceId: 'vocab-20',
    resourceIds: ['vocab-20'],
    estimatedHours: 12,
    actualHours: null,
  },
  {
    id: 'record-1-stage-3',
    serviceTypeId: 'vocab-4',
    label: 'Inspeção dimensional (CMM)',
    resourceId: 'vocab-13',
    resourceIds: ['vocab-13'],
    estimatedHours: 4,
    actualHours: null,
  },
];

const record1Pricing = priceFromStages(record1Stages, { savedAt: record1CreatedAt });

const record2Snapshot = buildQuoteSnapshot({
  vocabulary: SEED_VOCABULARY,
  resourceIds: ['vocab-18', 'vocab-20'],
  teamHours: 16,
  equipmentHours: 10,
  labSettings: DEFAULT_LAB_SETTINGS,
});

const record3Stages: ServiceStage[] = [
  {
    id: 'record-3-stage-1',
    serviceTypeId: 'vocab-1',
    label: 'Digitalização 3D',
    resourceId: 'vocab-14',
    resourceIds: ['vocab-14'],
    estimatedHours: 2,
    actualHours: 2.5,
  },
  {
    id: 'record-3-stage-2',
    serviceTypeId: 'vocab-2',
    label: 'Engenharia reversa',
    resourceId: 'vocab-20',
    resourceIds: ['vocab-20'],
    estimatedHours: 3,
    actualHours: 3.5,
  },
];

const record3Estimated = priceFromStages(record3Stages, {
  quantity: 3,
  savedAt: '2026-08-14T10:00:00.000Z',
});
const record3Actual = priceFromStages(record3Stages, {
  quantity: 3,
  hoursField: 'actualHours',
});

const record4Stages: ServiceStage[] = [
  {
    id: 'record-4-stage-1',
    serviceTypeId: 'vocab-4',
    label: 'Inspeção dimensional',
    resourceId: 'vocab-13',
    resourceIds: ['vocab-13'],
    estimatedHours: 3.6,
    actualHours: 4.4,
  },
];

const record4Estimated = priceFromStages(record4Stages, {
  quantity: 5,
  savedAt: '2026-06-29T09:30:00.000Z',
});
const record4Actual = priceFromStages(record4Stages, {
  quantity: 5,
  hoursField: 'actualHours',
});

const record5Stages: ServiceStage[] = [
  {
    id: 'record-5-stage-1',
    serviceTypeId: 'vocab-4',
    label: 'Inspeção dimensional',
    resourceId: 'vocab-17',
    resourceIds: ['vocab-17'],
    estimatedHours: 1.5,
    actualHours: null,
  },
];

const record5CreatedAt = '2026-09-19T15:00:00.000Z';
const record5Pricing = priceFromStages(record5Stages, {
  quantity: 12,
  savedAt: record5CreatedAt,
});

const record6Stages: ServiceStage[] = [
  {
    id: 'record-6-stage-1',
    serviceTypeId: 'vocab-7',
    label: 'Tomografia industrial',
    resourceId: 'vocab-15',
    resourceIds: ['vocab-15'],
    estimatedHours: 6,
    actualHours: 7,
  },
];

const record6Estimated = priceFromStages(record6Stages, {
  savedAt: '2026-09-08T12:00:00.000Z',
});
const record6Actual = priceFromStages(record6Stages, { hoursField: 'actualHours' });

const record8Stages: ServiceStage[] = [
  {
    id: 'record-8-stage-1',
    serviceTypeId: 'vocab-7',
    label: 'Tomografia interna',
    resourceId: 'vocab-15',
    resourceIds: ['vocab-15'],
    estimatedHours: 5,
    actualHours: null,
  },
  {
    id: 'record-8-stage-2',
    serviceTypeId: 'vocab-8',
    label: 'Análise de falhas',
    resourceId: 'vocab-13',
    resourceIds: ['vocab-13'],
    estimatedHours: 4,
    actualHours: null,
  },
];

const record8CreatedAt = '2026-09-20T11:30:00.000Z';
const record8Pricing = priceFromStages(record8Stages, { savedAt: record8CreatedAt });

export const SEED_RECORDS: ServiceRecord[] = [
  {
    id: 'record-1',
    recordNumber: 'RS-2026-0001',
    requestId: 'request-3',
    requestNumber: 'SO-2026-0003',
    company: 'VERTICAL SERVICOS E COMERCIO DE EQUIPAMENTOS LTDA',
    service: 'Metrologia Avançada + Comparação entre modelos 3D e CAD + Análise de falhas',
    requester: 'Cleber Alves Ribeiro',
    createdAt: record1CreatedAt,
    isDemo: true,
    recordKind: 'composite',
    serviceTypeId: 'vocab-8',
    partTraitIds: ['vocab-23'],
    resourceIds: ['vocab-13'],
    stages: record1Stages,
    estimatedHours: 24,
    estimatedCost: record1Pricing.cost,
    proposedValue: record1Pricing.cost,
    quoteSnapshot: record1Pricing.quoteSnapshot,
    assumptions:
      'Serviço composto por medição avançada, comparação do modelo CAD e análise dimensional.',
    estimatedBy: 'João',
    equipment: 'CMM PRISMO',
    serviceStatus: 'QUOTED',
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
    lessonStatus: 'DRAFT',
  },

  {
    id: 'record-2',
    recordNumber: 'RS-2026-0002',
    requestId: 'request-2',
    requestNumber: 'SO-2026-0002',
    company: 'BV8 COMERCIO VAREJO LTDA',
    service: 'Digitalização 3D',
    requester: 'Humberto Dutra',
    createdAt: '2026-09-12T09:30:00.000Z',
    isDemo: true,
    recordKind: 'single',
    batchLabel: 'Coletor',
    serviceTypeId: 'vocab-1',
    partTraitIds: ['vocab-23'],
    resourceIds: ['vocab-18', 'vocab-20'],
    estimatedHours: 10,
    estimatedCost: record2Snapshot.breakdown.totalCost,
    proposedValue: record2Snapshot.breakdown.suggestedPrice,
    quoteSnapshot: record2Snapshot,
    assumptions: 'Desenho técnico atualizado será enviado junto com o lote.',
    estimatedBy: 'João',
    equipment: 'T-SCAN Hawk 2 + ZEISS ZRE',
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
    lessonStatus: 'DRAFT',
  },

  {
    id: 'record-3',
    recordNumber: 'RS-2026-0003',
    company: 'SAMEQ INDUSTRIA E SERVICOS EIRELI',
    service: 'Digitalização 3D + Engenharia Reversa',
    requester: 'Samarah Sullyva',
    createdAt: '2026-08-14T10:00:00.000Z',
    isDemo: true,
    recordKind: 'batch',
    quantity: 3,
    batchLabel: 'Conjuntos válvula 01–03',
    serviceTypeId: 'vocab-1',
    partTraitIds: ['vocab-23'],
    resourceIds: ['vocab-14', 'vocab-20'],
    stages: record3Stages,
    estimatedHours: 5,
    estimatedCost: record3Estimated.cost,
    proposedValue: record3Estimated.cost,
    quoteSnapshot: record3Estimated.quoteSnapshot,
    assumptions: 'Peça disponível e superfície preparada para digitalização.',
    estimatedBy: 'João',
    equipment: 'ATOS Q + ZEISS ZRE',
    serviceStatus: 'COMPLETED',
    actualHours: 6,
    actualCost: record3Actual.cost,
    billedValue: record3Actual.cost,
    deliveredAt: '2026-08-16T16:00:00.000Z',
    rework: false,
    scopeChange: false,
    deviationCauseId: 'vocab-26',
    lesson: 'Peças com tolerância apertada exigem mais pontos de referência na digitalização.',
    relatedTopicIds: ['vocab-2', 'vocab-23'],
    visibility: 'PUBLIC',
    lessonStatus: 'FORMALIZED',
  },

  {
    id: 'record-4',
    recordNumber: 'RS-2026-0004',
    company: 'GLOBAL PARTS LTDA',
    service: 'Inspeção dimensional de componente',
    requester: 'Walter Carrara',
    createdAt: '2026-06-29T09:30:00.000Z',
    isDemo: true,
    recordKind: 'batch',
    quantity: 5,
    batchLabel: 'Flanges linha 2',
    serviceTypeId: 'vocab-4',
    partTraitIds: ['vocab-22', 'vocab-23'],
    resourceIds: ['vocab-13'],
    stages: record4Stages,
    estimatedHours: 3.6,
    estimatedCost: record4Estimated.cost,
    proposedValue: record4Estimated.cost,
    quoteSnapshot: record4Estimated.quoteSnapshot,
    assumptions: 'Componente disponibilizado com desenho técnico atualizado.',
    estimatedBy: 'João',
    equipment: 'CMM PRISMO',
    serviceStatus: 'COMPLETED',
    actualHours: 4.4,
    actualCost: record4Actual.cost,
    billedValue: record4Actual.cost,
    deliveredAt: '2026-07-15T16:00:00.000Z',
    rework: false,
    scopeChange: true,
    deviationCauseId: 'vocab-25',
    lesson: 'Fixação mais complexa que o previsto em superfícies livres.',
    relatedTopicIds: ['vocab-4', 'vocab-22'],
    visibility: 'PUBLIC',
    lessonStatus: 'FORMALIZED',
  },

  {
    id: 'record-5',
    recordNumber: 'RS-2026-0005',
    requestId: 'request-5',
    requestNumber: 'SO-2026-0005',
    company: 'INDUSTRIA GOIANA DE EIXOS LTDA',
    service: 'Inspeção dimensional — lote de 12 eixos usinados',
    requester: 'Ricardo Mendes',
    createdAt: record5CreatedAt,
    isDemo: true,
    recordKind: 'batch',
    quantity: 12,
    batchLabel: 'Eixos usinados 01–12',
    serviceTypeId: 'vocab-4',
    partTraitIds: ['vocab-23'],
    resourceIds: ['vocab-17'],
    stages: record5Stages,
    estimatedHours: 1.5,
    estimatedCost: record5Pricing.cost,
    proposedValue: record5Pricing.cost,
    quoteSnapshot: record5Pricing.quoteSnapshot,
    assumptions:
      'Desenho técnico revisão C enviado por e-mail. Lote disponível para coleta em Aparecida de Goiânia.',
    estimatedBy: 'João',
    equipment: 'CMM CONTURA',
    serviceStatus: 'QUOTED',
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
    lessonStatus: 'DRAFT',
  },

  {
    id: 'record-6',
    recordNumber: 'RS-2026-0006',
    requestId: 'request-6',
    requestNumber: 'SO-2026-0006',
    company: 'USIMINAS MINEIRAS LTDA',
    service: 'Tomografia industrial',
    requester: 'Patrícia Nogueira',
    createdAt: '2026-09-08T12:00:00.000Z',
    isDemo: true,
    recordKind: 'single',
    serviceTypeId: 'vocab-7',
    partTraitIds: ['vocab-22'],
    resourceIds: ['vocab-15'],
    stages: record6Stages,
    estimatedHours: 6,
    estimatedCost: record6Estimated.cost,
    proposedValue: record6Estimated.cost,
    quoteSnapshot: record6Estimated.quoteSnapshot,
    assumptions: 'Componente fundido com suspeita de porosidade interna. Laudo com imagens tomográficas.',
    estimatedBy: 'João',
    equipment: 'BOSELLO MAX',
    serviceStatus: 'COMPLETED',
    actualHours: 7,
    actualCost: record6Actual.cost,
    billedValue: record6Actual.cost,
    deliveredAt: '2026-09-11T17:30:00.000Z',
    rework: false,
    scopeChange: false,
    deviationCauseId: 'vocab-24',
    lesson: 'Região central do componente exigiu tempo extra por acesso limitado à cavidade.',
    relatedTopicIds: ['vocab-7', 'vocab-22'],
    visibility: 'PUBLIC',
    lessonStatus: 'FORMALIZED',
  },

  {
    id: 'record-7',
    recordNumber: 'RS-2026-0007',
    company: 'TECNOAR COMPRESSORES LTDA',
    service: 'Nacionalização de conjunto importado',
    requester: 'Fernanda Costa',
    createdAt: '2026-09-06T17:00:00.000Z',
    isDemo: true,
    recordKind: 'single',
    serviceTypeId: 'vocab-3',
    partTraitIds: ['vocab-23'],
    resourceIds: ['vocab-18', 'vocab-20', 'vocab-21'],
    estimatedHours: null,
    estimatedCost: null,
    proposedValue: null,
    assumptions:
      'Aguardando despiece do conjunto importado e definição de tolerâncias para fabricação local.',
    equipment: 'T-SCAN Hawk 2 + ZEISS ZRE',
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
    lessonStatus: 'DRAFT',
  },

  {
    id: 'record-8',
    recordNumber: 'RS-2026-0008',
    company: 'MOINHO PH INDUSTRIA E COMERCIO LTDA',
    service: 'Tomografia + análise de falhas em rolamento',
    requester: 'André Luiz Campos',
    createdAt: record8CreatedAt,
    isDemo: true,
    recordKind: 'composite',
    serviceTypeId: 'vocab-8',
    partTraitIds: ['vocab-23'],
    resourceIds: ['vocab-15', 'vocab-13'],
    stages: record8Stages,
    estimatedHours: 9,
    estimatedCost: record8Pricing.cost,
    proposedValue: record8Pricing.cost,
    quoteSnapshot: record8Pricing.quoteSnapshot,
    assumptions:
      'Rolamento de moinho com trinca após 18 meses de operação. Análise de causa raiz com laudo integrado.',
    estimatedBy: 'João',
    equipment: 'BOSELLO MAX + CMM PRISMO',
    serviceStatus: 'QUOTED',
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
    lessonStatus: 'DRAFT',
  },
];
