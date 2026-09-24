import { CostCompositionPanel } from "@/components/CostCompositionPanel";
import { DonutChart } from "@/components/charts/DonutChart";

import { getRecordResourceIds, type AssistantRecommendation } from "@/lib/assistant";
import type { RecordBlock } from "@/lib/record-lifecycle";
import { formatActualEffort, formatEffort } from "@/lib/record-helpers";

import type { DonutSlice, RecordFinancialSummary } from "@/lib/chart-data";
import { RecordAssistantPanel } from "./RecordAssistantPanel";
import { RecordFinancialSummaryPanel } from "./RecordFinancialSummaryPanel";
import type {
  PriceHistoryStats,
  QuoteCostBreakdown,
} from "@/lib/pricing";
import { formatCurrency } from "@/lib/pricing";
import { getRecordQuoteMode, QUOTE_MODE_LABELS } from "@/lib/quote-mode";

import { formatDeliveredAt } from "./records-utils";
import type { ServiceRecord } from "./types";

export function RecordDetailAside({
  record,
  activeTab,
  costBreakdown,
  actualBreakdown,
  priceHistory,
  recommendation,
  serviceTypeGuidance,
  serviceTypeLabel,
  currentEstimatedHours,
  profileChips,
  serviceOnlyCaseCount,
  readOnly,
  tariffReferencePrice,
  frozenTariff,
  quoteOutdated,
  costDonut,
  financialSummary,
  onApplySuggestedHours,
}: {
  record: ServiceRecord;
  activeTab: RecordBlock;
  costBreakdown: QuoteCostBreakdown | null;
  actualBreakdown: QuoteCostBreakdown | null;
  priceHistory: PriceHistoryStats | null;
  recommendation: AssistantRecommendation;
  serviceTypeGuidance: string | null;
  serviceTypeLabel: string | null;
  profileChips: string[];
  currentEstimatedHours: number | null;
  serviceOnlyCaseCount: number;
  readOnly: boolean;
  tariffReferencePrice: number;
  frozenTariff: boolean;
  quoteOutdated: boolean;
  costDonut: DonutSlice[];
  financialSummary: RecordFinancialSummary | null;
  onApplySuggestedHours: () => void;
}) {
  const assistantPanelProps = {
    recommendation,
    serviceTypeGuidance,
    serviceTypeLabel,
    profileChips,
    currentEstimatedHours,
    isDemoData: record.isDemo,
    readOnly,
    hasServiceType: Boolean(record.serviceTypeId),
    partTraitCount: record.partTraitIds.length,
    resourceCount: getRecordResourceIds(record).length,
    serviceOnlyCaseCount,
    tariffReferencePrice: tariffReferencePrice > 0 ? tariffReferencePrice : null,
    priceHistoryMedian: priceHistory?.median ?? null,
    onApplySuggestedHours,
  };
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
            isDemoData={record.isDemo}
          />
        </div>
      </div>
    );
  }

  const quoteMode = getRecordQuoteMode(record);

  if (activeTab === "A" && quoteMode === "hourly_package") {
    return (
      <div className="record-aside-stack">
        <div className="record-aside-panel">
          <RecordAssistantPanel embedded {...assistantPanelProps} />
        </div>
        <div className="record-summary-card">
          <div className="record-summary-card__header">
            <h3>Pacote / contrato</h3>
            <p>{QUOTE_MODE_LABELS.hourly_package}</p>
          </div>
          <dl>
            <div>
              <dt>Referência</dt>
              <dd>{record.hoursPackageRef ?? "—"}</dd>
            </div>
            <div>
              <dt>Horas do pacote</dt>
              <dd>{record.estimatedHours ? `${record.estimatedHours} h` : "—"}</dd>
            </div>
            <div>
              <dt>Valor do contrato</dt>
              <dd>{record.proposedValue ? formatCurrency(record.proposedValue) : "—"}</dd>
            </div>
          </dl>
          {costBreakdown && costBreakdown.lines.length > 0 ? (
            <p className="record-detail-page__tariff-note">
              Composição por etapas abaixo é referência do consumo previsto — o valor contratual é o do pacote.
            </p>
          ) : (
            <p className="record-detail-page__tariff-note">
              Salve o bloco A para congelar o pacote. Etapas são opcionais para detalhar o escopo.
            </p>
          )}
        </div>
        {costBreakdown && costBreakdown.lines.length > 0 ? (
          <div className="record-aside-panel" id="record-cost-composition">
            <CostCompositionPanel
              embedded
              breakdown={costBreakdown}
              priceHistory={priceHistory ?? undefined}
              proposedValue={record.proposedValue}
              frozenAt={frozenTariff ? record.quoteSnapshot?.savedAt : undefined}
              tariffLabel="Referência por etapas"
              isDemoData={record.isDemo}
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (activeTab === "A") {
    return (
      <div className="record-aside-stack">
        <div className="record-aside-panel">
          <RecordAssistantPanel embedded {...assistantPanelProps} />
        </div>
        {costBreakdown ? (
          <>
            <div className="record-aside-panel" id="record-cost-composition">
              <CostCompositionPanel
                embedded
                breakdown={costBreakdown}
                priceHistory={priceHistory ?? undefined}
                proposedValue={record.proposedValue}
                frozenAt={
                  frozenTariff ? record.quoteSnapshot?.savedAt : undefined
                }
                tariffLabel={
                  frozenTariff
                    ? record.quoteSnapshot?.tariffTableLabel
                    : quoteMode === "commercial_fixed"
                      ? "Tarifa (referência)"
                      : undefined
                }
                isDemoData={record.isDemo}
              />
              {quoteMode === "commercial_fixed" ? (
                <p className="record-detail-page__tariff-note">
                  Valor comercial fechado da proposta. A composição tarifária é apenas referência.
                </p>
              ) : null}
              {frozenTariff && quoteOutdated ? (
                <p className="record-detail-page__tariff-note record-detail-page__tariff-note--warning">
                  Etapas ou tarifas mudaram desde o último salvamento. Salve o bloco A para atualizar o orçamento congelado.
                </p>
              ) : !frozenTariff && quoteMode === "tariff" ? (
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
          </>
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