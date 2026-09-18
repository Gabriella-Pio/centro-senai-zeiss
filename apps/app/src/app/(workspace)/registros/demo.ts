import type { ServiceRecord } from "./types";

export const DEMO_RECORDS_KEY = "cem_demo_service_records";

export const DEMO_EQUIPMENT = [
  "CMM ZEISS CONTURA",
  "Scanner 3D ATOS",
  "Tomógrafo industrial",
  "Sala climatizada",
] as const;

export const DEMO_RECORDS: ServiceRecord[] = [
  {
    id: "record-1",
    recordNumber: "RS-2026-0001",
    requestId: "request-3",
    requestNumber: "SO-2026-0003",
    company: "Inova Moldes",
    service: "Engenharia reversa",
    requester: "Lucas Martins",
    equipment: "Scanner 3D ATOS",
    estimatedEquipmentHours: 18,
    estimatedHours: 24,
    assumptions: "Peça disponível no laboratório e acesso às regiões principais garantido.",
    status: "IN_REVIEW",
    createdAt: "2026-09-15T11:00:00.000Z",
  },
  {
    id: "record-2",
    recordNumber: "RS-2026-0002",
    company: "Metalúrgica Horizonte",
    service: "Inspeção dimensional",
    requester: "Fernanda Rocha",
    equipment: "CMM ZEISS CONTURA",
    estimatedEquipmentHours: 12,
    estimatedHours: 16,
    assumptions: "Desenho técnico atualizado será enviado junto com o lote.",
    status: "DRAFT",
    createdAt: "2026-09-12T09:30:00.000Z",
  },
];
