import { Lock } from "lucide-react";
import { Button, Input, Label } from "@cem/ui";
import { canAccessBlock } from "@/lib/record-lifecycle";
import { resolveBilledValue } from "@/lib/record-helpers";
import { formatCurrency } from "@/lib/pricing";
import type { VocabularyTerm } from "../vocabulario/types";
import { RecordServiceStagesEditor } from "./RecordServiceStagesEditor";
import { fromDateInputValue, toDateInputValue } from "./records-utils";
import type { ServiceRecord } from "./types";

export function RecordBlockB({
  record,
  readOnly,
  serviceTypes,
  resources,
  actualCost,
  onUpdate,
  onSave,
}: {
  record: ServiceRecord;
  readOnly: boolean;
  serviceTypes: VocabularyTerm[];
  resources: VocabularyTerm[];
  actualCost: number | null;
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onSave: () => void;
}) {
  const accessible = canAccessBlock(record, "B");
  const suggestedBilled = record.proposedValue ?? null;
  const displayBilled = record.billedValue ?? "";
  const effectiveBilled = resolveBilledValue(record);

  if (!accessible) {
    return (
      <div className="record-detail-page__locked-panel">
        <Lock aria-hidden="true" />
        <p>Salve o bloco A para registrar a execução.</p>
      </div>
    );
  }

  return (
    <div className="records-form">
      <div className="record-section">
        <h2>Execução por etapa</h2>
        <RecordServiceStagesEditor
          record={record}
          serviceTypes={serviceTypes}
          resources={resources}
          readOnly={readOnly}
          mode="actual"
          onUpdate={onUpdate}
        />
      </div>

      <div className="record-section">
        <h2>Faturamento e entrega</h2>
        <div className="records-form__two-columns">
          <div>
            <Label>Custo real calculado (R$)</Label>
            <p className="record-detail-page__field-hint">
              Calculado automaticamente pelas tarifas.
            </p>
            <Input
              type="text"
              readOnly
              value={actualCost ? formatCurrency(actualCost) : "—"}
              className="h-12 record-block-b__readonly"
              aria-readonly="true"
            />
          </div>
          <div>
            <Label>Valor faturado (R$)</Label>
            {suggestedBilled ? (
              <p className="record-detail-page__field-hint">
                Sugerido pelo orçamento: {formatCurrency(suggestedBilled)}.
                {record.billedValue === null ? " Será usado automaticamente ao salvar." : ""}
              </p>
            ) : null}
            <Input
              type="number"
              min="0"
              disabled={readOnly}
              value={displayBilled}
              onChange={(event) =>
                onUpdate({ billedValue: event.target.value ? Number(event.target.value) : null })
              }
              className="h-12"
              placeholder={suggestedBilled ? String(suggestedBilled) : undefined}
            />
            {!readOnly && suggestedBilled && record.billedValue !== suggestedBilled ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="record-block-b__apply-billed"
                onClick={() => onUpdate({ billedValue: suggestedBilled })}
              >
                Usar valor do orçamento ({formatCurrency(suggestedBilled)})
              </Button>
            ) : null}
            {readOnly && effectiveBilled ? (
              <p className="record-detail-page__field-hint">
                Faturado: {formatCurrency(effectiveBilled)}
              </p>
            ) : null}
          </div>
        </div>
        <div>
          <Label>Data de entrega</Label>
          <Input
            type="date"
            disabled={readOnly}
            value={toDateInputValue(record.deliveredAt)}
            onChange={(event) => onUpdate({ deliveredAt: fromDateInputValue(event.target.value) })}
            className="h-12"
          />
        </div>
      </div>

      <div className="record-flag-grid">
        <label className={`record-flag${record.rework ? " record-flag--active" : ""}`}>
          <input
            type="checkbox"
            disabled={readOnly}
            checked={record.rework}
            onChange={(event) => onUpdate({ rework: event.target.checked })}
          />
          <span>Houve retrabalho?</span>
        </label>
        <label className={`record-flag${record.scopeChange ? " record-flag--active" : ""}`}>
          <input
            type="checkbox"
            disabled={readOnly}
            checked={record.scopeChange}
            onChange={(event) => onUpdate({ scopeChange: event.target.checked })}
          />
          <span>Mudança de escopo?</span>
        </label>
      </div>

      {!readOnly ? (
        <div className="record-detail-page__workspace-footer">
          <Button type="button" size="lg" onClick={onSave}>Salvar bloco B</Button>
        </div>
      ) : null}
    </div>
  );
}
