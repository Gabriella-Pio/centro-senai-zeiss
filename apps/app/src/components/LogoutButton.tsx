"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@cem/ui";
import { apiRequest } from "@/lib/api";
import { DEMO_LOGGED_OUT_KEY, DEMO_MODE, clearDemoUserCookie } from "@/lib/demo";
import { ConfirmDialog } from "./ConfirmDialog";

export function LogoutButton({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function onLogout() {
    if (DEMO_MODE) {
      window.localStorage.setItem(DEMO_LOGGED_OUT_KEY, "1");
      document.cookie = `${DEMO_LOGGED_OUT_KEY}=1; path=/; max-age=${8 * 60 * 60}; samesite=lax`;
      clearDemoUserCookie();
    }
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Even if the API is down, drop the local session view.
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon-lg" : "lg"}
        className={className}
        aria-label="Sair"
        title="Sair"
        onClick={() => setOpen(true)}
      >
        <LogOut aria-hidden="true" />
        {compact ? null : "Sair"}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Sair da área da equipe?"
        description="A sessão encerra e você vai precisar entrar de novo."
        confirmLabel="Sair"
        pendingLabel="Saindo…"
        onConfirm={onLogout}
      />
    </>
  );
}
