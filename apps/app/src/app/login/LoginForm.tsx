"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@cem/ui";
import { ApiError, apiRequest } from "@/lib/api";

const LOGIN_FAILED = "E-mail ou senha inválidos.";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Preencha o e-mail e a senha.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Confira o e-mail.");
      return;
    }

    setError(null);
    setPending(true);

    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: { email: trimmedEmail, password },
      });
      router.replace("/");
      router.refresh();
    } catch (caught) {
      const serverDown = caught instanceof ApiError && caught.status >= 500;
      setError(serverDown ? "Não foi possível entrar. Tente de novo." : LOGIN_FAILED);
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={(event) => void onSubmit(event)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base">
          E-mail
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-12 text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-base">
          Senha
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="h-12 text-base"
        />
      </div>
      <div className="space-y-3 pt-2">
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="xl" className="w-full" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta? Peça acesso ao administrador do laboratório.
        </p>
      </div>
    </form>
  );
}
