export type LessonStatus = "DRAFT" | "PENDING" | "FORMALIZED" | "SUPERSEDED";
export type ServiceStatus = "DRAFT" | "QUOTED" | "COMPLETED";
export type RecordVisibility = "PUBLIC" | "RESTRICTED";

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

  // Bloco A — orçado
  serviceTypeId?: string;
  partTraitIds: string[];
  resourceIds: string[];
  estimatedHours: number | null;
  estimatedEquipmentHours: number | null;
  estimatedCost: number | null;
  proposedValue: number | null;
  assumptions: string;
  estimatedBy?: string;
  estimationOverrideReason?: string;
  equipment?: string;

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
