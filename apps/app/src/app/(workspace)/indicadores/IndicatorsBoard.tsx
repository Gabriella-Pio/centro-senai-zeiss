"use client";

import { useMemo } from "react";
import { ChartColumn } from "lucide-react";
import { computeIndicators } from "@/lib/indicators";
import { useDemoStore } from "@/lib/use-demo-store";
import "./indicators.css";

export function IndicatorsBoard() {
  const { records, vocabulary } = useDemoStore();
  const summary = useMemo(() => computeIndicators(records, vocabulary), [records, vocabulary]);

  return (
    <main className="indicators-page">
      <header className="indicators-page__header">
        <div>
          <p className="indicators-page__eyebrow"><ChartColumn aria-hidden="true" /> Evolução do conhecimento</p>
          <h1 className="indicators-page__title">Indicadores</h1>
          <p className="indicators-page__intro">Calculado a partir da base de demonstração. O histórico real começa vazio.</p>
        </div>
      </header>

      <div className="indicators-banner">Dados da demonstração — fora dos indicadores reais do laboratório.</div>

      <section className="indicators-grid">
        <article className="indicators-card">
          <span>Casos formalizados</span>
          <strong>{summary.totalFormalized}</strong>
        </article>
        <article className="indicators-card">
          <span>Assertividade (±15%)</span>
          <strong>{summary.assertivenessRate}%</strong>
        </article>
        <article className="indicators-card">
          <span>Desvio médio de esforço</span>
          <strong>{summary.averageEffortDeviation}%</strong>
        </article>
      </section>

      <section className="indicators-causes">
        <h2>Causas de desvio mais frequentes</h2>
        {summary.topCauses.length === 0 ? <p>Nenhuma causa registrada ainda.</p> : (
          <ol>
            {summary.topCauses.map((cause) => (
              <li key={cause.label}><strong>{cause.label}</strong><span>{cause.count} ocorrências</span></li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
