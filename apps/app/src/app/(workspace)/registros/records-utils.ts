import type { ServiceRecord, ServiceStatus } from "./types";

export function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDeliveredAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

export function fromDateInputValue(value: string) {
  if (!value) {
    return null;
  }
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

export function sortRecordsByCreatedDesc(records: ServiceRecord[]) {
  return [...records].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function filterRecords(
  records: ServiceRecord[],
  query: string,
  status: "ALL" | ServiceStatus,
  company: string,
) {
  const needle = query.trim().toLowerCase();
  return sortRecordsByCreatedDesc(
    records.filter((record) => {
      if (status !== "ALL" && record.serviceStatus !== status) {
        return false;
      }
      if (company !== "ALL" && record.company !== company) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [record.company, record.service, record.requester, record.batchLabel ?? "", record.recordNumber]
        .some((value) => value.toLowerCase().includes(needle));
    }),
  );
}

export function countRecordsByStatus(records: ServiceRecord[]) {
  return records.reduce(
    (counts, record) => {
      counts[record.serviceStatus] += 1;
      counts.ALL += 1;
      return counts;
    },
    { ALL: 0, DRAFT: 0, QUOTED: 0, COMPLETED: 0 } as Record<"ALL" | ServiceStatus, number>,
  );
}
