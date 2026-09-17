"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@cem/ui";
import { ApiError, ROLE_LABELS, apiRequest, type UserRole } from "@/lib/api";
import type { ListedUser } from "./types";

const ROLES: UserRole[] = ["CONSULTA", "TECNICO", "VALIDADOR", "ADMIN"];

export function CreateUserForm({
  onCreated,
  onCancel,
}: {
  onCreated?: (user: ListedUser) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("TECNICO");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setOk(null);
      setError("Preencha nome, e-mail e senha.");
      return;
    }
    if (password.length < 8) {
      setOk(null);
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setError(null);
    setOk(null);
    setPending(true);
    try {
      const created = await apiRequest<ListedUser>("/users", {
        method: "POST",
        body: { name: name.trim(), email: email.trim(), password, role },
      });
      setName("");
      setEmail("");
      setPassword("");
      setRole("TECNICO");
      if (onCreated) {
        onCreated(created);
      } else {
        setOk("Conta criada. A pessoa entra com o e-mail e a senha inicial.");
      }
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Não foi possível cadastrar. Tente de novo.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={(event) => void onSubmit(event)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="user-name" className="text-base">
            Nome
          </Label>
          <Input
            id="user-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 text-base"
            autoComplete="name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-email" className="text-base">
            E-mail
          </Label>
          <Input
            id="user-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 text-base"
            autoComplete="off"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-password" className="text-base">
            Senha inicial
          </Label>
          <Input
            id="user-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 text-base"
            required
          />
          <p className="text-sm text-muted-foreground">Mínimo 8 caracteres.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="user-role" className="text-base">
            Papel
          </Label>
          <select
            id="user-role"
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
            className="h-12 w-full rounded-(--radius) border border-input bg-transparent px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
          >
            {ROLES.map((value) => (
              <option key={value} value={value}>
                {ROLE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-3 pt-1">
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {ok ? (
          <p className="text-sm text-foreground" role="status">
            {ok}
          </p>
        ) : null}
        <div className="flex w-full flex-wrap justify-between gap-3">
          {onCancel ? (
            <Button type="button" variant="outline" size="xl" disabled={pending} onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" size="xl" disabled={pending} className="flex-1">
            {pending ? "Criando…" : "Criar conta"}
          </Button>
        </div>
      </div>
    </form>
  );
}
