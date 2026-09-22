"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Input, Label } from "@cem/ui";
import type { VocabularyTerm } from "../vocabulario/types";

export function RecordDeviationCauseField({
  value,
  causes,
  readOnly,
  onChange,
  onCreateCause,
}: {
  value: string | null;
  causes: VocabularyTerm[];
  readOnly: boolean;
  onChange: (causeId: string | null) => void;
  onCreateCause: (label: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submitNewCause() {
    const label = draft.trim();
    if (label.length < 2) {
      setError("Informe uma causa com pelo menos 2 caracteres.");
      return;
    }
    onCreateCause(label);
    setDraft("");
    setCreating(false);
    setError(null);
  }

  return (
    <div className="record-deviation-cause">
      <Label>Causa do desvio</Label>
      <p className="record-detail-page__field-hint">
        Selecione um padrão existente ou cadastre um novo — ele será salvo no vocabulário para reutilizar.
      </p>

      <select
        disabled={readOnly}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="record-select"
      >
        <option value="">Selecionar</option>
        {causes.map((term) => (
          <option key={term.id} value={term.id}>{term.label}</option>
        ))}
      </select>

      {!readOnly ? (
        creating ? (
          <div className="record-deviation-cause__create">
            <Input
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setError(null);
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
                  setError(null);
                }}
              >
                Cancelar
              </Button>
            </div>
            {error ? <p className="record-deviation-cause__error" role="alert">{error}</p> : null}
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
