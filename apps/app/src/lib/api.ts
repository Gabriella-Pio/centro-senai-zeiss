export type UserRole = "CONSULTA" | "TECNICO" | "VALIDADOR" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  CONSULTA: "Consulta",
  TECNICO: "Técnico",
  VALIDADOR: "Validador",
  ADMIN: "Administrador",
};

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export { ApiError };

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { body?: unknown } = {},
): Promise<T> {
  const { body, headers, ...options } = init;
  const response = await fetch(`/api/v1/${path.replace(/^\//, "")}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(Array.isArray(payload.message) ? payload.message[0] : payload.message)
        : "Não foi possível concluir a solicitação.";
    throw new ApiError(message, response.status);
  }

  return payload as T;
}
