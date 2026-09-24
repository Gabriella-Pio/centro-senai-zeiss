"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  ArrowUpRight,
  ChartColumn,
  ClipboardCheck,
  Info,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@cem/ui";
import {
  buildEffortTrend,
  buildMarginDonut,
  buildParetoCauses,
  buildScatterData,
  countMarginDonutAboveTarget,
} from "@/lib/chart-data";
import { computeIndicators } from "@/lib/indicators";
import { canViewRecord, countPendingFormalizationLessons } from "@/lib/formalized-knowledge";
import { useDemoStore } from "@/lib/use-demo-store";
import type { UserRole } from "@/lib/api";
import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";
import { DonutChart } from "@/components/charts/DonutChart";
import { EffortTrendChart } from "@/components/charts/EffortTrendChart";
import { KpiCard } from "@/components/charts/KpiCard";
import { ParetoChart } from "@/components/charts/ParetoChart";
import { ScatterChart } from "@/components/charts/ScatterChart";
import "./indicators.css";

export function IndicatorsBoard({ userRole }: { userRole: UserRole }) {
  const router = useRouter();
  const { records, vocabulary, labSettings } = useDemoStore();

  const visibleRecords = useMemo(
    () => records.filter((record) => canViewRecord(record, userRole)),
    [records, userRole],
  );

  const summary = useMemo(
    () => computeIndicators(visibleRecords, vocabulary, labSettings),
    [visibleRecords, vocabulary, labSettings],
  );
  const scatter = useMemo(() => buildScatterData(visibleRecords), [visibleRecords]);
  const pareto = useMemo(() => buildParetoCauses(visibleRecords, vocabulary), [visibleRecords, vocabulary]);
  const marginDonut = useMemo(() => buildMarginDonut(visibleRecords, labSettings), [visibleRecords, labSettings]);
  const effortTrend = useMemo(() => buildEffortTrend(visibleRecords), [visibleRecords]);

  const pendingLessons = countPendingFormalizationLessons(records, userRole);

  const aboveTarget = countMarginDonutAboveTarget(marginDonut);
  const marginTotal = marginDonut.reduce((sum, slice) => sum + slice.value, 0);
  const abovePercent = marginTotal > 0 ? Math.round((aboveTarget / marginTotal) * 100) : 0;
  const hasFormalized = summary.totalFormalized > 0;

  return (
    <main className="indicators-page">
      <header className="indicators-page__header">
        <div className="indicators-page__heading">
          <p className="indicators-page__eyebrow">
            <ChartColumn aria-hidden="true" />
            Evolução do conhecimento
          </p>
          <h1 className="indicators-page__title">Indicadores</h1>
          <p className="indicators-page__intro">
            O laboratório está estimando melhor? Onde perde margem? Métricas da base demo
            formalizada (concluídos com lição validada) — o mesmo universo do Assistente, que
            ainda refina por tipo de serviço, características e recursos do perfil em edição.
          </p>
        </div>
      </header>

      <section
        className="workspace-notice workspace-notice--info workspace-notice--banner-grid indicators-page__demo-banner"
        aria-label="Aviso sobre dados de demonstração"
      >
        <div className="workspace-notice__icon indicators-page__demo-icon" aria-hidden="true">
          <Info />
        </div>
        <div className="workspace-notice__copy indicators-page__demo-copy">
          <strong>Dados da demonstração</strong>
          <p>
            Os números abaixo vêm da base demo versionada, não do histórico real do laboratório.
            Na operação, os indicadores nascerão vazios e crescerão conforme lições forem formalizadas.
          </p>
        </div>
        <Link href="/validacao" className="workspace-notice__link indicators-page__demo-link">
          Ver validação
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>

      {hasFormalized ? (
        <>

          {pendingLessons > 0 ? (
            <section className="workspace-notice workspace-notice--accent indicators-page__pending-banner">
              <ClipboardCheck aria-hidden="true" />
              <p>
                <strong>{pendingLessons}</strong>{" "}
                {pendingLessons === 1 ? "lição aguarda" : "lições aguardam"} formalização em{" "}
                <Link href="/validacao">Validação</Link> e ainda não entram nestes indicadores.
              </p>
            </section>
          ) : null}

          <div className="indicators-page__summary" role="region" aria-label="Resumo rápido">
            <div className="indicators-page__summary-item">
              <strong>{summary.totalFormalized}</strong>
              <span>Casos formalizados</span>
            </div>
            <div className="indicators-page__summary-item">
              <strong>{summary.assertivenessRate}%</strong>
              <span>Assertividade</span>
            </div>
            <div className="indicators-page__summary-item">
              <strong>{summary.averageMarginPercent}%</strong>
              <span>Margem média</span>
            </div>
            <div className="indicators-page__summary-item indicators-page__summary-item--last">
              <strong>{abovePercent}%</strong>
              <span>Acima da meta</span>
            </div>
          </div>

          <section className="indicators-page__content" aria-labelledby="indicators-kpis-heading">
            <div className="indicators-page__section-head">
              <p className="indicators-page__section-eyebrow">Métricas do ciclo</p>
              <h2 id="indicators-kpis-heading">Esforço e margem</h2>
              <p className="indicators-page__section-intro">
                Comparativo entre o orçado (bloco A), o realizado (bloco B) e o aprendizado validado (bloco C).
              </p>
            </div>

            <div className="indicators-page__kpis">
              <KpiCard
                label="Casos formalizados"
                value={String(summary.totalFormalized)}
                detail="Lições demo formalizadas na base compartilhada com o Assistente"
                icon={ChartColumn}
              />
              <KpiCard
                label="Assertividade"
                value={`${summary.assertivenessRate}%`}
                detail="Dentro de ±15% entre estimado e realizado"
                icon={Target}
                highlight
              />
              <KpiCard
                label="Desvio médio"
                value={`${summary.averageEffortDeviation}%`}
                detail="Diferença média estimado vs realizado"
                icon={TrendingUp}
              />
              <KpiCard
                label="Margem média"
                value={`${summary.averageMarginPercent}%`}
                detail={`Meta do laboratório: ${summary.targetMarginPercent}%`}
                icon={TrendingUp}
              />
              <KpiCard
                label="Abaixo da meta"
                value={String(summary.belowTargetMarginCount)}
                detail={`Serviços com margem abaixo de ${summary.targetMarginPercent}%`}
                icon={TrendingDown}
              />
              <KpiCard
                label="Acima da meta"
                value={marginTotal > 0 ? `${abovePercent}%` : "—"}
                detail={
                  marginTotal > 0
                    ? `${aboveTarget} de ${marginTotal} casos com margem acima de ${summary.targetMarginPercent}%`
                    : "Distribuição de margem realizada"
                }
                icon={Target}
              />
            </div>
          </section>

          <section className="indicators-page__content" aria-labelledby="indicators-charts-heading">
            <div className="indicators-page__section-head">
              <p className="indicators-page__section-eyebrow">Visualização</p>
              <h2 id="indicators-charts-heading">Gráficos e tendências</h2>
              <p className="indicators-page__section-intro">
                Comparativo de horas, distribuição de margem, evolução mensal e causas mais frequentes
                nos casos formalizados.
              </p>
            </div>

            <div className="dashboard-charts indicators-page__charts">
              <div className="indicators-page__chart-panel">
                <ScatterChart data={scatter} />
              </div>
              <div className="indicators-page__chart-panel">
                <DonutChart
                  title="Distribuição de margem"
                  subtitle="Verde = acima da meta · Amarelo = próximo · Vermelho = abaixo"
                  slices={marginDonut}
                  centerLabel={`${abovePercent}%`}
                  centerCaption="acima da meta"
                />
              </div>
            </div>

            <div className="dashboard-charts dashboard-charts--full indicators-page__charts">
              <div className="indicators-page__chart-panel">
                <EffortTrendChart data={effortTrend} />
              </div>
              <div className="indicators-page__chart-panel">
                <ParetoChart data={pareto} />
              </div>
            </div>
          </section>

          <section className="indicators-page__content" aria-labelledby="indicators-causes-heading">
            <div className="indicators-page__section-head">
              <p className="indicators-page__section-eyebrow">Aprendizado agregado</p>
              <h2 id="indicators-causes-heading">Principais causas de desvio</h2>
              <p className="indicators-page__section-intro">
                Top 3 registradas no bloco C dos casos formalizados — orientam onde o laboratório mais erra na estimativa.
              </p>
            </div>

            {summary.topCauses.length > 0 ? (
              <ol className="indicators-page__causes-list">
                {summary.topCauses.map((cause, index) => (
                  <li key={cause.label} className="indicators-page__cause-item">
                    <span className="indicators-page__cause-rank">{index + 1}</span>
                    <div className="indicators-page__cause-copy">
                      <strong>{cause.label}</strong>
                      <span>
                        {cause.count} {cause.count === 1 ? "ocorrência" : "ocorrências"} na base formalizada
                      </span>
                    </div>
                    <span className="indicators-page__cause-count">{cause.count}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <WorkspaceEmptyState
                icon={Target}
                title="Nenhuma causa de desvio registrada"
                description="Os casos formalizados ainda não têm causa do desvio preenchida no bloco C."
                className="indicators-page__causes-empty"
              />
            )}
          </section>
        </>
      ) : (
        <section className="indicators-page__content">
          <WorkspaceEmptyState
            icon={ChartColumn}
            title="Ainda não há indicadores para mostrar"
            description="Formalize lições em Validação ou conclua registros com bloco C completo. Os gráficos aparecem quando existir base formalizada."
            action={
              <div className="indicators-page__empty-actions">
                <Button type="button" size="lg" onClick={() => router.push("/registros")}>
                  Ver registros
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.push("/validacao")}>
                  Ir para validação
                </Button>
              </div>
            }
          />
        </section>
      )}
    </main>
  );
}
