import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import { DEMO_REQUESTS } from "@/app/(workspace)/solicitacoes/demo";
import { DEMO_VOCABULARY } from "@/app/(workspace)/vocabulario/demo";
import { CARGILL_DEMO_RECORDS, CARGILL_VOCABULARY_EXTRA, DEMO_SEED_VERSION } from "./cargill-demo-records";
import { DEFAULT_LAB_SETTINGS, type DemoState } from "./demo-store-types";
import { applyMachineTariffsToVocabulary } from "./machine-tariff";
import { MACHINE_TARIFF_SEED } from "./machine-tariff-seed";
import { buildQuoteSnapshot, buildStageQuoteSnapshot } from "./pricing";

function seedQuotePricing(
  teamHours: number,
  resourceIds: string[],
  vocabulary: VocabularyTerm[],
  createdAt: string,
) {
  const equipmentHours = Math.round(teamHours * 0.6);
  const snapshot = buildQuoteSnapshot({
    vocabulary,
    resourceIds,
    teamHours,
    equipmentHours,
    labSettings: { ...DEFAULT_LAB_SETTINGS, tariffTableLabel: `${DEFAULT_LAB_SETTINGS.tariffTableLabel} (snapshot ${createdAt.slice(0, 10)})` },
  });
  return {
    totalCost: snapshot.breakdown.totalCost,
    proposedValue: snapshot.breakdown.suggestedPrice,
    estimatedEquipmentHours: equipmentHours,
    quoteSnapshot: snapshot,
  };
}

type FormalizedSeed = Partial<ServiceRecord> & {
  serviceTypeId: string;
  service: string;
  estimatedHours: number;
  actualHours: number;
};

function buildFormalizedRecord(
  index: number,
  overrides: FormalizedSeed,
  vocabulary: VocabularyTerm[],
): ServiceRecord {
  const num = String(index).padStart(4, "0");
  const { service, serviceTypeId, estimatedHours, actualHours, ...rest } = overrides;
  const resourceIds = overrides.resourceIds ?? ["vocab-5", "vocab-12"];
  const createdAt = `2026-08-${String(Math.min(index, 28)).padStart(2, "0")}T10:00:00.000Z`;
  const pricing = seedQuotePricing(estimatedHours, resourceIds, vocabulary, createdAt);
  const actualRatio = actualHours / estimatedHours;
  const actualCost = Math.round(pricing.totalCost * actualRatio);
  const billedValue = Math.round(pricing.proposedValue * (actualRatio > 1.1 ? 1.05 : 0.98));
  return {
    id: `seed-record-${index}`,
    recordNumber: `RS-2026-${num}`,
    company: `Cliente demo ${index}`,
    requester: "Contato técnico",
    createdAt,
    isDemo: true,
    partTraitIds: ["vocab-3"],
    resourceIds,
    estimatedEquipmentHours: pricing.estimatedEquipmentHours,
    estimatedCost: pricing.totalCost,
    proposedValue: pricing.proposedValue,
    quoteSnapshot: pricing.quoteSnapshot,
    assumptions: "Peça disponível e desenho técnico conferido.",
    estimatedBy: "João",
    serviceStatus: "COMPLETED",
    actualCost,
    billedValue,
    deliveredAt: `2026-08-${String(Math.min(index + 2, 28)).padStart(2, "0")}T16:00:00.000Z`,
    rework: false,
    scopeChange: false,
    deviationCauseId: "vocab-7",
    lesson: "Registrar tempo extra de fixação em peças com superfície livre.",
    relatedTopicIds: [serviceTypeId ?? "vocab-1"],
    visibility: "PUBLIC",
    lessonStatus: "FORMALIZED",
    service,
    serviceTypeId,
    estimatedHours,
    actualHours,
    ...rest,
  };
}

