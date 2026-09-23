import { Button, Input } from "@cem/ui";
import { formatCurrency } from "@/lib/pricing";
import {
  QUOTE_MODE_DESCRIPTIONS,
  QUOTE_MODE_LABELS,
  getRecordQuoteMode,
} from "@/lib/quote-mode";
import { getRecordQuantity, isBatchRecord } from "@/lib/record-helpers";
import { getRecordStages, sumStageEstimatedHours } from "@/lib/record-stages";
import type { VocabularyTerm } from "../vocabulario/types";
import { RecordFieldError, RecordFieldLabel } from "./RecordFieldLabel";
import type { RecordBlockAFieldErrors } from "./record-block-field-errors";
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
  fieldErrors,
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
  fieldErrors?: RecordBlockAFieldErrors;
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onSave: () => void;
}) {
  const errors = fieldErrors ?? {};
  const quoteMode = getRecordQuoteMode(record);
  const isBatch = isBatchRecord(record);
  const stages = getRecordStages(record, serviceTypes);
  const stageHoursTotal = sumStageEstimatedHours(stages);
  const isPackageMode = quoteMode === "hourly_package";
  const packageHoursFromStages = Boolean(isPackageMode && stages.length > 0 && stageHoursTotal);

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
    if (mode === "hourly_package") {
      patch.stageHoursScope = "total";
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
              <RecordFieldLabel htmlFor="record-batch-quantity">Quantidade de peças</RecordFieldLabel>
              <Input
                id="record-batch-quantity"
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
              <RecordFieldLabel htmlFor="record-batch-label">Identificação do lote</RecordFieldLabel>
              <Input
                id="record-batch-label"
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
            <RecordFieldLabel htmlFor="record-piece-label">Identificação da peça</RecordFieldLabel>
            <Input
              id="record-piece-label"
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
            <RecordFieldLabel required htmlFor="record-package-ref">
              Referência do pacote
            </RecordFieldLabel>
            <Input
              id="record-package-ref"
              disabled={readOnly}
              value={record.hoursPackageRef ?? ""}
              onChange={(event) => onUpdate({ hoursPackageRef: event.target.value })}
              className={`h-12${errors.hoursPackageRef ? " records-form__input--error" : ""}`}
              placeholder="Ex.: Pacote anual 120 h — Cargill 2026"
              aria-invalid={errors.hoursPackageRef ? true : undefined}
            />
            <RecordFieldError error={errors.hoursPackageRef} />
          </div>
          <div className="records-form__two-columns">
            <div>
              <RecordFieldLabel required htmlFor="record-package-hours">
                Horas totais do pacote
              </RecordFieldLabel>
              {packageHoursFromStages ? (
                <p className="record-detail-page__field-hint">
                  Atualizado automaticamente pela soma das etapas ({stageHoursTotal?.toFixed(1)} h).
                </p>
              ) : null}
              <Input
                id="record-package-hours"
                type="number"
                min="0"
                step="0.5"
                disabled={readOnly || packageHoursFromStages}
                value={record.estimatedHours ?? ""}
                onChange={(event) =>
                  onUpdate({
                    estimatedHours: event.target.value ? Number(event.target.value) : null,
                  })
                }
                className={`h-12${errors.estimatedHours ? " records-form__input--error" : ""}`}
                aria-invalid={errors.estimatedHours ? true : undefined}
              />
              <RecordFieldError error={errors.estimatedHours} />
            </div>
            <div>
              <RecordFieldLabel required htmlFor="record-package-value">
                Valor do contrato (R$)
              </RecordFieldLabel>
              <Input
                id="record-package-value"
                type="number"
                min="0"
                disabled={readOnly}
                value={record.proposedValue ?? ""}
                onChange={(event) =>
                  onUpdate({ proposedValue: event.target.value ? Number(event.target.value) : null })
                }
                className={`h-12${errors.proposedValue ? " records-form__input--error" : ""}`}
                aria-invalid={errors.proposedValue ? true : undefined}
              />
              <RecordFieldError error={errors.proposedValue} />
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
          stagesError={errors.stages}
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
              <RecordFieldLabel required htmlFor="record-proposed-value">
                {quoteMode === "commercial_fixed"
                  ? isBatch
                    ? "Valor fechado do lote (R$)"
                    : "Valor fechado da proposta (R$)"
                  : isBatch
                    ? "Valor proposto do lote (R$)"
                    : "Valor proposto (R$)"}
              </RecordFieldLabel>
              {isBatch && suggestedUnitPrice > 0 && quoteMode === "tariff" ? (
                <p className="record-detail-page__field-hint">
                  Unitário: {formatCurrency(suggestedUnitPrice)} · Total ({getRecordQuantity(record)} peças):{" "}
                  {formatCurrency(suggestedPrice)}
                </p>
              ) : null}
              <Input
                id="record-proposed-value"
                type="number"
                min="0"
                disabled={readOnly}
                value={record.proposedValue ?? ""}
                onChange={(event) =>
                  onUpdate({ proposedValue: event.target.value ? Number(event.target.value) : null })
                }
                className={`h-12${errors.proposedValue ? " records-form__input--error" : ""}`}
                placeholder={suggestedPrice ? String(suggestedPrice) : ""}
                aria-invalid={errors.proposedValue ? true : undefined}
              />
              <RecordFieldError error={errors.proposedValue} />
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
              <RecordFieldLabel required htmlFor="record-price-override">
                Justificativa para valor diferente da tarifa
              </RecordFieldLabel>
              <textarea
                id="record-price-override"
                disabled={readOnly}
                value={record.priceOverrideReason ?? ""}
                onChange={(event) => onUpdate({ priceOverrideReason: event.target.value })}
                className={`records-form__textarea${errors.priceOverrideReason ? " records-form__input--error" : ""}`}
                rows={2}
                aria-invalid={errors.priceOverrideReason ? true : undefined}
              />
              <RecordFieldError error={errors.priceOverrideReason} />
            </div>
          ) : null}
          <div>
            <RecordFieldLabel htmlFor="record-assumptions">Premissas</RecordFieldLabel>
            <textarea
              id="record-assumptions"
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
          <RecordFieldLabel htmlFor="record-package-assumptions">Premissas</RecordFieldLabel>
          <textarea
            id="record-package-assumptions"
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
