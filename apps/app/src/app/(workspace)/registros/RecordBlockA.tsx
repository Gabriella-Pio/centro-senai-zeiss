import { Button, Input, Label } from "@cem/ui";
import { formatCurrency } from "@/lib/pricing";
import { getRecordQuantity, getRecordScopeMode } from "@/lib/record-helpers";
import { getRecordStages } from "@/lib/record-stages";
import type { VocabularyTerm } from "../vocabulario/types";
import { RecordServiceStagesEditor } from "./RecordServiceStagesEditor";
import { RecordVocabularyPicker } from "./RecordVocabularyPicker";
import type { ServiceRecord } from "./types";

export function RecordBlockA({
  record,
  readOnly,
  serviceTypes,
  partTraits,
  resources,
  suggestedPrice,
  needsPriceOverride,
  onUpdate,
  onSave,
}: {
  record: ServiceRecord;
  readOnly: boolean;
  serviceTypes: VocabularyTerm[];
  partTraits: VocabularyTerm[];
  resources: VocabularyTerm[];
  suggestedPrice: number;
  needsPriceOverride: boolean;
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onSave: () => void;
}) {
  const scopeMode = getRecordScopeMode(record);
  const isBatch = scopeMode === "batch";
  const stages = getRecordStages(record, serviceTypes);

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

  return (
    <div className="records-form">
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

      <div className="record-section">
        <h2>Valor e premissas</h2>
        {stages.length === 0 ? (
          <p className="record-detail-page__field-hint">
            Adicione etapas do serviço para estimar horas e compor o orçamento.
          </p>
        ) : null}
        <div className="records-form__two-columns">
          <div>
            <Label>Valor proposto (R$)</Label>
            <Input
              type="number"
              min="0"
              disabled={readOnly}
              value={record.proposedValue ?? ""}
              onChange={(event) => onUpdate({ proposedValue: event.target.value ? Number(event.target.value) : null })}
              className="h-12"
              placeholder={suggestedPrice ? String(suggestedPrice) : ""}
            />
          </div>
          {!readOnly && suggestedPrice > 0 ? (
            <div className="records-form__apply-price">
              <Button type="button" variant="outline" size="lg" onClick={() => onUpdate({ proposedValue: suggestedPrice })}>
                Usar sugerido ({formatCurrency(suggestedPrice)})
              </Button>
            </div>
          ) : null}
        </div>
        {needsPriceOverride ? (
          <div>
            <Label>Justificativa para valor diferente do sugerido</Label>
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
    </div>
  );
}
