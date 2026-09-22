import type { DemoNotification } from "../demo-store-types";

export const SEED_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "notif-1",
    roles: ["ADMIN", "VALIDADOR"],
    message: "2 novas solicitações de orçamento aguardando análise.",
    href: "/solicitacoes",
    read: false,
    createdAt: "2026-09-21T10:30:00.000Z",
  },
];
