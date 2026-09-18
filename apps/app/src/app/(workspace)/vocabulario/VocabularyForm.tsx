"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Label } from "@cem/ui";
import type { VocabularyClass, VocabularyTerm } from "./types";
import { VOCABULARY_CLASS_LABELS, VOCABULARY_CLASSES } from "./types";

export function VocabularyForm({
  term,
  onCancel,
  onSave,
}: {
  term?: VocabularyTerm;
  onCancel: () => void;
  onSave: (term: VocabularyTerm) => void;
}) {
  const [label, setLabel] = useState(term?.label ?? "");
  const [termClass, setTermClass] = useState<VocabularyClass>(term?.class ?? "SERVICE_TYPE");
  const [guidance, setGuidance] = useState(term?.guidance ?? "");
  const [hourlyRate, setHourlyRate] = useState(term?.hourlyRate ? String(term.hourlyRate) : "");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (label.trim().length < 2) {
      setError("Informe um termo com pelo menos 2 caracteres.");
      return;
    }
    if (termClass === "RESOURCE" && hourlyRate && Number(hourlyRate) <= 0) {
      setError("Informe uma tarifa horária válida para o recurso.");
      return;
    }
    onSave({
      id: term?.id ?? `vocab-${Date.now()}`,
      label: label.trim(),
      class: termClass,
      guidance: guidance.trim(),
      active: term?.active ?? true,
      updatedAt: new Date().toISOString(),
      ...(termClass === "RESOURCE" && hourlyRate ? { hourlyRate: Number(hourlyRate) } : {}),
    });
  }

  return (
    <form className="vocabulary-form" onSubmit={onSubmit} noValidate>
      <div className="vocabulary-form__field">
        <Label htmlFor="vocabulary-label" className="text-base">Termo</Label>
        <Input id="vocabulary-label" value={label} onChange={(event) => setLabel(event.target.value)} className="h-12 text-base" placeholder="Ex.: Inspeção dimensional" autoFocus required />
      </div>
      <div className="vocabulary-form__field">
        <Label htmlFor="vocabulary-class" className="text-base">Classe</Label>
        <select id="vocabulary-class" value={termClass} onChange={(event) => setTermClass(event.target.value as VocabularyClass)} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50">
          {VOCABULARY_CLASSES.map((value) => <option key={value} value={value}>{VOCABULARY_CLASS_LABELS[value]}</option>)}
        </select>
      </div>
      {termClass === "RESOURCE" ? (
        <div className="vocabulary-form__field">
          <Label htmlFor="vocabulary-rate" className="text-base">Tarifa horária (R$/h)</Label>
          <Input id="vocabulary-rate" type="number" min="0" step="1" value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} className="h-12 text-base" placeholder="Ex.: 380" />
          <p className="vocabulary-form__hint">Valor da planilha hora-máquina do laboratório.</p>
        </div>
      ) : null}
      <div className="vocabulary-form__field">
        <Label htmlFor="vocabulary-guidance" className="text-base">Orientação de uso <span className="vocabulary-form__optional">opcional</span></Label>
        <textarea id="vocabulary-guidance" value={guidance} onChange={(event) => setGuidance(event.target.value)} className="vocabulary-form__textarea" rows={4} placeholder="Explique quando este termo deve ser usado." />
      </div>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <div className="vocabulary-form__actions">
        <Button type="button" variant="outline" size="xl" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="xl">{term ? "Salvar termo" : "Criar termo"}</Button>
      </div>
    </form>
  );
}
