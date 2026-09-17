import type { AuthUser, UserRole } from "./api";

export type DemoUser = AuthUser & {
  active: boolean;
  createdAt: string;
};

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export const DEMO_CURRENT_USER: DemoUser = {
  id: "demo-admin",
  name: "Marina Costa",
  email: "marina.costa@laboratorio.local",
  role: "ADMIN",
  mustChangePassword: false,
  active: true,
  createdAt: "2026-09-01T09:00:00.000Z",
};

export const DEMO_USERS: DemoUser[] = [
  DEMO_CURRENT_USER,
  {
    id: "demo-ana",
    name: "Ana Beatriz Lima",
    email: "ana.lima@laboratorio.local",
    role: "TECNICO",
    mustChangePassword: false,
    active: true,
    createdAt: "2026-09-03T09:00:00.000Z",
  },
  {
    id: "demo-carlos",
    name: "Carlos Mendes",
    email: "carlos.mendes@laboratorio.local",
    role: "VALIDADOR",
    mustChangePassword: false,
    active: true,
    createdAt: "2026-09-05T09:00:00.000Z",
  },
  {
    id: "demo-juliana",
    name: "Juliana Alves",
    email: "juliana.alves@laboratorio.local",
    role: "CONSULTA",
    mustChangePassword: false,
    active: false,
    createdAt: "2026-09-07T09:00:00.000Z",
  },
];

export const DEMO_USERS_KEY = "cem_demo_users";
export const DEMO_LOGGED_OUT_KEY = "cem_demo_logged_out";

export function demoRole(value: unknown): UserRole {
  return value === "ADMIN" || value === "VALIDADOR" || value === "CONSULTA" ? value : "TECNICO";
}

export function getDemoUsers(): DemoUser[] {
  return DEMO_USERS;
}
