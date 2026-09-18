export type VocabularyClass = "SERVICE_TYPE" | "PART_TRAIT" | "RESOURCE" | "DEVIATION_CAUSE";

export type VocabularyTerm = {
  id: string;
  label: string;
  class: VocabularyClass;
  guidance: string;
  active: boolean;
  updatedAt: string;
  /** Tarifa horária (R$/h) — apenas para recursos do laboratório. */
  hourlyRate?: number;
};

export const VOCABULARY_CLASS_LABELS: Record<VocabularyClass, string> = {
  SERVICE_TYPE: "Tipo de serviço",
  PART_TRAIT: "Característica da peça",
  RESOURCE: "Recurso",
  DEVIATION_CAUSE: "Causa de desvio",
};

export const VOCABULARY_CLASSES: VocabularyClass[] = [
  "SERVICE_TYPE",
  "PART_TRAIT",
  "RESOURCE",
  "DEVIATION_CAUSE",
];