const EXTRA_VOCABULARY: VocabularyTerm[] = [
  {
    id: "vocab-7",
    label: "Fixação mais complexa que o previsto",
    class: "DEVIATION_CAUSE",
    guidance: "Tempo extra para preparar dispositivo ou acessar a região.",
    active: true,
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "vocab-8",
    label: "Programação subestimada",
    class: "DEVIATION_CAUSE",
    guidance: "Rotina de medição ou digitalização levou mais tempo que o estimado.",
    active: true,
    updatedAt: "2026-09-09T09:00:00.000Z",
  },
  {
    id: "vocab-9",
    label: "Engenharia reversa e reconstrução de modelos CAD",
    class: "SERVICE_TYPE",
    guidance: "Reconstrução CAD a partir de digitalização e modelos técnicos.",
    active: true,
    updatedAt: "2026-09-08T09:00:00.000Z",
  },
  {
    id: "vocab-20",
    label: "Nacionalização e desenvolvimento de componentes",
    class: "SERVICE_TYPE",
    guidance: "Adaptação e desenvolvimento de componentes para o contexto nacional.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-21",
    label: "Comparação entre modelo CAD e peça física",
    class: "SERVICE_TYPE",
    guidance: "Análise de conformidade entre modelo digital e peça medida.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-22",
    label: "Elaboração de mapas de desgaste",
    class: "SERVICE_TYPE",
    guidance: "Mapeamento e documentação de desgaste em componentes.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-23",
    label: "Tomografia industrial para inspeções internas não destrutivas",
    class: "SERVICE_TYPE",
    guidance: "Inspeção interna de peças sem destruição por tomografia.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-24",
    label: "Análise de falhas, quebras e anomalias",
    class: "SERVICE_TYPE",
    guidance: "Investigação técnica de falhas e anomalias em componentes.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-25",
    label: "Estruturação de árvores de equipamentos e identificação de peças críticas",
    class: "SERVICE_TYPE",
    guidance: "Organização de ativos e priorização de componentes críticos.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-26",
    label: "Criação de almoxarifado virtual e biblioteca digital de componentes",
    class: "SERVICE_TYPE",
    guidance: "Estruturação de biblioteca digital e almoxarifado virtual.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-27",
    label: "Elaboração de planos de manutenção e lubrificação",
    class: "SERVICE_TYPE",
    guidance: "Planos técnicos de manutenção e lubrificação de equipamentos.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-28",
    label: "Treinamentos técnicos",
    class: "SERVICE_TYPE",
    guidance: "Capacitação em manutenção, metrologia, engenharia reversa, lubrificação e análise de falhas.",
    active: true,
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "vocab-10",
    label: "ATOS Q 8M",
    class: "RESOURCE",
    guidance: "Scanner óptico ATOS Q 8M — tarifa da folha de custos.",
    active: true,
    updatedAt: "2026-09-07T09:00:00.000Z",
  },
  {
    id: "vocab-11",
    label: "BOSELLO MAX 80",
    class: "RESOURCE",
    guidance: "Tomógrafo industrial — tarifa da folha de custos.",
    active: true,
    updatedAt: "2026-09-06T09:00:00.000Z",
  },
  {
    id: "vocab-12",
    label: "Sala climatizada",
    class: "RESOURCE",
    guidance: "Custo horário alocado (energia, umidificação, climatização).",
    active: true,
    updatedAt: "2026-09-05T09:00:00.000Z",
    hourlyRate: 12,
  },
  {
    id: "vocab-16",
    label: "CMM O-INSPECT",
    class: "RESOURCE",
    guidance: "MMC óptica ZEISS O-Inspect.",
    active: true,
    updatedAt: "2026-09-07T09:00:00.000Z",
  },
  {
    id: "vocab-17",
    label: "CMM CONTURA",
    class: "RESOURCE",
    guidance: "MMC ZEISS CONTURA.",
    active: true,
    updatedAt: "2026-09-07T09:00:00.000Z",
  },
  {
    id: "vocab-18",
    label: "T-SCAN Hawk 2",
    class: "RESOURCE",
    guidance: "Scanner portátil T-SCAN Hawk 2.",
    active: true,
    updatedAt: "2026-09-07T09:00:00.000Z",
  },
  {
    id: "vocab-13",
    label: "CMM DuraMax",
    class: "RESOURCE",
    guidance: "MMC portátil ZEISS DuraMax — folha de custos.",
    active: true,
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "vocab-19",
    label: "ZEISS ZRE",
    class: "RESOURCE",
    guidance: "ZEISS Reverse Engineering — licença e posto de trabalho; tarifa da folha de custos.",
    active: true,
    updatedAt: "2026-09-18T09:00:00.000Z",
  },
  {
    id: "vocab-29",
    label: "Bambu Lab P1S",
    class: "RESOURCE",
    guidance: "Impressora 3D para protótipos em engenharia reversa.",
    active: true,
    updatedAt: "2026-09-21T09:00:00.000Z",
    hourlyRate: 42,
  },
  ...CARGILL_VOCABULARY_EXTRA,
];

