import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";

/** Recursos típicos por tipo de serviço — guia a seleção em cada etapa. */
export const SERVICE_TYPE_RESOURCE_IDS: Partial<Record<string, string[]>> = {
  "vocab-1": ["vocab-5", "vocab-13", "vocab-16", "vocab-17"],
  "vocab-2": ["vocab-10", "vocab-18"],
  "vocab-9": ["vocab-19", "vocab-29"],
  "vocab-23": ["vocab-11"],
};

export function getStageResourceOptions(
  serviceTypeId: string,
  resources: VocabularyTerm[],
): VocabularyTerm[] {
  const active = resources.filter((term) => term.class === "RESOURCE" && term.active);
  const allowed = SERVICE_TYPE_RESOURCE_IDS[serviceTypeId];
  if (!allowed) {
    return active;
  }
  const allowedSet = new Set(allowed);
  return active.filter((term) => allowedSet.has(term.id));
}

export function getDefaultStageResourceId(
  serviceTypeId: string,
  resources: VocabularyTerm[],
): string | null {
  const options = getStageResourceOptions(serviceTypeId, resources);
  return options[0]?.id ?? null;
}
