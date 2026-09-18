import type { UserRole } from "./api";
import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { QuoteRequest } from "@/app/(workspace)/solicitacoes/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import type { MachineTariff } from "./machine-tariff";

export type DemoNotification = {
  id: string;
  roles: UserRole[];
  message: string;
  href: string;
  read: boolean;
  createdAt: string;
};

export type LabSettings = {
  teamHourlyRate: number;
  targetMarginPercent: number;
  tariffTableLabel: string;
};

export type DemoState = {
  seedVersion?: number;
  requests: QuoteRequest[];
  records: ServiceRecord[];
  vocabulary: VocabularyTerm[];
  machineTariffs: MachineTariff[];
  notifications: DemoNotification[];
  labSettings: LabSettings;
};

export const DEFAULT_LAB_SETTINGS: LabSettings = {
  teamHourlyRate: 50,
  targetMarginPercent: 35,
  tariffTableLabel: "Folha de custos por máquina — set/2026",
};