const BASE_VOCABULARY = applyMachineTariffsToVocabulary(
  [
    ...DEMO_VOCABULARY.map((term) =>
      term.id === "vocab-5"
        ? { ...term, label: "CMM PRISMO", guidance: "MMC ZEISS PRISMO — folha de custos." }
        : term,
    ),
    ...EXTRA_VOCABULARY,
  ],
  MACHINE_TARIFF_SEED,
);

const INSPECTION_HOURS = [14, 16, 15, 18, 17, 16, 19, 15, 14, 20, 16, 18, 17, 15, 16];
const INSPECTION_ACTUAL = [17, 18, 16, 22, 19, 17, 21, 16, 15, 24, 18, 20, 19, 17, 18];

const formalizedInspectionRecords = INSPECTION_HOURS.map((estimated, index) =>
  buildFormalizedRecord(index + 10, {
    serviceTypeId: "vocab-1",
    service: "Inspeção dimensional",
    partTraitIds: index % 2 === 0 ? ["vocab-3"] : ["vocab-4"],
    estimatedHours: estimated,
    actualHours: INSPECTION_ACTUAL[index],
    lesson: index % 3 === 0
      ? "Fixação mais complexa que o previsto em superfícies livres."
      : "Programação de medição subestimada para tolerâncias apertadas.",
    deviationCauseId: index % 3 === 0 ? "vocab-7" : "vocab-8",
  }, BASE_VOCABULARY),
);

const otherFormalized: ServiceRecord[] = [
  buildFormalizedRecord(3, {
    serviceTypeId: "vocab-2",
    service: "Digitalização 3D",
    partTraitIds: ["vocab-3"],
    resourceIds: ["vocab-10", "vocab-12"],
    estimatedHours: 12,
    actualHours: 14,
    lesson: "Preparar mais tempo para alinhamento de marcações em peças escaneadas.",
    deviationCauseId: "vocab-7",
  }, BASE_VOCABULARY),
  buildFormalizedRecord(4, {
    serviceTypeId: "vocab-2",
    service: "Digitalização 3D",
    partTraitIds: ["vocab-4"],
    resourceIds: ["vocab-18", "vocab-12"],
    estimatedHours: 10,
    actualHours: 11,
    lesson: "Peças com tolerância apertada exigem mais pontos de referência.",
    deviationCauseId: "vocab-8",
  }, BASE_VOCABULARY),
  buildFormalizedRecord(5, {
    serviceTypeId: "vocab-9",
    service: "Engenharia reversa",
    partTraitIds: ["vocab-3"],
    resourceIds: ["vocab-10", "vocab-12"],
    estimatedHours: 24,
    actualHours: 28,
    lesson: "Incluir retrabalho de malha quando o acesso à região é limitado.",
    deviationCauseId: "vocab-7",
  }, BASE_VOCABULARY),
];

const record1CreatedAt = "2026-09-15T11:00:00.000Z";
const record1Stages = [
  {
    id: "record-1-stage-1",
    serviceTypeId: "vocab-2",
    label: "Digitalização 3D",
    resourceId: "vocab-10",
    resourceIds: ["vocab-10"],
    estimatedHours: 8,
    actualHours: null,
  },
  {
    id: "record-1-stage-2",
    serviceTypeId: "vocab-9",
    label: "Engenharia reversa",
    resourceId: "vocab-19",
    resourceIds: ["vocab-19"],
    estimatedHours: 12,
    actualHours: null,
  },
  {
    id: "record-1-stage-3",
    serviceTypeId: "vocab-1",
    label: "Inspeção dimensional (CMM)",
    resourceId: "vocab-5",
    resourceIds: ["vocab-5"],
    estimatedHours: 4,
    actualHours: null,
  },
];
const record1Snapshot = buildStageQuoteSnapshot({
  vocabulary: BASE_VOCABULARY,
  stages: record1Stages,
  labSettings: DEFAULT_LAB_SETTINGS,
});
record1Snapshot.savedAt = record1CreatedAt;
const record1Pricing = {
  totalCost: record1Snapshot.breakdown.suggestedPrice,
  proposedValue: record1Snapshot.breakdown.suggestedPrice,
  estimatedEquipmentHours: 24,
  quoteSnapshot: record1Snapshot,
};
const record2Pricing = seedQuotePricing(16, ["vocab-17", "vocab-12"], BASE_VOCABULARY, "2026-09-12T09:30:00.000Z");

