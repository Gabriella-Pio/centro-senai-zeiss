"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@cem/ui";
import { ApiError, apiRequest, type AuthUser } from "@/lib/api";
import { KeyRound, UserRound } from "lucide-react";

export function ProfileForm({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"personal" | "security">("personal");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const emailChanged = email.trim().toLowerCase() !== user.email;
    if ((emailChanged || newPassword) && !currentPassword) {
      setError("Informe a senha atual para alterar o e-mail ou a senha.");
      return;
    }
    if (user.mustChangePassword && !newPassword) {
      setError("Defina uma nova senha para continuar.");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setPending(true);
    try {
      if (name.trim() !== user.name || emailChanged) {
        await apiRequest("/auth/me", {
          method: "PATCH",
          body: {
            name: name.trim(),
            email: email.trim(),
            ...(emailChanged ? { currentPassword } : {}),
          },
        });
      }
      if (newPassword) {
        await apiRequest("/auth/me/password", {
          method: "PATCH",
          body: { currentPassword, newPassword },
        });
      }
      setCurrentPassword("");
      setNewPassword("");
      setNotice("Perfil atualizado com sucesso.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Não foi possível atualizar o perfil.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="profile-form space-y-7" onSubmit={(event) => void onSubmit(event)} noValidate>
      <div className="profile-form__tabs" role="tablist" aria-label="Seções do perfil">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "personal"}
          className={activeTab === "personal" ? "profile-form__tab profile-form__tab--active" : "profile-form__tab"}
          onClick={() => setActiveTab("personal")}
        >
          <UserRound aria-hidden="true" />
          Dados pessoais
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "security"}
          className={activeTab === "security" ? "profile-form__tab profile-form__tab--active" : "profile-form__tab"}
          onClick={() => setActiveTab("security")}
        >
          <KeyRound aria-hidden="true" />
          Segurança
          {user.mustChangePassword ? <span className="profile-form__tab-alert">Ação necessária</span> : null}
        </button>
      </div>

      {activeTab === "personal" ? <div className="profile-form__section">
        <div className="profile-form__section-heading">
          <span className="profile-form__section-icon"><UserRound aria-hidden="true" /></span>
          <div>
            <h2 className="profile-form__section-title">Dados pessoais</h2>
            <p className="profile-form__section-copy">Essas informações identificam você para a equipe.</p>
          </div>
        </div>
        <div className="grid gap-5 pt-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-name" className="text-base">Nome</Label>
          <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} className="h-12 text-base" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email" className="text-base">E-mail</Label>
          <Input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 text-base" required />
        </div>
        </div>
      </div> : null}

      {activeTab === "security" ? <div className="profile-form__section profile-form__section--security">
        <div className="profile-form__section-heading">
          <span className="profile-form__section-icon"><KeyRound aria-hidden="true" /></span>
          <div>
            <h2 className="profile-form__section-title">Segurança</h2>
            <p className="profile-form__section-copy">
          {user.mustChangePassword
            ? "A senha inicial precisa ser substituída antes de continuar."
            : "Deixe os campos novos vazios para manter a senha atual."}
            </p>
          </div>
        </div>
        <div className="grid gap-5 pt-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profile-current-password" className="text-base">Senha atual</Label>
            <Input id="profile-current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="h-12 text-base" autoComplete="current-password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-new-password" className="text-base">Nova senha</Label>
            <Input id="profile-new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-12 text-base" autoComplete="new-password" />
          </div>
        </div>
      </div> : null}
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      {notice ? <p className="text-sm text-foreground" role="status">{notice}</p> : null}
      <Button type="submit" size="xl" disabled={pending}>{pending ? "Salvando…" : "Salvar alterações"}</Button>
    </form>
  );
}
