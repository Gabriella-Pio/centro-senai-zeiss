import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, Phone, UserRound } from "lucide-react";
import { Badge } from "@cem/ui";
import { getRequestHref } from "@/lib/records-navigation";
import { getRecordQuantity } from "@/lib/record-helpers";
import { formatCreatedAt } from "./records-utils";
import type { ServiceRecord } from "./types";
import { RecordLessonDetailBadge, RecordStatusBadge } from "./RecordStatusBadge";

export function RecordDetailHeader({ record }: { record: ServiceRecord }) {
  return (
    <header className="record-detail-page__hero">
      <div className="record-detail-page__hero-main">
        <p className="record-detail-page__eyebrow">
          <ClipboardList aria-hidden="true" />
          Registro de serviço
        </p>
        <p className="record-detail-page__number">{record.recordNumber}</p>
        <h1 className="record-detail-page__title">{record.company}</h1>
        <p className="record-detail-page__subtitle">{record.service}</p>

        <ul className="record-detail-page__meta" aria-label="Informações do registro">
          <li>
            <UserRound aria-hidden="true" />
            <span>Responsável: {record.requester}</span>
          </li>
          {record.phone ? (
            <li>
              <Phone aria-hidden="true" />
              <a href={`tel:${record.phone.replace(/\s+/g, "")}`}>{record.phone}</a>
            </li>
          ) : null}
          {record.cnpj ? (
            <li>
              <span>CNPJ: {record.cnpj}</span>
            </li>
          ) : null}
          <li>
            <CalendarDays aria-hidden="true" />
            <span>Criado em {formatCreatedAt(record.createdAt)}</span>
          </li>
          {record.estimatedBy ? (
            <li>
              <span>Orçado por {record.estimatedBy}</span>
            </li>
          ) : null}
          {record.batchLabel ? (
            <li>
              <span>{record.batchLabel}</span>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="record-detail-page__hero-side">
        <div className="record-detail-page__badges">
          {getRecordQuantity(record) > 1 ? (
            <span className="record-meta-badge">Lote · {getRecordQuantity(record)} peças</span>
          ) : null}
          {(record.stages?.length ?? 0) > 1 ? (
            <span className="record-meta-badge">Composto · {record.stages!.length} etapas</span>
          ) : null}
          <RecordStatusBadge status={record.serviceStatus} />
          <RecordLessonDetailBadge status={record.lessonStatus} />
          {/* {record.isDemo ? <Badge variant="demo">Mock demo</Badge> : null} */}
        </div>

        {record.requestId && record.requestNumber ? (
          <div className="record-detail-page__request-link">
            <span>Solicitação de origem</span>
            <Link href={getRequestHref(record.requestId)}>
              {record.requestNumber}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        ) : null}
      </div>
    </header>
  );
}