export const SEED_VOCABULARY = BASE_VOCABULARY;

export const SEED_RECORDS: ServiceRecord[] = [
  {
    id: "record-1",
    recordNumber: "RS-2026-0001",
    requestId: "request-3",
    requestNumber: "SO-2026-0003",
    company: "Inova Moldes",
    service: "Scan + eng. reversa + inspeção CMM",
    requester: "Lucas Martins",
    createdAt: record1CreatedAt,
    isDemo: true,
    recordKind: "composite",
    serviceTypeId: "vocab-9",
    partTraitIds: ["vocab-3"],
    resourceIds: ["vocab-10", "vocab-19", "vocab-5"],
    stages: record1Stages,
    estimatedHours: 24,
    estimatedEquipmentHours: record1Pricing.estimatedEquipmentHours,
    estimatedCost: record1Pricing.totalCost,
    proposedValue: record1Pricing.proposedValue,
    quoteSnapshot: record1Pricing.quoteSnapshot,
    assumptions: "Serviço composto: scan, modelagem e validação dimensional no mesmo registro.",
    estimatedBy: "João",
    equipment: "ATOS Q 8M + CMM PRISMO",
    serviceStatus: "QUOTED",
    actualHours: null,
    actualCost: null,
    billedValue: null,
    deliveredAt: null,
    rework: false,
    scopeChange: false,
    deviationCauseId: null,
    lesson: "",
    relatedTopicIds: [],
    visibility: "PUBLIC",
    lessonStatus: "DRAFT",
  },
  {
    id: "record-2",
    recordNumber: "RS-2026-0002",
    company: "Metalúrgica Horizonte",
    service: "Inspeção dimensional — lote de 8 peças",
    requester: "Fernanda Rocha",
    createdAt: "2026-09-12T09:30:00.000Z",
    isDemo: true,
    recordKind: "batch",
    quantity: 8,
    batchLabel: "Lote eixos usinados 1–8",
    serviceTypeId: "vocab-1",
    partTraitIds: ["vocab-4"],
    resourceIds: ["vocab-17", "vocab-12"],
    estimatedHours: 16,
    estimatedEquipmentHours: record2Pricing.estimatedEquipmentHours,
    estimatedCost: record2Pricing.totalCost,
    proposedValue: record2Pricing.proposedValue,
    assumptions: "Desenho técnico atualizado será enviado junto com o lote.",
    estimatedBy: "João",
    equipment: "CMM CONTURA",
    serviceStatus: "DRAFT",
    actualHours: null,
    actualCost: null,
    billedValue: null,
    deliveredAt: null,
    rework: false,
    scopeChange: false,
    deviationCauseId: null,
    lesson: "",
    relatedTopicIds: [],
    visibility: "PUBLIC",
    lessonStatus: "DRAFT",
  },
  ...otherFormalized,
  ...formalizedInspectionRecords,
  ...CARGILL_DEMO_RECORDS,
];

export function createSeedState(): DemoState {
  return {
    seedVersion: DEMO_SEED_VERSION,
    requests: DEMO_REQUESTS,
    records: SEED_RECORDS,
    vocabulary: SEED_VOCABULARY,
    machineTariffs: MACHINE_TARIFF_SEED,
    labSettings: DEFAULT_LAB_SETTINGS,
    notifications: [
      {
        id: "notif-1",
        roles: ["ADMIN", "VALIDADOR"],
        message: "1 nova solicitação de orçamento aguardando análise.",
        href: "/solicitacoes",
        read: false,
        createdAt: "2026-09-18T08:42:00.000Z",
      },
    ],
  };
}
