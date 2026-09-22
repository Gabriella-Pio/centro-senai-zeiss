"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CompositionBarChart } from "@/components/charts/CompositionBarChart";
import {
  buildRecordFinancialBars,
  type RecordFinancialSummary,
} from "@/lib/chart-data";
import { formatCurrency } from "@/lib/pricing";

function formatDelta(value: number | null, invert = false) {
  if (value === null || value === 0) {
    return "—";
  }
  const positive = invert ? value < 0 : value > 0;
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatCurrency(value)}`;
}

export function RecordFinancialSummaryPanel({
  summary,
}: {
  summary: RecordFinancialSummary;
}) {
  const bars = buildRecordFinancialBars(summary);
  const hasData = bars.length > 0;

  return (
    <div className="record-financial-panel">
      <header className="record-financial-panel__header">
        <h3>Resultado financeiro</h3>
        <p>Comparação entre orçamento, custo real e faturamento.</p>
      </header>

      {hasData ? (
        <>
          <dl className="record-financial-panel__metrics">
            <div>
              <dt>Orçado</dt>
              <dd>{summary.quotedPrice ? formatCurrency(summary.quotedPrice) : "—"}</dd>
            </div>
            <div>
              <dt>Custo real</dt>
              <dd>{summary.actualCost ? formatCurrency(summary.actualCost) : "—"}</dd>
            </div>
            <div>
              <dt>Faturado</dt>
              <dd>{summary.billedValue ? formatCurrency(summary.billedValue) : "—"}</dd>
            </div>
            <div className="record-financial-panel__metric--highlight">
              <dt>Lucro</dt>
              <dd>
                {summary.profit !== null ? (
                  <span
                    className={
                      summary.profit >= 0
                        ? "record-financial-panel__value--positive"
                        : "record-financial-panel__value--negative"
                    }
                  >
                    {summary.profit >= 0 ? (
                      <TrendingUp aria-hidden="true" />
                    ) : (
                      <TrendingDown aria-hidden="true" />
                    )}
                    {formatCurrency(summary.profit)}
                  </span>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Margem</dt>
              <dd>
                {summary.marginPercent !== null ? `${summary.marginPercent}%` : "—"}
              </dd>
            </div>
            <div>
              <dt>Desvio de custo</dt>
              <dd
                className={
                  summary.costVariance !== null && summary.costVariance > 0
                    ? "record-financial-panel__value--negative"
                    : summary.costVariance !== null && summary.costVariance < 0
                      ? "record-financial-panel__value--positive"
                      : undefined
                }
              >
                {formatDelta(summary.costVariance, true)}
              </dd>
            </div>
            <div>
              <dt>Horas orçadas</dt>
              <dd>{summary.hoursQuoted !== null ? `${summary.hoursQuoted} h` : "—"}</dd>
            </div>
            <div>
              <dt>Horas realizadas</dt>
              <dd>{summary.hoursActual !== null ? `${summary.hoursActual} h` : "—"}</dd>
            </div>
          </dl>

          <CompositionBarChart
            title="Orçado vs realizado"
            subtitle="Valores em R$ — custo real comparado ao orçamento e faturamento"
            slices={bars}
            formatValue={formatCurrency}
          />
        </>
      ) : (
        <p className="record-financial-panel__empty">
          Complete o bloco B com horas e faturamento para ver o resultado financeiro.
        </p>
      )}
    </div>
  );
}
