"use client";

import { useRouter } from "next/navigation";
import { Button } from "@cem/ui";
import { apiRequest } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Even if the API is down, drop the local session view.
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="lg" onClick={() => void onLogout()}>
      Sair
    </Button>
  );
}
