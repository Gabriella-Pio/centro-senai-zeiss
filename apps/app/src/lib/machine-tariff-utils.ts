import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { DemoState } from "./demo-store-types";
import type { MachineTariff } from "./machine-tariff";

export function isMachineTariffActive(tariff: MachineTariff) {
  return !tariff.archivedAt;
}

export function filterActiveTariffs(tariffs: MachineTariff[]) {
  return tariffs.filter(isMachineTariffActive);
}

export function filterArchivedTariffs(tariffs: MachineTariff[]) {
  return tariffs.filter((tariff) => !isMachineTariffActive(tariff));
}

export type TariffAssetFilter = "active" | "archived" | "all";

export function filterTariffsByStatus(tariffs: MachineTariff[], filter: TariffAssetFilter) {
  if (filter === "active") return filterActiveTariffs(tariffs);
  if (filter === "archived") return filterArchivedTariffs(tariffs);
  return tariffs;
}

export function guardTariffDraft(hasDraft: boolean, action: () => void) {
  if (!confirmDiscardDraft(hasDraft)) return;
  action();
}

export type ResourceUsageCount = {
  records: number;
  total: number;
};

function recordUsesResource(record: ServiceRecord, resourceId: string) {
  if (record.resourceIds?.includes(resourceId)) return true;
  if (record.stages?.some((stage) => stage.resourceIds.includes(resourceId))) return true;
  if (record.quoteSnapshot?.resourceRates && resourceId in record.quoteSnapshot.resourceRates) return true;
  return false;
}

export function getResourceUsageCount(state: DemoState, resourceId: string): ResourceUsageCount {
  const records = state.records.filter((record) => recordUsesResource(record, resourceId)).length;
  return { records, total: records };
}

export function isLabelTaken(tariffs: MachineTariff[], label: string, excludeId?: string) {
  const normalized = label.trim().toLocaleLowerCase("pt-BR");
  return tariffs.some(
    (tariff) =>
      tariff.id !== excludeId &&
      isMachineTariffActive(tariff) &&
      tariff.label.trim().toLocaleLowerCase("pt-BR") === normalized,
  );
}

export function confirmDiscardDraft(hasDraft: boolean) {
  if (!hasDraft) return true;
  return window.confirm("Descartar alterações não salvas neste ativo?");
}
