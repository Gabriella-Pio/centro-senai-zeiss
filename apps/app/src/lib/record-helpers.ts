import type { ServiceRecord } from "@/app/(workspace)/registros/types";

export function getRecordQuantity(record: ServiceRecord) {
  return record.quantity ?? 1;
}

export function getRecordScopeMode(record: ServiceRecord): "single" | "batch" {
  if (record.recordKind === "batch") {
    return "batch";
  }
  if (record.recordKind === "single") {
    return "single";
  }
  return getRecordQuantity(record) > 1 ? "batch" : "single";
}

export function isBatchRecord(record: ServiceRecord) {
  return getRecordScopeMode(record) === "batch";
}

export function resolveQuoteHours(record: ServiceRecord) {
  const hours = record.estimatedHours ?? 0;
  if (record.resourceIds.length > 0) {
    return { teamHours: 0, equipmentHours: hours };
  }
  return { teamHours: hours, equipmentHours: 0 };
}

export function isCompositeRecord(record: ServiceRecord) {
  return (record.stages?.length ?? 0) > 1;
}

export function getComparableHours(record: ServiceRecord, field: "estimated" | "actual") {
  const hours = field === "estimated" ? record.estimatedHours : record.actualHours;
  return hours ?? null;
}

export function getTotalEffortHours(record: ServiceRecord, field: "estimated" | "actual") {
  const perPiece = getComparableHours(record, field);
  if (perPiece === null) {
    return null;
  }
  return Math.round(perPiece * getRecordQuantity(record) * 10) / 10;
}

export function formatEffort(record: ServiceRecord) {
  if (!record.estimatedHours) {
    return "A definir";
  }
  const quantity = getRecordQuantity(record);
  if (quantity > 1) {
    const total = getTotalEffortHours(record, "estimated");
    return `${record.estimatedHours} h/peça · ${total} h total (${quantity} peças)`;
  }
  return `${record.estimatedHours} h`;
}

export function formatActualEffort(record: ServiceRecord) {
  if (!record.actualHours) {
    return "—";
  }
  const quantity = getRecordQuantity(record);
  if (quantity > 1) {
    const total = getTotalEffortHours(record, "actual");
    return `${record.actualHours} h/peça · ${total} h total (${quantity} peças)`;
  }
  return `${record.actualHours} h`;
}

export function getRecordChartLabel(record: ServiceRecord) {
  if (record.batchLabel) {
    return record.batchLabel;
  }
  if (record.recordNumber) {
    return record.recordNumber.replace("RS-2026-", "");
  }
  return record.service;
}

/** Termos de serviço e características usados no registro — alimentam busca e Assistente. */
export function deriveRelatedTopicIds(record: ServiceRecord) {
  const ids = new Set<string>();
  record.partTraitIds.forEach((id) => ids.add(id));
  if (record.serviceTypeId) {
    ids.add(record.serviceTypeId);
  }
  record.stages?.forEach((stage) => {
    if (stage.serviceTypeId) {
      ids.add(stage.serviceTypeId);
    }
  });
  return [...ids];
}

export function resolveBilledValue(record: ServiceRecord) {
  return record.billedValue ?? record.proposedValue ?? null;
}
