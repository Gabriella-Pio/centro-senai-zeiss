import type { AuthUser, UserRole } from '../../api';

export type DemoUser = AuthUser & {
  active: boolean;
  createdAt: string;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'demo-matheus',
    name: 'Matheus',
    email: 'matheus@laboratorio.local',
    role: 'ADMIN',
    mustChangePassword: false,
    active: true,
    createdAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'demo-sebastiao',
    name: 'Sebastião',
    email: 'sebastiao@laboratorio.local',
    role: 'VALIDADOR',
    mustChangePassword: false,
    active: true,
    createdAt: '2026-09-03T09:00:00.000Z',
  },
  {
    id: 'demo-joao',
    name: 'João',
    email: 'joao@laboratorio.local',
    role: 'TECNICO',
    mustChangePassword: false,
    active: true,
    createdAt: '2026-09-05T09:00:00.000Z',
  },
  {
    id: 'demo-consulta',
    name: 'Estagiário',
    email: 'consulta@laboratorio.local',
    role: 'CONSULTA',
    mustChangePassword: false,
    active: true,
    createdAt: '2026-09-07T09:00:00.000Z',
  },
];

export const DEMO_CURRENT_USER = DEMO_USERS[0];

export function getDemoUsers(): DemoUser[] {
  return DEMO_USERS.filter((user) => user.active);
}

export function findDemoUserByEmail(email: string): DemoUser | null {
  const normalized = email.trim().toLowerCase();

  return DEMO_USERS.find((user) => user.email.toLowerCase() === normalized && user.active) ?? null;
}

export function findDemoUserById(id: string): DemoUser | null {
  return DEMO_USERS.find((user) => user.id === id && user.active) ?? null;
}

export function demoRole(value: unknown): UserRole {
  switch (value) {
    case 'ADMIN':
    case 'VALIDADOR':
    case 'TECNICO':
    case 'CONSULTA':
      return value;

    default:
      return 'TECNICO';
  }
}
