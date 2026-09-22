export type LessonStatus = "DRAFT" | "PENDING" | "FORMALIZED" | "SUPERSEDED";
export type ServiceStatus = "DRAFT" | "QUOTED" | "COMPLETED";
export type RecordVisibility = "PUBLIC" | "RESTRICTED";
export type RecordKind = "single" | "batch" | "composite";

import type { QuoteSnapshot } from "@/lib/pricing";

export type ServiceStage = {
  id: string;
  serviceTypeId: string;
  label: string;
  /** Recurso principal da etapa (equipamento ou ambiente). */
  resourceId?: string | null;
  /** Legado — preferir `resourceId`. */
  resourceIds: string[];
  estimatedHours: number | null;
  actualHours: number | null;
};

export type ServiceRecord = {
  id: string;
  recordNumber: string;
  requestId?: string;
  requestNumber?: string;
  company: string;
  service: string;
  requester: string;
  createdAt: string;
  isDemo: boolean;
  recordKind?: RecordKind;
  quantity?: number;
  batchLabel?: string;
  hoursPackageRef?: string;
  stages?: ServiceStage[];

  // Bloco A — orçado
  serviceTypeId?: string;
  partTraitIds: string[];
  resourceIds: string[];
  estimatedHours: number | null;
  estimatedCost: number | null;
  proposedValue: number | null;
  assumptions: string;
  estimatedBy?: string;
  estimationOverrideReason?: string;
  priceOverrideReason?: string;
  equipment?: string;
  quoteSnapshot?: QuoteSnapshot;

  serviceStatus: ServiceStatus;

  // Bloco B — realizado
  actualHours: number | null;
  actualCost: number | null;
  billedValue: number | null;
  deliveredAt: string | null;
  rework: boolean;
  scopeChange: boolean;

  // Bloco C — aprendizado
  deviationCauseId: string | null;
  lesson: string;
  relatedTopicIds: string[];
  visibility: RecordVisibility;
  lessonStatus: LessonStatus;
};

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  DRAFT: "Rascunho",
  QUOTED: "Orçado / em execução",
  COMPLETED: "Concluído",
};

export const SERVICE_STATUS_BADGE_LABELS: Record<ServiceStatus, string> = {
  DRAFT: "Rascunho",
  QUOTED: "Orçado",
  COMPLETED: "Concluído",
};

export const SERVICE_STATUS_TABS: Array<{ id: "ALL" | ServiceStatus; label: string }> = [
  { id: "DRAFT", label: "Rascunho" },
  { id: "QUOTED", label: "Orçado" },
  { id: "COMPLETED", label: "Concluído" },
  { id: "ALL", label: "Todos" },
];

export const LESSON_STATUS_LABELS: Record<LessonStatus, string> = {
  DRAFT: "Rascunho",
  PENDING: "Em validação",
  FORMALIZED: "Formalizada",
  SUPERSEDED: "Superada",
};

export const VISIBILITY_LABELS: Record<RecordVisibility, string> = {
  PUBLIC: "Interno público",
  RESTRICTED: "Restrito",
};
