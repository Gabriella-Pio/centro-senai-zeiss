"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, ClipboardList, LayoutDashboard, Sparkles } from "lucide-react";
import type { UserRole } from "@/lib/api";
import { ROLE_LABELS } from "@/lib/api";
import { useDemoStore } from "@/lib/use-demo-store";

export function HomeDashboard({ role, name }: { role: UserRole; name: string }) {
  const { requests, records, vocabulary, notifications } = useDemoStore();
  const firstName = name.trim().split(/\s+/)[0] || "equipe";
  const newRequests = requests.filter((item) => item.status === "NEW").length;
  const pendingLessons = records.filter((item) => item.lessonStatus === "PENDING").length;
  const draftRecords = records.filter((item) => item.serviceStatus === "DRAFT").length;
  const unread = notifications.filter((item) => item.roles.includes(role) && !item.read).length;

  const actions =
    role === "ADMIN" || role === "VALIDADOR"
      ? [
          { icon: ClipboardCheck, text: `${newRequests} solicitações novas para analisar`, href: "/solicitacoes" },
          { icon: ClipboardCheck, text: `${pendingLessons} lições aguardando validação`, href: "/validacao" },
        ]
      : role === "TECNICO"
        ? [
            { icon: Sparkles, text: "Abrir Assistente para novo orçamento", href: "/assistente" },
            { icon: ClipboardList, text: `${draftRecords} registros em rascunho`, href: "/registros" },
          ]
        : [
            { icon: BookOpen, text: "Consultar vocabulário e indicadores", href: "/vocabulario" },
            { icon: Sparkles, text: "Ver recomendações do Assistente", href: "/assistente" },
          ];

  return (
    <main className="home-dashboard">
      <header className="home-dashboard__header">
        <div>
          <p className="home-dashboard__eyebrow"><LayoutDashboard aria-hidden="true" /> Área da equipe</p>
          <h1 className="home-dashboard__title">Bom dia, {firstName}.</h1>
          <p className="home-dashboard__intro">Você está acessando como {ROLE_LABELS[role]}.</p>
        </div>
        <p className="home-dashboard__date">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date())}</p>
      </header>

      <section className="home-dashboard__section" aria-labelledby="home-metrics-heading">
        <div className="home-dashboard__section-heading">
          <h2 id="home-metrics-heading" className="home-dashboard__section-title">Visão geral</h2>
          <p className="home-dashboard__section-note">Dados da demonstração</p>
        </div>
        <div className="home-dashboard__metrics">
          <article className="home-dashboard__metric home-dashboard__metric--attention">
            <span className="home-dashboard__metric-label">Pendentes</span>
            <strong className="home-dashboard__metric-value">{String(newRequests + pendingLessons).padStart(2, "0")}</strong>
            <span className="home-dashboard__metric-detail">aguardando atenção</span>
          </article>
          <article className="home-dashboard__metric">
            <span className="home-dashboard__metric-label">Registros</span>
            <strong className="home-dashboard__metric-value">{String(records.length).padStart(2, "0")}</strong>
            <span className="home-dashboard__metric-detail">na base demo</span>
          </article>
          <article className="home-dashboard__metric">
            <span className="home-dashboard__metric-label">Formalizados</span>
            <strong className="home-dashboard__metric-value">{String(records.filter((item) => item.lessonStatus === "FORMALIZED").length).padStart(2, "0")}</strong>
            <span className="home-dashboard__metric-detail">lições ativas</span>
          </article>
          <article className="home-dashboard__metric">
            <span className="home-dashboard__metric-label">Vocabulário</span>
            <strong className="home-dashboard__metric-value">{String(vocabulary.filter((item) => item.active).length).padStart(2, "0")}</strong>
            <span className="home-dashboard__metric-detail">termos ativos</span>
          </article>
        </div>
      </section>

      <section className="home-dashboard__section home-dashboard__grid">
        <article className="home-dashboard__panel home-dashboard__panel--focus">
          <h2 className="home-dashboard__panel-title">Próximas ações</h2>
          <ul className="home-dashboard__focus-list">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.href} className="home-dashboard__focus-item">
                  <span className="home-dashboard__focus-icon"><Icon aria-hidden="true" /></span>
                  <span>{action.text}</span>
                </li>
              );
            })}
            {unread > 0 ? <li className="home-dashboard__focus-item"><span className="home-dashboard__focus-icon"><ClipboardCheck aria-hidden="true" /></span><span>{unread} notificações não lidas</span></li> : null}
          </ul>
          <Link className="home-dashboard__link" href={actions[0]?.href ?? "/registros"}>Continuar trabalho <ArrowRight aria-hidden="true" /></Link>
        </article>

        <article className="home-dashboard__panel">
          <h2 className="home-dashboard__panel-title">Acesso rápido</h2>
          <div className="home-dashboard__quick-list">
            <Link className="home-dashboard__quick-item" href="/assistente"><span><strong>Assistente</strong><small>Orçamento assistido</small></span><ArrowRight aria-hidden="true" /></Link>
            <Link className="home-dashboard__quick-item" href="/registros"><span><strong>Registros</strong><small>Blocos A, B e C</small></span><ArrowRight aria-hidden="true" /></Link>
            <Link className="home-dashboard__quick-item" href="/indicadores"><span><strong>Indicadores</strong><small>Assertividade e desvios</small></span><ArrowRight aria-hidden="true" /></Link>
          </div>
        </article>
      </section>
    </main>
  );
}
