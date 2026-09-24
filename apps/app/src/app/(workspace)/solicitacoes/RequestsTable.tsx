import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@cem/ui";
import { getRecordDetailPath } from "@/lib/records-navigation";
import type { QuoteRequest } from "./types";
import { formatReceivedAt } from "./requests-utils";
import { RequestStatusBadge } from "./RequestStatusBadge";

export function RequestsTable({
  requests,
  onView,
}: {
  requests: QuoteRequest[];
  onView: (request: QuoteRequest) => void;
}) {
  return (
    <table className="requests-page__table" aria-label="Solicitações de orçamento recebidas">
      <caption className="sr-only">
        Lista de solicitações de orçamento com número, empresa, serviço, situação e ação para ver detalhes.
      </caption>
      <thead>
        <tr>
          <th scope="col">Solicitação</th>
          <th scope="col">Empresa</th>
          <th scope="col">Serviço</th>
          <th scope="col">Situação</th>
          <th scope="col" className="requests-page__actions-heading">Ação</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr
            key={request.id}
            className={request.status === "NEW" ? "requests-page__row--new" : undefined}
          >
            <td>
              <strong className="requests-page__number">{request.requestNumber}</strong>
              <span>{formatReceivedAt(request.receivedAt)}</span>
              {request.linkedRecordId && request.linkedRecordNumber ? (
                <Link href={getRecordDetailPath(request.linkedRecordId)} className="requests-page__record-link">
                  {request.linkedRecordNumber}
                </Link>
              ) : (
                <span className="requests-page__meta-muted">Sem registro</span>
              )}
            </td>
            <td>
              <div className="requests-page__company-cell">
                <strong className="requests-page__company">{request.company}</strong>
                <span className="requests-page__requester">{request.requester}</span>
                <a href={`mailto:${request.email}`} className="requests-page__contact-link">
                  {request.email}
                </a>
              </div>
            </td>
            <td>{request.service}</td>
            <td>
              <RequestStatusBadge status={request.status} />
            </td>
            <td className="requests-page__actions">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="requests-page__view-button"
                aria-label={`Ver solicitação ${request.requestNumber}`}
                onClick={() => onView(request)}
              >
                <Eye aria-hidden="true" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
