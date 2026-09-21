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
  if (hours === null) {
    return null;
  }
  const quantity = getRecordQuantity(record);
  return quantity > 1 ? hours / quantity : hours;
}

export function formatEffort(record: ServiceRecord) {
  if (!record.estimatedHours) {
    return "A definir";
  }
  const quantity = getRecordQuantity(record);
  if (quantity > 1) {
    const perPiece = Math.round((record.estimatedHours / quantity) * 10) / 10;
    return `${record.estimatedHours} h total · ${perPiece} h/peça × ${quantity}`;
  }
  return `${record.estimatedHours} h`;
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
