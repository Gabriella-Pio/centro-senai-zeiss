"use client";

import { useState, type ReactNode } from "react";
import { Plus, Search, X } from "lucide-react";
import { Input } from "@cem/ui";

export function RecordVocabularyAddPanel({
  addLabel,
  searchPlaceholder,
  searchAriaLabel,
  canAdd,
  query,
  onQueryChange,
  open: openProp,
  onOpenChange,
  children,
}: {
  addLabel: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  canAdd: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    if (openProp === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
    if (!next) {
      onQueryChange("");
    }
  }

  if (!canAdd && !open) {
    return null;
  }

  if (!open) {
    return (
      <button type="button" className="record-vocab-add-panel__trigger" onClick={() => setOpen(true)}>
        <Plus aria-hidden="true" />
        {addLabel}
      </button>
    );
  }

  return (
    <div className="record-vocab-add-panel">
      <div className="record-vocab-add-panel__head">
        <span className="record-vocab-add-panel__title">{addLabel}</span>
        <button type="button" className="record-vocab-add-panel__close" onClick={() => setOpen(false)} aria-label="Fechar">
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="record-vocab-picker__search">
        <Search aria-hidden="true" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-11"
          aria-label={searchAriaLabel}
          autoFocus
        />
      </div>
      <div className="record-vocab-picker__list" role="listbox">
        {children}
      </div>
    </div>
  );
}
