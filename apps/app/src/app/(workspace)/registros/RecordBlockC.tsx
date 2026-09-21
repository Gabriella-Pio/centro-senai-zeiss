import { Lock } from "lucide-react";
import { Button, Label } from "@cem/ui";
import { canAccessBlock } from "@/lib/record-lifecycle";
import type { VocabularyTerm } from "../vocabulario/types";
import { VISIBILITY_LABELS, type RecordVisibility, type ServiceRecord } from "./types";

export function RecordBlockC({
  record,
  readOnly,
  deviationCauses,
  relatedTopics,
  onUpdate,
  onComplete,
}: {
  record: ServiceRecord;
  readOnly: boolean;
  deviationCauses: VocabularyTerm[];
  relatedTopics: VocabularyTerm[];
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onComplete: () => void;
}) {
  const accessible = canAccessBlock(record, "C");

  if (!accessible) {
    return (
      <div className="record-detail-page__locked-panel">
        <Lock aria-hidden="true" />
        <p>Salve o bloco B para registrar a lição aprendida.</p>
      </div>
    );
  }

  return (
    <div className="records-form">
          <div>
            <Label>Causa do desvio</Label>
            <select
              disabled={readOnly}
              value={record.deviationCauseId ?? ""}
              onChange={(event) => onUpdate({ deviationCauseId: event.target.value || null })}
              className="record-select"
            >
              <option value="">Selecionar</option>
              {deviationCauses.map((term) => (
                <option key={term.id} value={term.id}>{term.label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Lição aprendida</Label>
            <textarea
              disabled={readOnly}
              value={record.lesson}
              onChange={(event) => onUpdate({ lesson: event.target.value })}
              className="records-form__textarea"
              rows={5}
            />
          </div>
          <div>
            <Label>Assuntos relacionados</Label>
            <p className="record-detail-page__field-hint">
              Vincule termos do vocabulário para melhorar recomendações do Assistente.
            </p>
            <div className="record-chip-list">
              {relatedTopics.map((term) => (
                <button
                  key={term.id}
                  type="button"
                  disabled={readOnly}
                  className={`record-chip${record.relatedTopicIds.includes(term.id) ? " record-chip--active" : ""}`}
                  onClick={() =>
                    onUpdate({
                      relatedTopicIds: record.relatedTopicIds.includes(term.id)
                        ? record.relatedTopicIds.filter((id) => id !== term.id)
                        : [...record.relatedTopicIds, term.id],
                    })
                  }
                >
                  {term.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Sigilo</Label>
            <select
              disabled={readOnly}
              value={record.visibility}
              onChange={(event) => onUpdate({ visibility: event.target.value as RecordVisibility })}
              className="record-select"
            >
              {Object.entries(VISIBILITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
      {!readOnly && record.serviceStatus !== "COMPLETED" ? (
        <div className="record-detail-page__workspace-footer">
          <Button type="button" size="lg" onClick={onComplete}>
            Concluir serviço e enviar lição
          </Button>
        </div>
      ) : null}
    </div>
  );
}
