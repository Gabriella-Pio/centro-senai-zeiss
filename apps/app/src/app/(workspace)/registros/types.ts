export type ServiceRecordStatus = "DRAFT" | "IN_REVIEW" | "FORMALIZED";

export type ServiceRecord = {
  id: string;
  recordNumber: string;
  requestId?: string;
  requestNumber?: string;
  company: string;
  service: string;
  requester: string;
  equipment?: string;
  estimatedEquipmentHours: number | null;
  estimatedHours: number | null;
  assumptions: string;
  status: ServiceRecordStatus;
  createdAt: string;
};

export const RECORD_STATUS_LABELS: Record<ServiceRecordStatus, string> = {
  DRAFT: "Rascunho",
  IN_REVIEW: "Em validação",
  FORMALIZED: "Formalizado",
};
