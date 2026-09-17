import { cookies } from "next/headers";
import { ApiError, type AuthUser } from "./api";
import { DEMO_CURRENT_USER, DEMO_LOGGED_OUT_KEY, DEMO_MODE } from "./demo";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1").replace(
  /\/$/,
  "",
);

async function cookieHeader(): Promise<HeadersInit> {
  const token = (await cookies()).get("cem_session")?.value;
  return token ? { Cookie: `cem_session=${token}` } : {};
}
export async function getSessionUser(): Promise<AuthUser | null> {
  if (DEMO_MODE) {
    if (typeof window !== "undefined" && window.localStorage.getItem(DEMO_LOGGED_OUT_KEY) === "1") {
      return null;
    }
    return DEMO_CURRENT_USER;
  }
  const token = (await cookies()).get("cem_session")?.value;
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: await cookieHeader(),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { user: AuthUser };
  return payload.user;
}

export async function serverApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${path.replace(/^\//, "")}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(await cookieHeader()),
      ...init.headers,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(Array.isArray(payload.message) ? payload.message[0] : payload.message)
        : "Não foi possível concluir a solicitação.";
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

