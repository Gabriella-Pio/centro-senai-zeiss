export type RequestStatus = "NEW" | "IN_REVIEW" | "CONVERTED" | "ARCHIVED";

export type QuoteRequest = {
  id: string;
  requestNumber: string;
  linkedRecordNumber?: string;
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
  IN_REVIEW: "Em análise",
  CONVERTED: "Convertida em registro",
  ARCHIVED: "Arquivada",
};
