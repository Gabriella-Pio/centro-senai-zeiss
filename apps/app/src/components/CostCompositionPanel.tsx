"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Calculator,
  ChevronDown,
  History,
  Receipt,
  Sparkles,
} from "lucide-react";
import type { PriceHistoryStats, QuoteCostBreakdown } from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";
import "./cost-composition.css";

function getLineParts(line: QuoteCostBreakdown["lines"][number]) {
  if (line.serviceLabel) {
    return { stage: line.serviceLabel, resource: line.resourceLabel ?? null };
  }
  const separator = " · ";
  const index = line.label.indexOf(separator);
  if (index === -1) {
    return { stage: line.label, resource: null };
  }
  return {
    stage: line.label.slice(0, index),
    resource: line.label.slice(index + separator.length),
  };
}

export function CostCompositionPanel({
  breakdown,
  priceHistory,
  proposedValue,
  frozenAt,
  tariffLabel,
  embedded = false,
  title = "Composição do orçamento",
  variant = "estimate",
}: {
  breakdown: QuoteCostBreakdown;
  priceHistory?: PriceHistoryStats;
  proposedValue?: number | null;
  frozenAt?: string;
  tariffLabel?: string;
  embedded?: boolean;
  title?: string;
  variant?: "estimate" | "actual";
}) {
  const comparePrice = breakdown.suggestedPrice;
  const margin =
    proposedValue && comparePrice > 0
      ? Math.round(((proposedValue - comparePrice) / proposedValue) * 100)
      : breakdown.marginPercent;

  const priceDelta =
    proposedValue && comparePrice > 0 ? proposedValue - comparePrice : null;
  const isBatch = Boolean(breakdown.quantity && breakdown.quantity > 1);
  const unitPrice = breakdown.unitPrice ?? breakdown.suggestedPrice;

  const subtitle = frozenAt
    ? `Congelado em ${new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(frozenAt))}${tariffLabel ? ` · ${tariffLabel}` : ""}`
    : breakdown.explanations[0]?.replace(/^Tarifas:\s*/, "") ?? null;

  return (
    <section
      className={`cost-panel${embedded ? " cost-panel--embedded" : ""}`}
      aria-labelledby="cost-panel-heading"
    >
      <header className="cost-panel__header">
        <div className="cost-panel__header-icon" aria-hidden="true">
          <Receipt />
        </div>
        <div className="cost-panel__header-content">
          <h3 id="cost-panel-heading">{title}</h3>
          {subtitle ? <p className="cost-panel__subtitle">{subtitle}</p> : null}
        </div>
        <Link href="/tarifas" className="cost-panel__tariff-link">
          Tarifas
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </header>

      {breakdown.lines.length === 0 ? (
        <WorkspaceEmptyState
          icon={Calculator}
          title="Orçamento pendente"
          description="Configure etapas com recurso e horas para ver o preço estimado."
          className="cost-panel__empty workspace-empty-state--panel"
        />
      ) : (
        <>
          <ol className="cost-panel__lines" aria-label="Itens do orçamento">
            {breakdown.lines.map((line, index) => {
              const { stage, resource } = getLineParts(line);
              return (
                <li key={line.id} className="cost-panel__line">
                  <div className="cost-panel__line-index" aria-hidden="true">
                    {index + 1}
                  </div>
                  <div className="cost-panel__line-body">
                    <div className="cost-panel__line-head">
                      <strong className="cost-panel__line-stage">{stage}</strong>
                      {resource ? (
                        <span className="cost-panel__line-resource">{resource}</span>
                      ) : null}
                    </div>
                    <p className="cost-panel__line-formula">
                      {line.hours.toFixed(1)} h{isBatch ? "/peça" : ""} × {formatCurrency(line.rate)}/h
                    </p>
                  </div>
                  <div className="cost-panel__line-amounts">
                    <strong className="cost-panel__line-amount">
                      {formatCurrency(line.subtotal)}
                      {isBatch ? <span className="cost-panel__line-amount-label"> / peça</span> : null}
                    </strong>
                    {isBatch ? (
                      <span className="cost-panel__line-total">
                        {formatCurrency(line.subtotal * (breakdown.quantity ?? 1))} total
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="cost-panel__totals">
            {!breakdown.tariffAsPrice ? (
              <div className="cost-panel__total-row">
                <span>Custo estimado</span>
                <strong>{formatCurrency(breakdown.totalCost)}</strong>
              </div>
            ) : null}

            {isBatch ? (
              <div className="cost-panel__total-row cost-panel__total-row--unit">
                <span>Preço unitário (1 peça)</span>
                <strong>{formatCurrency(unitPrice)}</strong>
              </div>
            ) : null}

            <div className="cost-panel__total-hero">
              <div className="cost-panel__total-hero-copy">
                <span className="cost-panel__total-hero-label">
                  {variant === "actual"
                    ? isBatch
                      ? "Custo real do lote"
                      : "Custo real"
                    : isBatch
                      ? "Preço total do lote"
                      : breakdown.tariffAsPrice
                        ? "Preço estimado"
                        : "Preço sugerido"}
                </span>
                <span className="cost-panel__total-hero-hint">
                  {isBatch
                    ? `${breakdown.quantity} peças · tarifa item 32`
                    : breakdown.tariffAsPrice
                      ? "Tarifa item 32 — já inclui mão de obra e overhead"
                      : `Inclui margem de ${breakdown.marginPercent}%`}
                </span>
              </div>
              <strong className="cost-panel__total-hero-value">
                {formatCurrency(breakdown.suggestedPrice)}
              </strong>
            </div>

            {proposedValue ? (
              <div className="cost-panel__proposed">
                <div className="cost-panel__proposed-copy">
                  <span className="cost-panel__proposed-label">Valor informado</span>
                  <span className="cost-panel__proposed-hint">
                    Margem efetiva de {margin}%
                  </span>
                </div>
                <div className="cost-panel__proposed-values">
                  <strong>{formatCurrency(proposedValue)}</strong>
                  {priceDelta !== null && priceDelta !== 0 ? (
                    <span
                      className={`cost-panel__delta${
                        priceDelta > 0
                          ? " cost-panel__delta--above"
                          : " cost-panel__delta--below"
                      }`}
                    >
                      {priceDelta > 0 ? "+" : ""}
                      {formatCurrency(priceDelta)}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}

      {priceHistory && priceHistory.count > 0 ? (
        <section className="cost-panel__history" aria-label="Histórico de preços">
          <div className="cost-panel__history-head">
            <History aria-hidden="true" />
            <h4>Histórico de casos similares</h4>
            <span>{priceHistory.count} formalizados</span>
          </div>
          <div className="cost-panel__history-stats">
            <div className="cost-panel__stat">
              <span>Mediana</span>
              <strong>
                {priceHistory.median ? formatCurrency(priceHistory.median) : "—"}
              </strong>
            </div>
            {priceHistory.q1 && priceHistory.q3 ? (
              <div className="cost-panel__stat">
                <span>Faixa (Q1–Q3)</span>
                <strong>
                  {formatCurrency(priceHistory.q1)} – {formatCurrency(priceHistory.q3)}
                </strong>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {breakdown.lines.length > 0 && breakdown.explanations.length > 1 ? (
        <details className="cost-panel__details">
          <summary>
            <Sparkles aria-hidden="true" />
            Como este valor foi calculado
            <ChevronDown className="cost-panel__details-chevron" aria-hidden="true" />
          </summary>
          <ul className="cost-panel__explanations">
            {breakdown.explanations.slice(1).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
