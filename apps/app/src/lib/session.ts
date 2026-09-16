import { cookies } from "next/headers";
import type { AuthUser } from "./api";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1").replace(
  /\/$/,
  "",
);

export async function getSessionUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get("cem_session")?.value;
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Cookie: `cem_session=${token}` },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { user: AuthUser };
  return payload.user;
}
