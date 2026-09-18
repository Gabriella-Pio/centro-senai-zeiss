import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import { DEMO_REQUESTS } from "@/app/(workspace)/solicitacoes/demo";
import { DEMO_VOCABULARY } from "@/app/(workspace)/vocabulario/demo";
import type { DemoState } from "./demo-store-types";

type FormalizedSeed = Partial<ServiceRecord> & {
  serviceTypeId: string;
  service: string;
  estimatedHours: number;
  actualHours: number;
};

function buildFormalizedRecord(index: number, overrides: FormalizedSeed): ServiceRecord {
  const num = String(index).padStart(4, "0");
  const { service, serviceTypeId, estimatedHours, actualHours, ...rest } = overrides;
  return {
    id: `seed-record-${index}`,
    recordNumber: `RS-2026-${num}`,
    company: `Cliente demo ${index}`,
    requester: "Contato técnico",
    createdAt: `2026-08-${String(Math.min(index, 28)).padStart(2, "0")}T10:00:00.000Z`,
    isDemo: true,
    partTraitIds: ["vocab-3"],
    resourceIds: ["vocab-5"],
    estimatedEquipmentHours: Math.round(estimatedHours * 0.6),
    estimatedCost: estimatedHours * 180,
    proposedValue: estimatedHours * 320,
    assumptions: "Peça disponível e desenho técnico conferido.",
    estimatedBy: "João",
    serviceStatus: "COMPLETED",
    actualCost: actualHours * 185,
    billedValue: actualHours * 310,
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
  }),
);

const otherFormalized: ServiceRecord[] = [
  buildFormalizedRecord(3, {
    serviceTypeId: "vocab-2",
    service: "Digitalização 3D",
    partTraitIds: ["vocab-3"],
    estimatedHours: 12,
    actualHours: 14,
    lesson: "Preparar mais tempo para alinhamento de marcações em peças escaneadas.",
    deviationCauseId: "vocab-7",
  }),
  buildFormalizedRecord(4, {
    serviceTypeId: "vocab-2",
    service: "Digitalização 3D",
    partTraitIds: ["vocab-4"],
    estimatedHours: 10,
    actualHours: 11,
    lesson: "Peças com tolerância apertada exigem mais pontos de referência.",
    deviationCauseId: "vocab-8",
  }),
  buildFormalizedRecord(5, {
    serviceTypeId: "vocab-9",
    service: "Engenharia reversa",
    partTraitIds: ["vocab-3"],
    estimatedHours: 24,
    actualHours: 28,
    lesson: "Incluir retrabalho de malha quando o acesso à região é limitado.",
    deviationCauseId: "vocab-7",
  }),
];

export const SEED_RECORDS: ServiceRecord[] = [
  {
    id: "record-1",
    recordNumber: "RS-2026-0001",
    requestId: "request-3",
    requestNumber: "SO-2026-0003",
    company: "Inova Moldes",
    service: "Engenharia reversa",
    requester: "Lucas Martins",
    createdAt: "2026-09-15T11:00:00.000Z",
    isDemo: true,
    serviceTypeId: "vocab-9",
    partTraitIds: ["vocab-3"],
    resourceIds: ["vocab-10"],
    estimatedHours: 24,
    estimatedEquipmentHours: 18,
    estimatedCost: 4320,
    proposedValue: 7680,
    assumptions: "Peça disponível no laboratório e acesso às regiões principais garantido.",
    estimatedBy: "João",
    equipment: "Scanner 3D ATOS",
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
    service: "Inspeção dimensional",
    requester: "Fernanda Rocha",
    createdAt: "2026-09-12T09:30:00.000Z",
    isDemo: true,
    serviceTypeId: "vocab-1",
    partTraitIds: ["vocab-4"],
    resourceIds: ["vocab-5"],
    estimatedHours: 16,
    estimatedEquipmentHours: 12,
    estimatedCost: 2880,
    proposedValue: 5120,
    assumptions: "Desenho técnico atualizado será enviado junto com o lote.",
    estimatedBy: "João",
    equipment: "CMM ZEISS CONTURA",
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
];

export const SEED_VOCABULARY = [
  ...DEMO_VOCABULARY,
  {
    id: "vocab-7",
    label: "Fixação mais complexa que o previsto",
    class: "DEVIATION_CAUSE" as const,
    guidance: "Tempo extra para preparar dispositivo ou acessar a região.",
    active: true,
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "vocab-8",
    label: "Programação subestimada",
    class: "DEVIATION_CAUSE" as const,
    guidance: "Rotina de medição ou digitalização levou mais tempo que o estimado.",
    active: true,
    updatedAt: "2026-09-09T09:00:00.000Z",
  },
  {
    id: "vocab-9",
    label: "Engenharia reversa",
    class: "SERVICE_TYPE" as const,
    guidance: "Reconstrução CAD a partir de digitalização.",
    active: true,
    updatedAt: "2026-09-08T09:00:00.000Z",
  },
  {
    id: "vocab-10",
    label: "Scanner 3D ATOS",
    class: "RESOURCE" as const,
    guidance: "Equipamento para digitalização de superfícies.",
    active: true,
    updatedAt: "2026-09-07T09:00:00.000Z",
  },
];

export function createSeedState(): DemoState {
  return {
    requests: DEMO_REQUESTS,
    records: SEED_RECORDS,
    vocabulary: SEED_VOCABULARY,
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
