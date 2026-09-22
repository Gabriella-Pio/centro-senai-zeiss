import { Lock } from "lucide-react";
import { Button, Label } from "@cem/ui";
import { canAccessBlock } from "@/lib/record-lifecycle";
import { deriveRelatedTopicIds } from "@/lib/record-helpers";
import type { VocabularyTerm } from "../vocabulario/types";
import { VOCABULARY_CLASS_LABELS } from "../vocabulario/types";
import { RecordDeviationCauseField } from "./RecordDeviationCauseField";
import { VISIBILITY_LABELS, type RecordVisibility, type ServiceRecord } from "./types";

export function RecordBlockC({
  record,
  readOnly,
  deviationCauses,
  vocabulary,
  onUpdate,
  onCreateDeviationCause,
  onComplete,
}: {
  record: ServiceRecord;
  readOnly: boolean;
  deviationCauses: VocabularyTerm[];
  vocabulary: VocabularyTerm[];
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onCreateDeviationCause: (label: string) => void;
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

  const contextIds = deriveRelatedTopicIds(record);
  const contextTerms = contextIds
    .map((id) => vocabulary.find((term) => term.id === id))
    .filter((term): term is VocabularyTerm => Boolean(term));

  const grouped = {
    SERVICE_TYPE: contextTerms.filter((term) => term.class === "SERVICE_TYPE"),
    PART_TRAIT: contextTerms.filter((term) => term.class === "PART_TRAIT"),
  };

  return (
    <div className="records-form">
      <RecordDeviationCauseField
        value={record.deviationCauseId}
        causes={deviationCauses}
        readOnly={readOnly}
        onChange={(deviationCauseId) => onUpdate({ deviationCauseId })}
        onCreateCause={onCreateDeviationCause}
      />

      <div>
        <Label>Lição aprendida</Label>
        <textarea
          disabled={readOnly}
          value={record.lesson}
          onChange={(event) => onUpdate({ lesson: event.target.value })}
          className="records-form__textarea"
          rows={5}
          placeholder="O que a equipe deve lembrar na próxima vez?"
        />
      </div>

      <div>
        <Label>Contexto do registro</Label>
        <p className="record-detail-page__field-hint">
          Montado automaticamente a partir dos blocos A e B — serviços e características já informados.
          Alimenta buscas e recomendações do Assistente.
        </p>
        {contextTerms.length > 0 ? (
          <div className="record-context-groups">
            {grouped.SERVICE_TYPE.length > 0 ? (
              <div className="record-context-group">
                <span className="record-context-group__label">
                  {VOCABULARY_CLASS_LABELS.SERVICE_TYPE}
                </span>
                <div className="record-chip-list">
                  {grouped.SERVICE_TYPE.map((term) => (
                    <span key={term.id} className="record-chip record-chip--readonly">
                      {term.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {grouped.PART_TRAIT.length > 0 ? (
              <div className="record-context-group">
                <span className="record-context-group__label">
                  {VOCABULARY_CLASS_LABELS.PART_TRAIT}
                </span>
                <div className="record-chip-list">
                  {grouped.PART_TRAIT.map((term) => (
                    <span key={term.id} className="record-chip record-chip--readonly">
                      {term.label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="record-context-empty">Nenhum termo vinculado ainda.</p>
        )}
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
