import type { VocabularyClass, VocabularyTerm } from "@/app/(workspace)/vocabulario/types";

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

export function findVocabularyTerm(
  vocabulary: VocabularyTerm[],
  label: string,
  className: VocabularyClass,
) {
  const needle = normalizeLabel(label);
  return vocabulary.find(
    (term) => term.class === className && normalizeLabel(term.label) === needle,
  );
}

export function createVocabularyTerm(input: {
  label: string;
  class: VocabularyClass;
  guidance?: string;
}): VocabularyTerm {
  const label = input.label.trim();
  return {
    id: `vocab-${Date.now()}`,
    label,
    class: input.class,
    guidance: input.guidance?.trim() ?? "",
    active: true,
    updatedAt: new Date().toISOString(),
  };
}

export function upsertVocabularyTerm(
  vocabulary: VocabularyTerm[],
  input: { label: string; class: VocabularyClass; guidance?: string },
): { vocabulary: VocabularyTerm[]; term: VocabularyTerm } {
  const existing = findVocabularyTerm(vocabulary, input.label, input.class);
  if (existing) {
    return { vocabulary, term: existing };
  }
  const term = createVocabularyTerm(input);
  return { vocabulary: [...vocabulary, term], term };
}
