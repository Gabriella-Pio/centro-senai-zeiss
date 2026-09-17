"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@cem/ui";
import { ApiError, ROLE_LABELS, apiRequest, type UserRole } from "@/lib/api";
import type { ListedUser } from "./types";

const ROLES: UserRole[] = ["CONSULTA", "TECNICO", "VALIDADOR", "ADMIN"];

export function EditUserForm({ user, onCancel, onSaved }: { user: ListedUser; onCancel: () => void; onSaved: (user: ListedUser) => void }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [active, setActive] = useState(user.active);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const updated = await apiRequest<ListedUser>(`/users/${user.id}`, {
        method: "PATCH",
        body: { name: name.trim(), email: email.trim(), role, active, ...(password ? { password } : {}) },
      });
      onSaved(updated);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível atualizar a conta.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={(event) => void onSubmit(event)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="edit-user-name" className="text-base">Nome</Label><Input id="edit-user-name" value={name} onChange={(event) => setName(event.target.value)} className="h-12 text-base" required /></div>
        <div className="space-y-2"><Label htmlFor="edit-user-email" className="text-base">E-mail</Label><Input id="edit-user-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 text-base" required /></div>
        <div className="space-y-2"><Label htmlFor="edit-user-role" className="text-base">Papel</Label><select id="edit-user-role" value={role} onChange={(event) => setRole(event.target.value as UserRole)} className="h-12 w-full rounded-(--radius) border border-input bg-transparent px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50">{ROLES.map((value) => <option key={value} value={value}>{ROLE_LABELS[value]}</option>)}</select></div>
        <div className="space-y-2"><Label htmlFor="edit-user-password" className="text-base">Nova senha</Label><Input id="edit-user-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 text-base" placeholder="Opcional" autoComplete="new-password" /></div>
      </div>
      <label className="flex items-center gap-3 text-base"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Conta ativa</label>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" size="xl" disabled={pending} onClick={onCancel}>Cancelar</Button><Button type="submit" size="xl" disabled={pending}>{pending ? "Salvando…" : "Salvar alterações"}</Button></div>
    </form>
  );
}
