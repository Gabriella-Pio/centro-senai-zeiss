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
      ? Math.round(((proposedValue - breakdown.totalCost) / proposedValue) * 100)
      : breakdown.marginPercent;

  return (
    <section className="cost-panel" aria-labelledby="cost-panel-heading">
      <div className="cost-panel__header">
        <h3 id="cost-panel-heading">Composição do orçamento</h3>
        <p>
          {frozenAt
            ? `Tarifa congelada em ${new Intl.DateTimeFormat("pt-BR").format(new Date(frozenAt))}${tariffLabel ? ` · ${tariffLabel}` : ""}`
            : breakdown.explanations[0]}
          {" · "}
          <Link href="/tarifas" className="cost-panel__tariff-link">Ver planilha de tarifas</Link>
        </p>
      </div>

      {breakdown.lines.length === 0 ? (
        <p className="cost-panel__empty">Selecione recursos e informe horas para calcular o custo.</p>
      ) : (
        <table className="cost-panel__table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Horas</th>
              <th>Tarifa</th>
              <th>Subtotal</th>
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
          <tfoot>
            <tr>
              <td colSpan={3}><strong>Custo estimado</strong></td>
              <td><strong>{formatCurrency(breakdown.totalCost)}</strong></td>
            </tr>
            <tr>
              <td colSpan={3}>Preço sugerido (margem {breakdown.marginPercent}%)</td>
              <td><strong className="cost-panel__suggested">{formatCurrency(breakdown.suggestedPrice)}</strong></td>
            </tr>
            {proposedValue ? (
              <tr>
                <td colSpan={3}>Valor informado (margem {margin}%)</td>
                <td>{formatCurrency(proposedValue)}</td>
              </tr>
            ) : null}
          </tfoot>
        </table>
      )}

      {priceHistory && priceHistory.count > 0 ? (
        <div className="cost-panel__history">
          <h4>Histórico de preços (casos formalizados)</h4>
          <p>
            Mediana {priceHistory.median ? formatCurrency(priceHistory.median) : "—"}
            {priceHistory.q1 && priceHistory.q3
              ? ` · faixa ${formatCurrency(priceHistory.q1)} – ${formatCurrency(priceHistory.q3)}`
              : ""}
            {priceHistory.count > 0 ? ` · ${priceHistory.count} casos` : ""}
          </p>
        </div>
      ) : null}

      {breakdown.lines.length > 0 ? (
        <ul className="cost-panel__explanations">
          {breakdown.explanations.slice(1).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
