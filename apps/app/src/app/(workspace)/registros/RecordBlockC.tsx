import { Lock } from "lucide-react";
import { Button } from "@cem/ui";
import { canAccessBlock } from "@/lib/record-lifecycle";
import { deriveRelatedTopicIds } from "@/lib/record-helpers";
import type { VocabularyTerm } from "../vocabulario/types";
import { VOCABULARY_CLASS_LABELS } from "../vocabulario/types";
import { RecordDeviationCauseField } from "./RecordDeviationCauseField";
import { RecordFieldError, RecordFieldLabel } from "./RecordFieldLabel";
import type { RecordBlockCFieldErrors } from "./record-block-field-errors";
import { VISIBILITY_LABELS, type RecordVisibility, type ServiceRecord } from "./types";

export function RecordBlockC({
  record,
  readOnly,
  deviationCauses,
  vocabulary,
  fieldErrors,
  onUpdate,
  onCreateDeviationCause,
  onComplete,
}: {
  record: ServiceRecord;
  readOnly: boolean;
  deviationCauses: VocabularyTerm[];
  vocabulary: VocabularyTerm[];
  fieldErrors?: RecordBlockCFieldErrors;
  onUpdate: (patch: Partial<ServiceRecord>) => void;
  onCreateDeviationCause: (label: string) => void;
  onComplete: () => void;
}) {
  const accessible = canAccessBlock(record, "C");
  const errors = fieldErrors ?? {};

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
        error={errors.deviationCauseId}
        onChange={(deviationCauseId) => onUpdate({ deviationCauseId })}
        onCreateCause={onCreateDeviationCause}
      />

      <div>
        <RecordFieldLabel required htmlFor="record-lesson">
          Lição aprendida
        </RecordFieldLabel>
        <textarea
          id="record-lesson"
          disabled={readOnly}
          value={record.lesson}
          onChange={(event) => onUpdate({ lesson: event.target.value })}
          className={`records-form__textarea${errors.lesson ? " records-form__input--error" : ""}`}
          rows={5}
          placeholder="O que a equipe deve lembrar na próxima vez?"
          aria-invalid={errors.lesson ? true : undefined}
          aria-describedby={errors.lesson ? "record-lesson-error" : undefined}
        />
        <RecordFieldError id="record-lesson-error" error={errors.lesson} />
      </div>

      <div>
        <RecordFieldLabel>Contexto do registro</RecordFieldLabel>
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
        <RecordFieldLabel htmlFor="record-visibility">Sigilo</RecordFieldLabel>
        <select
          id="record-visibility"
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
