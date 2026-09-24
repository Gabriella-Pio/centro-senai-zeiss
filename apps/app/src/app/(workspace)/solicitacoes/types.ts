export type RequestStatus = "NEW" | "ON_GOING" | "CONVERTED" | "ARCHIVED";

export type QuoteRequest = {
  id: string;
  /** ID do lead no Postgres, quando a solicitação veio da vitrine. */
  leadId?: string;
  requestNumber: string;
  linkedRecordNumber?: string;
  linkedRecordId?: string;
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
  ON_GOING: "Em andamento",
  CONVERTED: "Convertida",
  ARCHIVED: "Arquivada",
};

export const REQUEST_STATUS_TABS: Array<{ id: "ALL" | RequestStatus; label: string }> = [
  { id: "NEW", label: "Novas" },
  { id: "ON_GOING", label: "Em andamento" },
  { id: "CONVERTED", label: "Convertida" },
  { id: "ARCHIVED", label: "Arquivada" },
  { id: "ALL", label: "Todas" },
];
