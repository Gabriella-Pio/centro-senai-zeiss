import { redirect } from "next/navigation";
import { ROLE_LABELS } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import { ProfileForm } from "./ProfileForm";
import { ShieldCheck } from "lucide-react";
import "./profile.css";

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return (parts[0] ?? "?").slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="profile-page">
      <header className="profile-page__header">
        <p className="profile-page__eyebrow">Conta pessoal</p>
        <h1 className="profile-page__title">Meu perfil</h1>
        <p className="profile-page__intro">
          Mantenha seus dados de acesso atualizados e proteja a entrada na área interna do laboratório.
        </p>
      </header>

      <div className="profile-page__layout">
        <aside className="profile-page__summary" aria-label="Resumo da conta">
          <span className="profile-page__avatar" aria-hidden="true">{initialsOf(user.name)}</span>
          <h2 className="profile-page__name">{user.name}</h2>
          <p className="profile-page__email">{user.email}</p>
          <span className="profile-page__role">{ROLE_LABELS[user.role]}</span>
          <dl className="profile-page__facts">
            <div className="profile-page__fact"><dt>Acesso</dt><dd>Área interna</dd></div>
            <div className="profile-page__fact"><dt>Situação</dt><dd>Ativa</dd></div>
          </dl>
          <p className="profile-page__hint">
            <ShieldCheck aria-hidden="true" />
            Seus dados de acesso são usados apenas para entrar na plataforma da equipe.
          </p>
        </aside>

        <section className="profile-page__editor" aria-label="Editar perfil">
          <ProfileForm user={user} />
        </section>
      </div>
    </main>
  );
}
