import type { DemoNotification } from "../demo-store-types";

export const SEED_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "notif-1",
    roles: ["ADMIN", "VALIDADOR"],
    message: "7 novas solicitações de orçamento aguardando análise.",
    href: "/solicitacoes",
    read: false,
    createdAt: "2026-06-24T12:00:00.000Z",
  },
];
