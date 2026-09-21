import type { QuoteRequest, RequestStatus } from "./types";

export function formatReceivedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function sortRequestsByReceivedDesc(requests: QuoteRequest[]) {
  return [...requests].sort(
    (left, right) => new Date(right.receivedAt).getTime() - new Date(left.receivedAt).getTime(),
  );
}

export function filterRequests(
  requests: QuoteRequest[],
  query: string,
  status: "ALL" | RequestStatus,
) {
  const needle = query.trim().toLowerCase();
  return sortRequestsByReceivedDesc(
    requests.filter((request) => {
      if (status !== "ALL" && request.status !== status) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [request.requester, request.company, request.service, request.email, request.requestNumber]
        .some((value) => value.toLowerCase().includes(needle));
    }),
  );
}

export function countRequestsByStatus(requests: QuoteRequest[]) {
  return requests.reduce(
    (counts, request) => {
      counts[request.status] += 1;
      counts.ALL += 1;
      return counts;
    },
    { ALL: 0, NEW: 0, ASSIGNED: 0, CONVERTED: 0, ARCHIVED: 0 } as Record<"ALL" | RequestStatus, number>,
  );
}
