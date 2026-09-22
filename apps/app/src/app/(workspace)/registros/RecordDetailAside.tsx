import { CostCompositionPanel } from "@/components/CostCompositionPanel";
import { DonutChart } from "@/components/charts/DonutChart";

import type { RecordBlock } from "@/lib/record-lifecycle";
import { formatActualEffort, formatEffort } from "@/lib/record-helpers";

import type { DonutSlice, RecordFinancialSummary } from "@/lib/chart-data";
import { RecordFinancialSummaryPanel } from "./RecordFinancialSummaryPanel";
import type {
  PriceHistoryStats,
  QuoteCostBreakdown,
} from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";

import { formatDeliveredAt } from "./records-utils";
import type { ServiceRecord } from "./types";

export function RecordDetailAside({
  record,
  activeTab,
  costBreakdown,
  actualBreakdown,
  priceHistory,
  frozenTariff,
  quoteOutdated,
  costDonut,
  financialSummary,
}: {
  record: ServiceRecord;
  activeTab: RecordBlock;
  costBreakdown: QuoteCostBreakdown | null;
  actualBreakdown: QuoteCostBreakdown | null;
  priceHistory: PriceHistoryStats | null;
  frozenTariff: boolean;
  quoteOutdated: boolean;
  costDonut: DonutSlice[];
  financialSummary: RecordFinancialSummary | null;
}) {
  if (activeTab === "C" && financialSummary) {
    return (
      <div className="record-aside-stack">
        <div className="record-aside-panel">
          <RecordFinancialSummaryPanel summary={financialSummary} />
        </div>
      </div>
    );
  }

  if (activeTab === "B" && actualBreakdown && actualBreakdown.lines.length > 0) {
    return (
      <div className="record-aside-stack">
        <div className="record-aside-panel">
          <CostCompositionPanel
            embedded
            title="Custo real"
            variant="actual"
            breakdown={actualBreakdown}
            proposedValue={record.billedValue}
          />
        </div>
      </div>
    );
  }

  if (activeTab === "A" && costBreakdown) {
    return (
      <div className="record-aside-stack">
        <div className="record-aside-panel">
          <CostCompositionPanel
            embedded
            breakdown={costBreakdown}
            priceHistory={priceHistory ?? undefined}
            proposedValue={record.proposedValue}
            frozenAt={
              frozenTariff
                ? record.quoteSnapshot?.savedAt
                : undefined
            }
            tariffLabel={
              frozenTariff
                ? record.quoteSnapshot?.tariffTableLabel
                : undefined
            }
          />

          {frozenTariff && quoteOutdated ? (
            <p className="record-detail-page__tariff-note record-detail-page__tariff-note--warning">
              Etapas ou tarifas mudaram desde o último salvamento. Salve o bloco A para atualizar o orçamento congelado.
            </p>
          ) : !frozenTariff ? (
            <p className="record-detail-page__tariff-note">
              Prévia com tarifas atuais. Salve o bloco A para congelar o orçamento.
            </p>
          ) : null}
        </div>

        {costBreakdown.lines.length > 0 ? (
          <div className="record-aside-panel record-aside-panel--chart">
            <DonutChart
              title="Distribuição do preço"
              subtitle={`Total ${formatCurrency(costBreakdown.suggestedPrice)}`}
              slices={costDonut}
              centerLabel={formatCurrency(costBreakdown.suggestedPrice)}
              compactLegend
              interactive
              formatValue={formatCurrency}
            />
          </div>
        ) : null}
      </div>
    );
  }

  const title =
    activeTab === "B"
      ? "Resumo da execução"
      : activeTab === "C"
        ? "Resumo do serviço"
        : "Resumo do orçamento";

  return (
    <div className="record-summary-card">
      <div className="record-summary-card__header">
        <h3>{title}</h3>

        <p>
          Referência rápida dos valores registrados neste serviço.
        </p>
      </div>

      <dl>
        <div>
          <dt>Horas previstas</dt>
          <dd>
            {record.estimatedHours
              ? formatEffort(record)
              : "—"}
          </dd>
        </div>

        <div>
          <dt>Valor proposto</dt>
          <dd>
            {record.proposedValue
              ? formatCurrency(record.proposedValue)
              : "—"}
          </dd>
        </div>

        <div>
          <dt>Custo estimado</dt>
          <dd>
            {record.estimatedCost
              ? formatCurrency(record.estimatedCost)
              : "—"}
          </dd>
        </div>

        {record.actualHours ? (
          <div>
            <dt>Horas realizadas</dt>
            <dd>{formatActualEffort(record)}</dd>
          </div>
        ) : null}

        {record.actualCost ? (
          <div>
            <dt>Custo real</dt>
            <dd>{formatCurrency(record.actualCost)}</dd>
          </div>
        ) : null}

        {record.billedValue ? (
          <div>
            <dt>Faturado</dt>
            <dd>{formatCurrency(record.billedValue)}</dd>
          </div>
        ) : null}

        {record.deliveredAt ? (
          <div>
            <dt>Entrega</dt>
            <dd>{formatDeliveredAt(record.deliveredAt)}</dd>
          </div>
        ) : null}

        {record.relatedTopicIds.length > 0 ? (
          <div>
            <dt>Contexto</dt>
            <dd>
              {record.relatedTopicIds.length} termos
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}