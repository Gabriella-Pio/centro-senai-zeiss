import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@cem/ui";
import { formatEffort } from "@/lib/record-helpers";
import { formatCurrency } from "@/lib/pricing";
import { getRecordDetailPath, getRequestHref } from "@/lib/records-navigation";
import type { ServiceRecord } from "./types";
import { formatCreatedAt } from "./records-utils";
import { RecordLessonStatusBadge, RecordStatusBadge } from "./RecordStatusBadge";

export function RecordsTable({ records }: { records: ServiceRecord[] }) {
  return (
    <table className="records-page__table" aria-label="Registros de serviço do laboratório">
      <caption className="sr-only">
        Lista de registros com número, empresa, serviço, esforço, situação e ação para abrir detalhes.
      </caption>
      <thead>
        <tr>
          <th scope="col">Registro</th>
          <th scope="col">Empresa</th>
          <th scope="col">Serviço</th>
          <th scope="col">Esforço</th>
          <th scope="col">Situação</th>
          <th scope="col" className="records-page__actions-heading">Ação</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr
            key={record.id}
            className={record.serviceStatus === "DRAFT" ? "records-page__row--draft" : undefined}
          >
            <td>
              <strong className="records-page__number">{record.recordNumber}</strong>
              <span>{formatCreatedAt(record.createdAt)}</span>
              {record.requestId && record.requestNumber ? (
                <Link href={getRequestHref(record.requestId)} className="records-page__request-link">
                  {record.requestNumber}
                </Link>
              ) : (
                <span className="records-page__meta-muted">{record.requestNumber ?? "Sem solicitação"}</span>
              )}
            </td>
            <td>
              <div className="records-page__company-cell">
                <strong className="records-page__company">{record.company}</strong>
                <span className="records-page__requester">{record.requester}</span>
              </div>
            </td>
            <td>
              <span className="records-page__service">{record.service}</span>
              {record.batchLabel ? <span className="records-page__batch">{record.batchLabel}</span> : null}
              {(record.stages?.length ?? 0) > 1 ? (
                <span className="records-page__batch">{record.stages!.length} etapas</span>
              ) : null}
            </td>
            <td>
              <span>{formatEffort(record)}</span>
              {record.proposedValue ? (
                <span className="records-page__value">{formatCurrency(record.proposedValue)}</span>
              ) : null}
            </td>
            <td>
              <div className="records-page__status-cell">
                <RecordStatusBadge status={record.serviceStatus} />
                <RecordLessonStatusBadge status={record.lessonStatus} />
              </div>
            </td>
            <td className="records-page__actions">
              <Button
                nativeButton={false}
                render={<Link href={getRecordDetailPath(record.id)} />}
                variant="ghost"
                size="icon"
                className="records-page__view-button"
                aria-label={`Abrir registro ${record.recordNumber}`}
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
