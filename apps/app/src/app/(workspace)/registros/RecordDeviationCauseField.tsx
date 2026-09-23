"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Input } from "@cem/ui";
import type { VocabularyTerm } from "../vocabulario/types";
import { RecordFieldError, RecordFieldLabel } from "./RecordFieldLabel";

export function RecordDeviationCauseField({
  value,
  causes,
  readOnly,
  error,
  onChange,
  onCreateCause,
}: {
  value: string | null;
  causes: VocabularyTerm[];
  readOnly: boolean;
  error?: string;
  onChange: (causeId: string | null) => void;
  onCreateCause: (label: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  function submitNewCause() {
    const label = draft.trim();
    if (label.length < 2) {
      setCreateError("Informe uma causa com pelo menos 2 caracteres.");
      return;
    }
    onCreateCause(label);
    setDraft("");
    setCreating(false);
    setCreateError(null);
  }

  return (
    <div className="record-deviation-cause">
      <RecordFieldLabel required htmlFor="record-deviation-cause">
        Causa do desvio
      </RecordFieldLabel>
      <p className="record-detail-page__field-hint">
        Selecione um padrão existente ou cadastre um novo — ele será salvo no vocabulário para reutilizar.
      </p>

      <select
        id="record-deviation-cause"
        disabled={readOnly}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className={`record-select${error ? " records-form__input--error" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "record-deviation-cause-error" : undefined}
      >
        <option value="">Selecionar</option>
        {causes.map((term) => (
          <option key={term.id} value={term.id}>{term.label}</option>
        ))}
      </select>
      <RecordFieldError id="record-deviation-cause-error" error={error} />

      {!readOnly ? (
        creating ? (
          <div className="record-deviation-cause__create">
            <Input
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setCreateError(null);
              }}
              className="h-11"
              placeholder="Ex.: Geometria complexa não prevista"
              aria-label="Nova causa de desvio"
              autoFocus
            />
            <div className="record-deviation-cause__create-actions">
              <Button type="button" size="sm" onClick={submitNewCause}>
                Salvar no vocabulário
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCreating(false);
                  setDraft("");
                  setCreateError(null);
                }}
              >
                Cancelar
              </Button>
            </div>
            {createError ? (
              <p className="record-deviation-cause__error" role="alert">{createError}</p>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            className="record-vocab-add-panel__trigger"
            onClick={() => setCreating(true)}
          >
            <Plus aria-hidden="true" />
            Cadastrar nova causa
          </button>
        )
      ) : null}
    </div>
  );
}
