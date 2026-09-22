export type UserRole = 'CONSULTA' | 'TECNICO' | 'VALIDADOR' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  mustChangePassword: boolean;
};

import {
  DEMO_CURRENT_USER_ID_KEY,
  DEMO_LOGGED_OUT_KEY,
  DEMO_MODE,
  // DEMO_USERS,
  DEMO_USERS_KEY,
  clearDemoUserCookie,
  // demoRole,
  // findDemoUserByEmail,
  // findDemoUserById,
  setDemoUserCookie,
  // type DemoUser,
} from './demo/demo';

import {
  DEMO_USERS,
  demoRole,
  findDemoUserByEmail,
  findDemoUserById,
  type DemoUser,
} from './demo/seed/users';

export const ROLE_LABELS: Record<UserRole, string> = {
  CONSULTA: 'Consulta',
  TECNICO: 'Técnico',
  VALIDADOR: 'Validador',
  ADMIN: 'Administrador',
};

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export { ApiError };

export async function apiRequest<T>(
  path: string,
  init: Omit<RequestInit, 'body'> & { body?: unknown } = {},
): Promise<T> {
  const { body, headers, ...options } = init;
  if (DEMO_MODE && typeof window !== 'undefined') {
    return demoRequest<T>(path, body);
  }
  const response = await fetch(`/api/v1/${path.replace(/^\//, '')}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? String(Array.isArray(payload.message) ? payload.message[0] : payload.message)
        : 'Não foi possível concluir a solicitação.';
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

function readDemoUsers(): DemoUser[] {
  const stored = window.localStorage.getItem(DEMO_USERS_KEY);
  if (!stored) {
    return [...DEMO_USERS];
  }
  try {
    return JSON.parse(stored) as DemoUser[];
  } catch {
    return [...DEMO_USERS];
  }
}

function writeDemoUsers(users: DemoUser[]) {
  window.localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event('cem-demo-users-changed'));
}

function currentDemoUser(): DemoUser {
  const storedId = window.localStorage.getItem(DEMO_CURRENT_USER_ID_KEY);
  if (storedId) {
    const match = findDemoUserById(storedId);
    if (match) {
      return match;
    }
  }
  return DEMO_USERS[0];
}

async function demoRequest<T>(path: string, body: unknown): Promise<T> {
  const payload = (body ?? {}) as Record<string, unknown>;
  if (path === '/auth/login') {
    const email = String(payload.email ?? '')
      .trim()
      .toLowerCase();
    const user = findDemoUserByEmail(email);
    if (!user) {
      throw new ApiError('E-mail ou senha inválidos.', 401);
    }
    window.localStorage.removeItem(DEMO_LOGGED_OUT_KEY);
    document.cookie = `${DEMO_LOGGED_OUT_KEY}=; path=/; max-age=0; samesite=lax`;
    window.localStorage.setItem(DEMO_CURRENT_USER_ID_KEY, user.id);
    setDemoUserCookie(user.id);
    return { user } as T;
  }
  if (path === '/auth/me') {
    return { user: currentDemoUser() } as T;
  }
  if (path === '/auth/logout' || path === '/auth/me/password') {
    window.localStorage.setItem(DEMO_LOGGED_OUT_KEY, '1');
    document.cookie = `${DEMO_LOGGED_OUT_KEY}=1; path=/; max-age=${8 * 60 * 60}; samesite=lax`;
    window.localStorage.removeItem(DEMO_CURRENT_USER_ID_KEY);
    clearDemoUserCookie();
    return { ok: true } as T;
  }

  const users = readDemoUsers();
  if (path === '/users' && payload.name) {
    const email = String(payload.email ?? '')
      .trim()
      .toLowerCase();
    if (users.some((user) => user.email === email)) {
      throw new ApiError('Já existe uma conta com este e-mail.', 409);
    }
    const created: DemoUser = {
      id: `demo-${Date.now()}`,
      name: String(payload.name).trim(),
      email,
      role: demoRole(payload.role),
      mustChangePassword: true,
      active: true,
      createdAt: new Date().toISOString(),
    };
    writeDemoUsers([...users, created]);
    return created as T;
  }

  const match = path.match(/^\/users\/([^/]+)$/);
  if (match) {
    const updated = users.map((user) =>
      user.id === match[1]
        ? {
            ...user,
            ...(payload.name === undefined ? {} : { name: String(payload.name).trim() }),
            ...(payload.email === undefined
              ? {}
              : { email: String(payload.email).trim().toLowerCase() }),
            ...(payload.role === undefined ? {} : { role: demoRole(payload.role) }),
            ...(payload.active === undefined ? {} : { active: Boolean(payload.active) }),
          }
        : user,
    );
    writeDemoUsers(updated);
    return updated.find((user) => user.id === match[1]) as T;
  }

  return {} as T;
}
