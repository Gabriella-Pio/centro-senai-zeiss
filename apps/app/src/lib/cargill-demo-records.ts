import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import { DEFAULT_LAB_SETTINGS } from "./demo-store-types";
import { getMachineHourlyRate } from "./machine-tariff";
import { MACHINE_TARIFF_SEED } from "./machine-tariff-seed";
import { buildQuoteSnapshot } from "./pricing";

/** Versão do seed — incrementar quando os registros demo mudarem. */
export const DEMO_SEED_VERSION = 8;

const BATCH_QUANTITY = 16;

function resourceRate(resourceId: string) {
  const tariff = MACHINE_TARIFF_SEED.find((item) => item.resourceId === resourceId);
  if (tariff) {
    return getMachineHourlyRate(tariff);
  }
  if (resourceId === "vocab-12") {
    return 12;
  }
  return 0;
}

function seedQuotePricing(
  teamHours: number,
  resourceIds: string[],
  vocabulary: VocabularyTerm[],
  createdAt: string,
) {
  const equipmentHours = Math.round(teamHours * 0.6);
  const snapshot = buildQuoteSnapshot({
    vocabulary: vocabulary.map((term) => ({
      ...term,
      hourlyRate: term.hourlyRate ?? resourceRate(term.id),
    })),
    resourceIds,
    teamHours,
    equipmentHours,
    labSettings: DEFAULT_LAB_SETTINGS,
  });
  snapshot.savedAt = createdAt;
  return {
    totalCost: snapshot.breakdown.totalCost,
    proposedValue: snapshot.breakdown.suggestedPrice,
    estimatedEquipmentHours: equipmentHours,
    quoteSnapshot: snapshot,
  };
}

type FamilyKey = "BICO" | "BICO PIC" | "CARCACA DE BOMBA";

type FamilyConfig = {
  batchLabel: string;
  serviceLabel: string;
  partTraitIds: string[];
  resourceIds: string[];
  equipmentLabel: string;
  hoursPerPiece: number;
  actualRatio: number;
  measurementCount: number;
  outOfToleranceAvg: number;
  lesson: string;
  deviationCauseId: string;
  createdAt: string;
  deliveredAt: string;
};

const FAMILIES: Record<FamilyKey, FamilyConfig> = {
  BICO: {
    batchLabel: "Lote bicos injetor 1–16",
    serviceLabel: "Inspeção dimensional — Lote bicos injetor",
    partTraitIds: ["vocab-14"],
    resourceIds: ["vocab-13", "vocab-12"],
    equipmentLabel: "CMM DuraMax",
    hoursPerPiece: 5.5,
    actualRatio: 1.12,
    measurementCount: 1,
    outOfToleranceAvg: 1,
    lesson: "Fixação dedicada e conferência do programa Calypso antes de iniciar lote serializado.",
    deviationCauseId: "vocab-7",
    createdAt: "2026-06-20T10:00:00.000Z",
    deliveredAt: "2026-07-05T16:00:00.000Z",
  },
  "BICO PIC": {
    batchLabel: "Lote bicos PIC 1–16",
    serviceLabel: "Inspeção dimensional — Lote bicos PIC",
    partTraitIds: ["vocab-14", "vocab-4"],
    resourceIds: ["vocab-5", "vocab-12"],
    equipmentLabel: "CMM PRISMO",
    hoursPerPiece: 6.5,
    actualRatio: 1.15,
    measurementCount: 3,
    outOfToleranceAvg: 0,
    lesson: "Três distâncias no bico PIC exigem alinhamento cuidadoso do dispositivo em toda a campanha.",
    deviationCauseId: "vocab-8",
    createdAt: "2026-07-06T10:00:00.000Z",
    deliveredAt: "2026-07-21T16:00:00.000Z",
  },
  "CARCACA DE BOMBA": {
    batchLabel: "Lote carcaças de bomba 1–16",
    serviceLabel: "Inspeção dimensional — Lote carcaças de bomba",
    partTraitIds: ["vocab-15", "vocab-4"],
    resourceIds: ["vocab-5", "vocab-12"],
    equipmentLabel: "CMM PRISMO",
    hoursPerPiece: 14,
    actualRatio: 1.22,
    measurementCount: 12,
    outOfToleranceAvg: 7,
    lesson: "Carcaças com 12 características e desvios frequentes exigem buffer para retrabalho de programa.",
    deviationCauseId: "vocab-8",
    createdAt: "2026-07-22T10:00:00.000Z",
    deliveredAt: "2026-08-06T16:00:00.000Z",
  },
};

