import { REQUEST_STATUS_LABELS, type RequestStatus } from "./types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`request-status request-status--${status.toLowerCase()}`} role="status">
      {REQUEST_STATUS_LABELS[status]}
    </span>
  );
}
