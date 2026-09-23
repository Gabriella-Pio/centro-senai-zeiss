"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Label } from "@cem/ui";
import type { VocabularyTerm } from "../vocabulario/types";
import { RecordVocabularyAddPanel } from "./RecordVocabularyAddPanel";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function RecordVocabularyPicker({
  label,
  hint,
  terms,
  selectedIds,
  readOnly,
  emptyLabel = "Nenhum termo encontrado.",
  addLabel = "Adicionar",
  renderMeta,
  onChange,
}: {
  label: string;
  hint?: string;
  terms: VocabularyTerm[];
  selectedIds: string[];
  readOnly: boolean;
  emptyLabel?: string;
  addLabel?: string;
  renderMeta?: (term: VocabularyTerm) => string | null;
  onChange: (nextIds: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const selectedTerms = useMemo(
    () => selectedIds.map((id) => terms.find((term) => term.id === id)).filter((term): term is VocabularyTerm => Boolean(term)),
    [selectedIds, terms],
  );

  const availableCount = useMemo(
    () => terms.filter((term) => !selectedIds.includes(term.id)).length,
    [selectedIds, terms],
  );

  const filtered = useMemo(() => {
    const needle = normalize(query);
    const available = terms.filter((term) => !selectedIds.includes(term.id));
    if (!needle) {
      return available;
    }
    return available.filter((term) =>
      [term.label, term.guidance ?? "", renderMeta?.(term) ?? ""].some((value) => normalize(value).includes(needle)),
    );
  }, [query, renderMeta, selectedIds, terms]);

  function toggle(termId: string) {
    if (readOnly) return;
    onChange(
      selectedIds.includes(termId)
        ? selectedIds.filter((id) => id !== termId)
        : [...selectedIds, termId],
    );
  }

  return (
    <div className="record-vocab-picker">
      <div className="record-vocab-picker__header">
        <Label>{label}</Label>
        {hint ? <p className="record-detail-page__field-hint">{hint}</p> : null}
      </div>

      {selectedTerms.length > 0 ? (
        <div className="record-vocab-picker__selected" aria-label={`${label} selecionados`}>
          {selectedTerms.map((term) => (
            <span key={term.id} className="record-vocab-picker__chip">
              <span>{term.label}</span>
              {!readOnly ? (
                <button
                  type="button"
                  className="record-vocab-picker__chip-remove"
                  aria-label={`Remover ${term.label}`}
                  onClick={() => toggle(term.id)}
                >
                  <X aria-hidden="true" />
                </button>
              ) : null}
            </span>
          ))}
        </div>
      ) : (
        <p className="record-vocab-picker__empty-selection">Nenhum selecionado.</p>
      )}

      {!readOnly ? (
        <RecordVocabularyAddPanel
          addLabel={addLabel}
          canAdd={availableCount > 0}
          query={query}
          onQueryChange={setQuery}
          searchPlaceholder="Buscar no vocabulário..."
          searchAriaLabel={`Buscar ${label.toLowerCase()}`}
        >
          {filtered.length === 0 ? (
            <p className="record-vocab-picker__empty-list">
              {query.trim()
                ? `Nenhum resultado para "${query.trim()}".`
                : emptyLabel}
            </p>
          ) : (
            filtered.map((term) => {
              const meta = renderMeta?.(term);
              return (
                <button
                  key={term.id}
                  type="button"
                  role="option"
                  className="record-vocab-picker__option"
                  onClick={() => toggle(term.id)}
                >
                  <span className="record-vocab-picker__option-label">{term.label}</span>
                  {term.guidance ? <span className="record-vocab-picker__option-guidance">{term.guidance}</span> : null}
                  {meta ? <span className="record-vocab-picker__option-meta">{meta}</span> : null}
                </button>
              );
            })
          )}
        </RecordVocabularyAddPanel>
      ) : null}
    </div>
  );
}
