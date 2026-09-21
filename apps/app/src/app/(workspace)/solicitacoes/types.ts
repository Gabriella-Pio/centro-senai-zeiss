export type RequestStatus = "NEW" | "ASSIGNED" | "CONVERTED" | "ARCHIVED";

export type QuoteRequest = {
  id: string;
  requestNumber: string;
  linkedRecordNumber?: string;
  linkedRecordId?: string;
  assignedToUserId?: string;
  assignedToName?: string;
  requester: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  receivedAt: string;
  status: RequestStatus;
  archiveReason?: string;
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  NEW: "Nova",
  ASSIGNED: "Atribuída",
  CONVERTED: "Convertida",
  ARCHIVED: "Arquivada",
};

export const REQUEST_STATUS_TABS: Array<{ id: "ALL" | RequestStatus; label: string }> = [
  { id: "NEW", label: "Nova" },
  { id: "ASSIGNED", label: "Atribuída" },
  { id: "CONVERTED", label: "Convertida" },
  { id: "ARCHIVED", label: "Arquivada" },
  { id: "ALL", label: "Todas" },
];
