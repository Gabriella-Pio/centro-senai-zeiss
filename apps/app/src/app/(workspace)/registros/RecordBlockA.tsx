import { Button, Input, Label } from "@cem/ui";
import { formatCurrency } from "@/lib/pricing";
import {
  QUOTE_MODE_DESCRIPTIONS,
  QUOTE_MODE_LABELS,
  getRecordQuoteMode,
} from "@/lib/quote-mode";
import { getRecordQuantity, isBatchRecord } from "@/lib/record-helpers";
import { getRecordStages } from "@/lib/record-stages";
import type { VocabularyTerm } from "../vocabulario/types";
import { RecordServiceStagesEditor } from "./RecordServiceStagesEditor";
import { RecordVocabularyPicker } from "./RecordVocabularyPicker";
import type { QuoteMode, ServiceRecord } from "./types";

const QUOTE_MODES: QuoteMode[] = ["tariff", "commercial_fixed", "hourly_package"];

export function RecordBlockA({
  record,
  readOnly,
  canEditQuoteMode,
  serviceTypes,
  partTraits,
  resources,
  suggestedPrice,
  suggestedUnitPrice,
  needsPriceOverride,
  onUpdate,
  onSave,
}: {
  record: ServiceRecord;
  readOnly: boolean;
  canEditQuoteMode: boolean;
  serviceTypes: VocabularyTerm[];
  partTraits: VocabularyTerm[];
  resources: VocabularyTerm[];
  suggestedPrice: number;
  suggestedUnitPrice: number;
  needsPriceOverride: boolean;
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onSave: () => void;
}) {
  const quoteMode = getRecordQuoteMode(record);
  const isBatch = isBatchRecord(record);
  const stages = getRecordStages(record, serviceTypes);
  const isPackageMode = quoteMode === "hourly_package";

  function setScopeMode(mode: "single" | "batch") {
    if (mode === "single") {
      onUpdate({ recordKind: "single", quantity: 1 });
      return;
    }
    onUpdate({
      recordKind: "batch",
      quantity: Math.max(2, getRecordQuantity(record)),
    });
  }

  function setQuoteMode(mode: QuoteMode) {
    const patch: Partial<ServiceRecord> = { quoteMode: mode };
    if (mode !== "tariff") {
      patch.priceOverrideReason = undefined;
    }
    onUpdate(patch);
  }

  return (
    <div className="records-form">
      <div className="record-section">
        <h2>Modo de orçamento</h2>
        {canEditQuoteMode ? (
          <div
            className="record-quote-mode-toggle"
            role="radiogroup"
            aria-label="Modo de orçamento"
          >
            {QUOTE_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={quoteMode === mode}
                className={`record-quote-mode-toggle__option${
                  quoteMode === mode ? " record-quote-mode-toggle__option--active" : ""
                }`}
                onClick={() => setQuoteMode(mode)}
              >
                {QUOTE_MODE_LABELS[mode]}
              </button>
            ))}
          </div>
        ) : (
          <p className="record-detail-page__quote-mode-badge">{QUOTE_MODE_LABELS[quoteMode]}</p>
        )}
        <p className="record-detail-page__field-hint">{QUOTE_MODE_DESCRIPTIONS[quoteMode]}</p>
      </div>

      <div className="record-section">
        <h2>Lote e escopo</h2>
        <div className="record-scope-toggle" role="radiogroup" aria-label="Tipo de escopo">
          <button
            type="button"
            role="radio"
            aria-checked={!isBatch}
            disabled={readOnly}
            className={`record-scope-toggle__option${!isBatch ? " record-scope-toggle__option--active" : ""}`}
            onClick={() => setScopeMode("single")}
          >
            Peça única
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isBatch}
            disabled={readOnly}
            className={`record-scope-toggle__option${isBatch ? " record-scope-toggle__option--active" : ""}`}
            onClick={() => setScopeMode("batch")}
          >
            Lote
          </button>
        </div>

        {isBatch ? (
          <div className="records-form__two-columns">
            <div>
              <Label>Quantidade de peças</Label>
              <Input
                type="number"
                min="2"
                disabled={readOnly}
                value={getRecordQuantity(record)}
                onChange={(event) =>
                  onUpdate({
                    quantity: Math.max(2, Number(event.target.value) || 2),
                    recordKind: "batch",
                  })
                }
                className="h-12"
              />
            </div>
            <div>
              <Label>Identificação do lote</Label>
              <Input
                disabled={readOnly}
                value={record.batchLabel ?? ""}
                onChange={(event) => onUpdate({ batchLabel: event.target.value })}
                className="h-12"
                placeholder="Ex.: Lote bicos 1–16"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label>Identificação da peça</Label>
            <Input
              disabled={readOnly}
              value={record.batchLabel ?? ""}
              onChange={(event) => onUpdate({ batchLabel: event.target.value })}
              className="h-12"
              placeholder="Ex.: Carcaça usinada #A-204"
            />
          </div>
        )}
      </div>

      {isPackageMode ? (
        <div className="record-section">
          <h2>Pacote / contrato</h2>
          <div>
            <Label>Referência do pacote</Label>
            <Input
              disabled={readOnly}
              value={record.hoursPackageRef ?? ""}
              onChange={(event) => onUpdate({ hoursPackageRef: event.target.value })}
              className="h-12"
              placeholder="Ex.: Pacote anual 120 h — Cargill 2026"
            />
          </div>
          <div className="records-form__two-columns">
            <div>
              <Label>Horas totais do pacote</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                disabled={readOnly}
                value={record.estimatedHours ?? ""}
                onChange={(event) =>
                  onUpdate({
                    estimatedHours: event.target.value ? Number(event.target.value) : null,
                  })
                }
                className="h-12"
              />
            </div>
            <div>
              <Label>Valor do contrato (R$)</Label>
              <Input
                type="number"
                min="0"
                disabled={readOnly}
                value={record.proposedValue ?? ""}
                onChange={(event) =>
                  onUpdate({ proposedValue: event.target.value ? Number(event.target.value) : null })
                }
                className="h-12"
              />
            </div>
          </div>
          <p className="record-detail-page__field-hint">
            Etapas abaixo são opcionais — use para detalhar consumo do pacote ou serviços já previstos.
          </p>
        </div>
      ) : null}

      <div className="record-section">
        <h2>Classificação</h2>
        <RecordServiceStagesEditor
          record={record}
          serviceTypes={serviceTypes}
          resources={resources}
          readOnly={readOnly}
          onUpdate={onUpdate}
        />

        <RecordVocabularyPicker
          label="Características da peça"
          hint="Para aprendizado e busca de casos similares — não altera o preço do orçamento."
          addLabel="Adicionar característica"
          terms={partTraits}
          selectedIds={record.partTraitIds}
          readOnly={readOnly}
          onChange={(partTraitIds) => onUpdate({ partTraitIds })}
        />
      </div>

      {!isPackageMode ? (
        <div className="record-section">
          <h2>Valor e premissas</h2>
          {stages.length === 0 ? (
            <p className="record-detail-page__field-hint">
              Adicione etapas do serviço para estimar horas e compor o orçamento.
            </p>
          ) : null}
          {quoteMode === "commercial_fixed" && suggestedPrice > 0 ? (
            <p className="record-detail-page__field-hint">
              Tarifa (referência): {formatCurrency(suggestedPrice)}
              {isBatch ? ` · unitário ${formatCurrency(suggestedUnitPrice)}` : ""}
            </p>
          ) : null}
          <div className="records-form__two-columns">
            <div>
              <Label>
                {quoteMode === "commercial_fixed"
                  ? isBatch
                    ? "Valor fechado do lote (R$)"
                    : "Valor fechado da proposta (R$)"
                  : isBatch
                    ? "Valor proposto do lote (R$)"
                    : "Valor proposto (R$)"}
              </Label>
              {isBatch && suggestedUnitPrice > 0 && quoteMode === "tariff" ? (
                <p className="record-detail-page__field-hint">
                  Unitário: {formatCurrency(suggestedUnitPrice)} · Total ({getRecordQuantity(record)} peças):{" "}
                  {formatCurrency(suggestedPrice)}
                </p>
              ) : null}
              <Input
                type="number"
                min="0"
                disabled={readOnly}
                value={record.proposedValue ?? ""}
                onChange={(event) =>
                  onUpdate({ proposedValue: event.target.value ? Number(event.target.value) : null })
                }
                className="h-12"
                placeholder={suggestedPrice ? String(suggestedPrice) : ""}
              />
            </div>
            {!readOnly && suggestedPrice > 0 && quoteMode === "tariff" ? (
              <div className="records-form__apply-price">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => onUpdate({ proposedValue: suggestedPrice })}
                >
                  Usar tarifa ({formatCurrency(suggestedPrice)})
                </Button>
              </div>
            ) : null}
          </div>
          {needsPriceOverride ? (
            <div>
              <Label>Justificativa para valor diferente da tarifa</Label>
              <textarea
                disabled={readOnly}
                value={record.priceOverrideReason ?? ""}
                onChange={(event) => onUpdate({ priceOverrideReason: event.target.value })}
                className="records-form__textarea"
                rows={2}
              />
            </div>
          ) : null}
          <div>
            <Label>Premissas</Label>
            <textarea
              disabled={readOnly}
              value={record.assumptions}
              onChange={(event) => onUpdate({ assumptions: event.target.value })}
              className="records-form__textarea"
              rows={3}
            />
          </div>
          {!readOnly ? (
            <div className="record-detail-page__workspace-footer">
              <Button type="button" size="lg" onClick={onSave}>Salvar bloco A</Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="record-section">
          <h2>Premissas</h2>
          <textarea
            disabled={readOnly}
            value={record.assumptions}
            onChange={(event) => onUpdate({ assumptions: event.target.value })}
            className="records-form__textarea"
            rows={3}
          />
          {!readOnly ? (
            <div className="record-detail-page__workspace-footer">
              <Button type="button" size="lg" onClick={onSave}>Salvar bloco A</Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
