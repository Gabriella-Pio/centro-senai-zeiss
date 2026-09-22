import type { MachineTariff } from "@/lib/machine-tariff";
import type { VocabularyTerm } from "./types";

export function findTariffForResource(
  machineTariffs: MachineTariff[],
  resourceId: string,
) {
  return machineTariffs.find((tariff) => tariff.resourceId === resourceId);
}

export function isTariffManagedResource(
  term: VocabularyTerm,
  machineTariffs: MachineTariff[],
) {
  return term.class === "RESOURCE" && Boolean(findTariffForResource(machineTariffs, term.id));
}

export function getTariffHref(tariff: MachineTariff) {
  return `/tarifas?ativo=${tariff.id}`;
}
