import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  FileCheck2,
  LayoutDashboard,
  LockKeyhole,
  UserRound,
  UsersRound,
} from "lucide-react";
import { ROLE_LABELS } from "@/lib/api";
import { getSessionUser } from "@/lib/session";
import "./home.css";

export default async function InternalHomePage() {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const firstName = user.name.trim().split(/\s+/)[0] || "equipe";

  return (
    <main className="home-dashboard">
      <header className="home-dashboard__header">
        <div>
          <p className="home-dashboard__eyebrow">
            <LayoutDashboard aria-hidden="true" />
            Área da equipe
          </p>
          <h1 className="home-dashboard__title">Bom dia, {firstName}.</h1>
          <p className="home-dashboard__intro">
            Acompanhe o trabalho do laboratório e continue de onde parou. Você está acessando como {ROLE_LABELS[user.role]}.
          </p>
        </div>
        <p className="home-dashboard__date">17 de setembro de 2026</p>
      </header>

      <section className="home-dashboard__section" aria-labelledby="home-metrics-heading">
        <div className="home-dashboard__section-heading">
          <h2 id="home-metrics-heading" className="home-dashboard__section-title">Visão geral</h2>
          <p className="home-dashboard__section-note">Dados da demonstração</p>
        </div>
        <div className="home-dashboard__metrics">
          <article className="home-dashboard__metric home-dashboard__metric--attention">
            <span className="home-dashboard__metric-label">Pendentes</span>
            <strong className="home-dashboard__metric-value">04</strong>
            <span className="home-dashboard__metric-detail">aguardando atenção</span>
          </article>
          <article className="home-dashboard__metric">
            <span className="home-dashboard__metric-label">Em andamento</span>
            <strong className="home-dashboard__metric-value">08</strong>
            <span className="home-dashboard__metric-detail">registros ativos</span>
          </article>
          <article className="home-dashboard__metric">
            <span className="home-dashboard__metric-label">Validados</span>
            <strong className="home-dashboard__metric-value">27</strong>
            <span className="home-dashboard__metric-detail">neste mês</span>
          </article>
          <article className="home-dashboard__metric">
            <span className="home-dashboard__metric-label">Equipe</span>
            <strong className="home-dashboard__metric-value">04</strong>
            <span className="home-dashboard__metric-detail">contas cadastradas</span>
          </article>
        </div>
      </section>

      <section className="home-dashboard__section home-dashboard__grid" aria-label="Prioridades e atividade recente">
        <article className="home-dashboard__panel home-dashboard__panel--focus">
          <h2 className="home-dashboard__panel-title">Próximas ações</h2>
          <p className="home-dashboard__panel-copy">Há quatro itens que merecem atenção para manter o fluxo do laboratório em dia.</p>
          <ul className="home-dashboard__focus-list">
            <li className="home-dashboard__focus-item"><span className="home-dashboard__focus-icon"><ClipboardCheck aria-hidden="true" /></span><span>Revisar 2 registros aguardando validação</span></li>
            <li className="home-dashboard__focus-item"><span className="home-dashboard__focus-icon"><BookOpen aria-hidden="true" /></span><span>Completar 1 termo do vocabulário técnico</span></li>
            <li className="home-dashboard__focus-item"><span className="home-dashboard__focus-icon"><Clock3 aria-hidden="true" /></span><span>Retomar 1 registro salvo como rascunho</span></li>
          </ul>
          {user.role === "ADMIN" ? (
            <Link className="home-dashboard__link" href="/usuarios">Gerenciar equipe <ArrowRight aria-hidden="true" /></Link>
          ) : (
            <Link className="home-dashboard__link" href="/perfil">Abrir meu perfil <ArrowRight aria-hidden="true" /></Link>
          )}
        </article>

        <article className="home-dashboard__panel">
          <h2 className="home-dashboard__panel-title">Atividade recente</h2>
          <div className="home-dashboard__activity">
            <div className="home-dashboard__activity-item"><span className="home-dashboard__activity-mark"><FileCheck2 aria-hidden="true" /></span><p className="home-dashboard__activity-text">Registro de inspeção enviado para validação</p><p className="home-dashboard__activity-time">há 18 min</p></div>
            <div className="home-dashboard__activity-item"><span className="home-dashboard__activity-mark"><ClipboardList aria-hidden="true" /></span><p className="home-dashboard__activity-text">Novo rascunho criado por Ana Beatriz</p><p className="home-dashboard__activity-time">há 1 h</p></div>
            <div className="home-dashboard__activity-item"><span className="home-dashboard__activity-mark"><UsersRound aria-hidden="true" /></span><p className="home-dashboard__activity-text">Conta de Juliana Alves foi desativada</p><p className="home-dashboard__activity-time">ontem</p></div>
          </div>
          <Link className="home-dashboard__link" href="/perfil">Ver meu perfil <ArrowRight aria-hidden="true" /></Link>
        </article>
      </section>

      <section className="home-dashboard__section home-dashboard__quick-access" aria-labelledby="quick-access-heading">
        <div className="home-dashboard__section-heading">
          <h2 id="quick-access-heading" className="home-dashboard__section-title">Acesso rápido</h2>
          <p className="home-dashboard__section-note">Continue seu trabalho</p>
        </div>
        <div className="home-dashboard__quick-list">
          {user.role === "ADMIN" ? (
            <Link className="home-dashboard__quick-item" href="/usuarios">
              <span className="home-dashboard__quick-icon"><UsersRound aria-hidden="true" /></span>
              <span><strong>Equipe</strong><small>Contas e permissões</small></span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : null}
          <Link className="home-dashboard__quick-item" href="/perfil">
            <span className="home-dashboard__quick-icon"><UserRound aria-hidden="true" /></span>
            <span><strong>Meu perfil</strong><small>Dados e segurança</small></span>
            <ArrowRight aria-hidden="true" />
          </Link>
          <div className="home-dashboard__quick-item home-dashboard__quick-item--muted">
            <span className="home-dashboard__quick-icon"><LockKeyhole aria-hidden="true" /></span>
            <span><strong>Registros técnicos</strong><small>Próximo módulo da demonstração</small></span>
            <span className="home-dashboard__coming-soon">Em breve</span>
          </div>
        </div>
      </section>
    </main>
  );
}
