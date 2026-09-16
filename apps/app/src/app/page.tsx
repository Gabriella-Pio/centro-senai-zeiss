import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ROLE_LABELS } from "@/lib/api";
import { getSessionUser } from "@/lib/session";

export default async function InternalHomePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-svh bg-background">
      <AppHeader user={user} />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">Área da equipe</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
          Você está na área da equipe como {ROLE_LABELS[user.role]}.
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Ainda não há telas de vocabulário, registros ou usuários. Esta fatia é só a porta: entrar,
          ver quem você é, e sair.
        </p>
      </main>
    </div>
  );
}
