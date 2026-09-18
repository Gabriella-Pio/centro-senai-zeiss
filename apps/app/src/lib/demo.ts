import type { AuthUser, UserRole } from "./api";

export type DemoUser = AuthUser & {
  active: boolean;
  createdAt: string;
};

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export const DEMO_CURRENT_USER_ID_KEY = "cem_demo_current_user_id";
export const DEMO_USER_COOKIE = "cem_demo_user_id";
export const DEMO_LOGGED_OUT_KEY = "cem_demo_logged_out";
export const DEMO_USERS_KEY = "cem_demo_users";

export const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-matheus",
    name: "Matheus",
    email: "matheus@laboratorio.local",
    role: "ADMIN",
    mustChangePassword: false,
    active: true,
    createdAt: "2026-09-01T09:00:00.000Z",
  },
  {
    id: "demo-sebastiao",
    name: "Sebastião",
    email: "sebastiao@laboratorio.local",
    role: "VALIDADOR",
    mustChangePassword: false,
    active: true,
    createdAt: "2026-09-03T09:00:00.000Z",
  },
  {
    id: "demo-joao",
    name: "João",
    email: "joao@laboratorio.local",
    role: "TECNICO",
    mustChangePassword: false,
    active: true,
    createdAt: "2026-09-05T09:00:00.000Z",
  },
  {
    id: "demo-consulta",
    name: "Estagiário",
    email: "consulta@laboratorio.local",
    role: "CONSULTA",
    mustChangePassword: false,
    active: true,
    createdAt: "2026-09-07T09:00:00.000Z",
  },
];

export const DEMO_CURRENT_USER = DEMO_USERS[0];

export function demoRole(value: unknown): UserRole {
  return value === "ADMIN" || value === "VALIDADOR" || value === "CONSULTA" ? value : "TECNICO";
}

export function getDemoUsers(): DemoUser[] {
  return DEMO_USERS;
}

export function findDemoUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return DEMO_USERS.find((user) => user.email === normalized && user.active) ?? null;
}

export function findDemoUserById(id: string) {
  return DEMO_USERS.find((user) => user.id === id && user.active) ?? null;
}

export function setDemoUserCookie(userId: string) {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = 8 * 60 * 60;
  document.cookie = `${DEMO_USER_COOKIE}=${userId}; path=/; max-age=${maxAge}; samesite=lax`;
}

export function clearDemoUserCookie() {
  if (typeof document === "undefined") {
    return;
  }
  document.cookie = `${DEMO_USER_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
