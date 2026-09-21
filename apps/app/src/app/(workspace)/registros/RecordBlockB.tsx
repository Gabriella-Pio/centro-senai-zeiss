import { Lock } from "lucide-react";
import { Button, Input, Label } from "@cem/ui";
import { canAccessBlock } from "@/lib/record-lifecycle";
import { fromDateInputValue, toDateInputValue } from "./records-utils";
import type { ServiceRecord } from "./types";

export function RecordBlockB({
  record,
  readOnly,
  onUpdate,
  onSave,
}: {
  record: ServiceRecord;
  readOnly: boolean;
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onSave: () => void;
}) {
  const accessible = canAccessBlock(record, "B");

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
          <div className="records-form__two-columns">
            <div>
              <Label>Horas realizadas</Label>
              <Input
                type="number"
                min="0"
                disabled={readOnly}
                value={record.actualHours ?? ""}
                onChange={(event) => onUpdate({ actualHours: event.target.value ? Number(event.target.value) : null })}
                className="h-12"
              />
            </div>
            <div>
              <Label>Custo real (R$)</Label>
              <Input
                type="number"
                min="0"
                disabled={readOnly}
                value={record.actualCost ?? ""}
                onChange={(event) => onUpdate({ actualCost: event.target.value ? Number(event.target.value) : null })}
                className="h-12"
                placeholder={record.estimatedCost ? String(record.estimatedCost) : ""}
              />
            </div>
          </div>
          <div className="records-form__two-columns">
            <div>
              <Label>Valor faturado (R$)</Label>
              <Input
                type="number"
                min="0"
                disabled={readOnly}
                value={record.billedValue ?? ""}
                onChange={(event) => onUpdate({ billedValue: event.target.value ? Number(event.target.value) : null })}
                className="h-12"
              />
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
