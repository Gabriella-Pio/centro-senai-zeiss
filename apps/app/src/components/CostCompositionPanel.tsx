"use client";

import Link from "next/link";
import type { PriceHistoryStats, QuoteCostBreakdown } from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
import "./cost-composition.css";

export function CostCompositionPanel({
  breakdown,
  priceHistory,
  proposedValue,
  frozenAt,
  tariffLabel,
}: {
  breakdown: QuoteCostBreakdown;
  priceHistory?: PriceHistoryStats;
  proposedValue?: number | null;
  frozenAt?: string;
  tariffLabel?: string;
}) {
  const margin =
    proposedValue && breakdown.totalCost > 0
      ? Math.round(
          ((proposedValue - breakdown.totalCost) / proposedValue) * 100
        )
      : breakdown.marginPercent;

  return (
    <section className="cost-panel" aria-labelledby="cost-panel-heading">
      <header className="cost-panel__header">
        <div className="cost-panel__header-content">
          <h3 id="cost-panel-heading">Composição do orçamento</h3>

          <p className="cost-panel__subtitle">
            {frozenAt
              ? `Tarifa congelada em ${new Intl.DateTimeFormat("pt-BR").format(
                  new Date(frozenAt)
                )}${tariffLabel ? ` · ${tariffLabel}` : ""}`
              : breakdown.explanations[0]}
          </p>
        </div>

        <Link href="/tarifas" className="cost-panel__tariff-link">
          Ver tarifas
        </Link>
      </header>

      {breakdown.lines.length === 0 ? (
        <p className="cost-panel__empty">
          Configure etapas com recurso e horas para calcular o preço.
        </p>
      ) : (
        <>
          <div className="cost-panel__table-wrapper">
            <table className="cost-panel__table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Horas</th>
                  <th scope="col">Tarifa</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {breakdown.lines.map((line) => (
                  <tr key={line.id}>
                    <td>{line.label}</td>
                    <td>{line.hours.toFixed(1)} h</td>
                    <td>{formatCurrency(line.rate)}/h</td>
                    <td>{formatCurrency(line.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cost-panel__summary">
            {!breakdown.tariffAsPrice ? (
              <div className="cost-panel__summary-row">
                <span>Custo estimado</span>

                <strong>
                  {formatCurrency(breakdown.totalCost)}
                </strong>
              </div>
            ) : null}

            <div className="cost-panel__summary-row cost-panel__summary-row--highlight">
              <div className="cost-panel__summary-info">
                <span className="cost-panel__summary-label">
                  {breakdown.tariffAsPrice
                    ? "Preço estimado"
                    : "Preço sugerido"}
                </span>

                <span className="cost-panel__summary-description">
                  {breakdown.tariffAsPrice
                    ? "Tarifa item 32"
                    : `Margem de ${breakdown.marginPercent}%`}
                </span>
              </div>

              <strong className="cost-panel__summary-value">
                {formatCurrency(breakdown.suggestedPrice)}
              </strong>
            </div>

            {proposedValue ? (
              <div className="cost-panel__summary-row cost-panel__summary-row--proposed">
                <div className="cost-panel__summary-info">
                  <span className="cost-panel__summary-label">
                    Valor informado
                  </span>

                  <span className="cost-panel__summary-description">
                    Margem efetiva de {margin}%
                  </span>
                </div>

                <strong>{formatCurrency(proposedValue)}</strong>
              </div>
            ) : null}
          </div>
        </>
      )}

      {priceHistory && priceHistory.count > 0 ? (
        <section className="cost-panel__history" aria-label="Histórico de preços">
          <div className="cost-panel__history-header">
            <h4>Histórico de preços</h4>

            <span>{priceHistory.count} casos formalizados</span>
          </div>

          <div className="cost-panel__history-content">
            <div>
              <span>Mediana</span>

              <strong>
                {priceHistory.median
                  ? formatCurrency(priceHistory.median)
                  : "—"}
              </strong>
            </div>

            {priceHistory.q1 && priceHistory.q3 ? (
              <div>
                <span>Faixa histórica</span>

                <strong>
                  {formatCurrency(priceHistory.q1)} –{" "}
                  {formatCurrency(priceHistory.q3)}
                </strong>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {breakdown.lines.length > 0 &&
      breakdown.explanations.length > 1 ? (
        <details className="cost-panel__details">
          <summary>Como este valor foi calculado</summary>

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