"use client";

import { useMemo } from "react";
import { ChartColumn, Target, TrendingUp } from "lucide-react";
import {
  buildEffortTrend,
  buildMarginDonut,
  buildParetoCauses,
  buildScatterData,
  computeAssertivenessRate,
} from "@/lib/chart-data";
import { computeIndicators } from "@/lib/indicators";
import { useDemoStore } from "@/lib/use-demo-store";
import { DonutChart } from "@/components/charts/DonutChart";
import { EffortTrendChart } from "@/components/charts/EffortTrendChart";
import { KpiCard } from "@/components/charts/KpiCard";
import { ParetoChart } from "@/components/charts/ParetoChart";
import { ScatterChart } from "@/components/charts/ScatterChart";
import "./indicators.css";

export function IndicatorsBoard() {
  const { records, vocabulary, labSettings } = useDemoStore();
  const summary = useMemo(() => computeIndicators(records, vocabulary, labSettings), [records, vocabulary, labSettings]);
  const scatter = useMemo(() => buildScatterData(records), [records]);
  const pareto = useMemo(() => buildParetoCauses(records, vocabulary), [records, vocabulary]);
  const marginDonut = useMemo(() => buildMarginDonut(records, labSettings), [records, labSettings]);
  const effortTrend = useMemo(() => buildEffortTrend(records), [records]);
  const assertiveness = useMemo(() => computeAssertivenessRate(records), [records]);

  const aboveTarget = marginDonut.find((slice) => slice.label === "Acima da meta")?.value ?? 0;
  const marginTotal = marginDonut.reduce((sum, slice) => sum + slice.value, 0);
  const abovePercent = marginTotal > 0 ? Math.round((aboveTarget / marginTotal) * 100) : 0;

  return (
    <main className="indicators-page">
      <header className="indicators-page__header">
        <div>
          <p className="indicators-page__eyebrow"><ChartColumn aria-hidden="true" /> Evolução do conhecimento</p>
          <h1 className="indicators-page__title">Indicadores</h1>
          <p className="indicators-page__intro">
            O laboratório está estimando melhor? Onde perde margem? Os gráficos abaixo respondem com base nos casos formalizados.
          </p>
        </div>
      </header>

      <div className="indicators-banner">Dados da demonstração — fora dos indicadores reais do laboratório.</div>

      <section className="indicators-kpis">
        <KpiCard label="Casos formalizados" value={String(summary.totalFormalized)} detail="Base que alimenta o Assistente" icon={ChartColumn} />
        <KpiCard label="Assertividade" value={`${assertiveness}%`} detail="Dentro de ±15% de desvio" icon={Target} highlight />
        <KpiCard label="Desvio médio" value={`${summary.averageEffortDeviation}%`} detail="Diferença média estimado vs realizado" icon={TrendingUp} />
        <KpiCard label="Abaixo da meta" value={String(summary.belowTargetMarginCount)} detail={`Margem alvo: ${summary.targetMarginPercent}%`} icon={Target} />
      </section>

      <section className="dashboard-charts indicators-charts">
        <ScatterChart data={scatter} />
        <DonutChart
          title="Distribuição de margem"
          subtitle="Verde = acima da meta · Amarelo = próximo · Vermelho = abaixo"
          slices={marginDonut}
          centerLabel={`${abovePercent}%`}
        />
      </section>

      <section className="dashboard-charts dashboard-charts--full indicators-charts">
        <EffortTrendChart data={effortTrend} />
        <ParetoChart data={pareto} />
      </section>
    </main>
  );
}
