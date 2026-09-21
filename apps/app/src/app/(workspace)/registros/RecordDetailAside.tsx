import { CostCompositionPanel } from "@/components/CostCompositionPanel";
import { DonutChart } from "@/components/charts/DonutChart";

import type { RecordBlock } from "@/lib/record-lifecycle";
import { formatEffort } from "@/lib/record-helpers";

import type { DonutSlice } from "@/lib/chart-data";
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
  priceHistory,
  frozenTariff,
  costDonut,
}: {
  record: ServiceRecord;
  activeTab: RecordBlock;
  costBreakdown: QuoteCostBreakdown | null;
  priceHistory: PriceHistoryStats | null;
  frozenTariff: boolean;
  costDonut: DonutSlice[];
}) {
  if (activeTab === "A" && costBreakdown) {
    return (
      <div className="record-aside-stack">
        <div className="record-aside-panel">
          <CostCompositionPanel
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

          {!frozenTariff && record.quoteSnapshot ? (
            <p className="record-detail-page__tariff-note">
              Prévia com tarifas atuais. Salve o bloco A para congelar
              o orçamento.
            </p>
          ) : null}
        </div>

        {costDonut.length > 0 ? (
          <div className="record-aside-panel record-aside-panel--chart">
            <DonutChart
              title="Distribuição do custo"
              slices={costDonut}
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
            <dd>{record.actualHours} h</dd>
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
            <dt>Assuntos</dt>
            <dd>
              {record.relatedTopicIds.length} vinculados
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}