const CARGILL_VOCAB_STUB: VocabularyTerm[] = [
  { id: "vocab-5", label: "CMM PRISMO", class: "RESOURCE", guidance: "", active: true, updatedAt: "2026-06-20T09:00:00.000Z" },
  { id: "vocab-12", label: "Sala climatizada", class: "RESOURCE", guidance: "", active: true, updatedAt: "2026-06-20T09:00:00.000Z", hourlyRate: 12 },
  { id: "vocab-13", label: "CMM DuraMax", class: "RESOURCE", guidance: "", active: true, updatedAt: "2026-06-20T09:00:00.000Z" },
];

function buildCargillBatch(index: number, family: FamilyKey): ServiceRecord {
  const config = FAMILIES[family];
  const recordNum = String(100 + index).padStart(4, "0");
  const estimatedHours = Math.round(config.hoursPerPiece * BATCH_QUANTITY * 10) / 10;
  const actualHours = Math.round(estimatedHours * config.actualRatio * 10) / 10;
  const resourceIds = config.resourceIds;
  const pricing = seedQuotePricing(estimatedHours, resourceIds, CARGILL_VOCAB_STUB, config.createdAt);
  const actualRatio = actualHours / estimatedHours;

  return {
    id: `cargill-batch-${index}`,
    recordNumber: `RS-2026-${recordNum}`,
    company: "Cargill",
    requester: "Engenharia de processos",
    service: config.serviceLabel,
    createdAt: config.createdAt,
    isDemo: true,
    recordKind: "batch",
    quantity: BATCH_QUANTITY,
    batchLabel: config.batchLabel,
    serviceTypeId: "vocab-1",
    partTraitIds: config.partTraitIds,
    resourceIds,
    estimatedHours,
    estimatedEquipmentHours: pricing.estimatedEquipmentHours,
    estimatedCost: pricing.totalCost,
    proposedValue: pricing.proposedValue,
    quoteSnapshot: pricing.quoteSnapshot,
    assumptions: `Campanha de ${BATCH_QUANTITY} peças. Relatórios Calypso: média de ${config.measurementCount} características por peça, ~${config.outOfToleranceAvg} fora de tolerância, máquina ${config.equipmentLabel}. Média de ${config.hoursPerPiece} h/peça.`,
    estimatedBy: "João",
    equipment: config.equipmentLabel,
    serviceStatus: "COMPLETED",
    actualHours,
    actualCost: Math.round(pricing.totalCost * actualRatio),
    billedValue: Math.round(pricing.proposedValue * (actualRatio > 1.12 ? 1.04 : 0.98)),
    deliveredAt: config.deliveredAt,
    rework: config.outOfToleranceAvg >= 5,
    scopeChange: false,
    deviationCauseId: config.deviationCauseId,
    lesson: config.lesson,
    relatedTopicIds: ["vocab-1", ...config.partTraitIds],
    visibility: "PUBLIC",
    lessonStatus: "FORMALIZED",
  };
}

export const CARGILL_DEMO_RECORDS: ServiceRecord[] = [
  buildCargillBatch(1, "BICO"),
  buildCargillBatch(2, "BICO PIC"),
  buildCargillBatch(3, "CARCACA DE BOMBA"),
];

export const CARGILL_VOCABULARY_EXTRA = [
  {
    id: "vocab-14",
    label: "Peça serializada (lote)",
    class: "PART_TRAIT" as const,
    guidance: "Série de peças repetidas no mesmo programa — ex.: bicos Cargill.",
    active: true,
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
  {
    id: "vocab-15",
    label: "Geometria complexa",
    class: "PART_TRAIT" as const,
    guidance: "Múltiplas características e encaixes — ex.: carcaça de bomba.",
    active: true,
    updatedAt: "2026-06-20T09:00:00.000Z",
  },
];
