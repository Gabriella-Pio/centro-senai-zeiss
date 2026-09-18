import type { UserRole } from "./api";
import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { QuoteRequest } from "@/app/(workspace)/solicitacoes/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";

export type DemoNotification = {
  id: string;
  roles: UserRole[];
  message: string;
  href: string;
  read: boolean;
  createdAt: string;
};

export type DemoState = {
  requests: QuoteRequest[];
  records: ServiceRecord[];
  vocabulary: VocabularyTerm[];
  notifications: DemoNotification[];
};
