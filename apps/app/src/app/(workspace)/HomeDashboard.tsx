"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BookOpen,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import type { UserRole } from "@/lib/api";
import { ROLE_LABELS } from "@/lib/api";
import {
  buildConfidenceDonut,
  buildEffortTrend,
  computeAssertivenessRate,
} from "@/lib/chart-data";
import { computeIndicators } from "@/lib/indicators";
import { canViewRecord, isDemoFormalizedCase } from "@/lib/formalized-knowledge";
import { useDemoStore } from "@/lib/use-demo-store";
import { DonutChart } from "@/components/charts/DonutChart";
import { EffortTrendChart } from "@/components/charts/EffortTrendChart";
import { KpiCard } from "@/components/charts/KpiCard";
import "./home.css";

export function HomeDashboard({ role, name }: { role: UserRole; name: string }) {
  const { requests, records, vocabulary, notifications, labSettings } = useDemoStore();
  const firstName = name.trim().split(/\s+/)[0] || "equipe";
  const visibleRecords = useMemo(
    () => records.filter((record) => canViewRecord(record, role)),
    [records, role],
  );

  const newRequests = requests.filter((item) => item.status === "NEW").length;
  const ongoingRequests = requests.filter((item) => item.status === "ON_GOING").length;
  const pendingLessons = records.filter((item) => item.lessonStatus === "PENDING").length;
  const draftRecords = records.filter((item) => item.serviceStatus === "DRAFT").length;
  const formalized = visibleRecords.filter(isDemoFormalizedCase).length;
  const unread = notifications.filter((item) => item.roles.includes(role) && !item.read).length;

  const summary = useMemo(
    () => computeIndicators(visibleRecords, vocabulary, labSettings),
    [visibleRecords, vocabulary, labSettings],
  );
  const effortTrend = useMemo(() => buildEffortTrend(visibleRecords), [visibleRecords]);
  const confidenceDonut = useMemo(
    () => buildConfidenceDonut(visibleRecords, vocabulary),
    [visibleRecords, vocabulary],
  );
  const assertiveness = useMemo(() => computeAssertivenessRate(visibleRecords), [visibleRecords]);
  const sparkline = effortTrend.map((point) => point.actual);

  const pendingLabel =
    role === "ADMIN" || role === "VALIDADOR"
      ? `${newRequests + ongoingRequests + pendingLessons} itens`
      : role === "TECNICO"
        ? `${draftRecords} rascunhos`
        : `${formalized} lições`;

  const actions =
    role === "ADMIN" || role === "VALIDADOR"
      ? [
          { icon: ClipboardCheck, text: `${newRequests} solicitações novas`, href: "/solicitacoes" },
          { icon: ClipboardCheck, text: `${pendingLessons} lições aguardando validação`, href: "/validacao" },
        ]
      : role === "TECNICO"
        ? [
            { icon: ClipboardList, text: "Abrir registros para orçar", href: "/registros" },
            { icon: Sparkles, text: `${draftRecords} registros em rascunho`, href: "/registros" },
          ]
        : [
            { icon: BookOpen, text: "Consultar vocabulário e indicadores", href: "/vocabulario" },
            { icon: ClipboardList, text: "Consultar registros e histórico", href: "/registros" },
          ];

  const confidenceTotal = confidenceDonut.reduce((sum, slice) => sum + slice.value, 0);
  const highConfidence = confidenceDonut.find((slice) => slice.label === "Alta")?.value ?? 0;
  const confidencePercent = confidenceTotal > 0 ? Math.round((highConfidence / confidenceTotal) * 100) : 0;

  return (
    <main className="home-dashboard">
      <header className="home-dashboard__header">
        <div>
          <p className="home-dashboard__eyebrow"><LayoutDashboard aria-hidden="true" /> Área da equipe</p>
          <h1 className="home-dashboard__title">Bom dia, {firstName}.</h1>
          <p className="home-dashboard__intro">
            Painel de gestão do conhecimento em orçamentação · {ROLE_LABELS[role]}
          </p>
        </div>
        <p className="home-dashboard__date">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date())}</p>
      </header>

      <section className="home-dashboard__section" aria-labelledby="home-metrics-heading">
        <div className="home-dashboard__section-heading">
          <h2 id="home-metrics-heading" className="home-dashboard__section-title">Indicadores-chave</h2>
          <p className="home-dashboard__section-note">Base de demonstração</p>
        </div>
        <div className="home-dashboard__metrics">
          <KpiCard
            label="Assertividade"
            value={`${assertiveness}%`}
            detail="Casos dentro de ±15% de desvio"
            icon={Target}
            highlight
            sparkline={sparkline}
          />
          <KpiCard
            label="Margem média"
            value={`${summary.averageMarginPercent}%`}
            detail={`Meta do laboratório: ${summary.targetMarginPercent}%`}
            icon={TrendingUp}
          />
          <KpiCard
            label="Formalizados"
            value={String(formalized).padStart(2, "0")}
            detail="Lições que alimentam o Assistente"
            icon={ChartColumn}
          />
          <KpiCard
            label="Pendentes"
            value={pendingLabel}
            detail={role === "TECNICO" ? "Registros para completar" : "Aguardando sua ação"}
            icon={ClipboardCheck}
            highlight={newRequests + ongoingRequests + pendingLessons + draftRecords > 0}
          />
        </div>
      </section>

      <section className="dashboard-charts">
        <EffortTrendChart data={effortTrend} />
        <DonutChart
          title="Confiança por tipo de serviço"
          subtitle="Quantos serviços têm histórico robusto no Assistente"
          slices={confidenceDonut}
          centerLabel={`${confidencePercent}%`}
        />
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
            {unread > 0 ? (
              <li className="home-dashboard__focus-item">
                <span className="home-dashboard__focus-icon"><ClipboardCheck aria-hidden="true" /></span>
                <span>{unread} notificações não lidas</span>
              </li>
            ) : null}
          </ul>
          <Link className="home-dashboard__link" href={actions[0]?.href ?? "/registros"}>
            Continuar trabalho <ArrowRight aria-hidden="true" />
          </Link>
        </article>

        <article className="home-dashboard__panel">
          <h2 className="home-dashboard__panel-title">Acesso rápido</h2>
          <div className="home-dashboard__quick-list">
            <Link className="home-dashboard__quick-item" href="/registros">
              <span className="home-dashboard__quick-icon"><Sparkles aria-hidden="true" /></span>
              <span><strong>Orçamentos</strong><small>Assistente integrado ao bloco A</small></span>
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="home-dashboard__quick-item" href="/registros">
              <span className="home-dashboard__quick-icon"><ClipboardList aria-hidden="true" /></span>
              <span><strong>Registros</strong><small>Blocos A, B e C</small></span>
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="home-dashboard__quick-item" href="/indicadores">
              <span className="home-dashboard__quick-icon"><ChartColumn aria-hidden="true" /></span>
              <span><strong>Indicadores</strong><small>Gráficos e evolução</small></span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
