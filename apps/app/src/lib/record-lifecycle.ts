import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import { getRequestHref, getValidationHref } from "@/lib/records-navigation";
import { resolveBilledValue } from "@/lib/record-helpers";
import { getRecordQuoteMode } from "@/lib/quote-mode";
import {
  stagesHaveResources,
  sumStageActualHours,
  sumStageEstimatedHours,
} from "@/lib/record-stages";

export type RecordBlock = "A" | "B" | "C";

export type RecordDetailNotice = {
  id: string;
  message: string;
  tone: "info" | "warning" | "success";
  href?: string;
  linkLabel?: string;
};

function hasServiceStages(record: ServiceRecord) {
  return (record.stages?.length ?? 0) > 0 || Boolean(record.serviceTypeId);
}

function hasEstimatedHours(record: ServiceRecord) {
  const stageTotal = sumStageEstimatedHours(record.stages ?? []);
  return Boolean(stageTotal ?? record.estimatedHours);
}

function hasStageResources(record: ServiceRecord) {
  if (record.stages && record.stages.length > 0) {
    return stagesHaveResources(record.stages);
  }
  return record.resourceIds.length > 0;
}

export function isBlockDone(record: ServiceRecord, block: RecordBlock): boolean {
  if (block === "A") {
    if (getRecordQuoteMode(record) === "hourly_package") {
      return Boolean(
        record.hoursPackageRef?.trim() &&
          record.estimatedHours &&
          record.proposedValue,
      );
    }
    return Boolean(
      hasServiceStages(record) &&
        hasEstimatedHours(record) &&
        record.proposedValue &&
        hasStageResources(record),
    );
  }
  if (block === "B") {
    const stageHours = sumStageActualHours(record.stages ?? [], { allowFallback: false });
    return Boolean((stageHours ?? record.actualHours) && resolveBilledValue(record));
  }
  return Boolean(record.deviationCauseId && record.lesson.trim());
}

export function canAccessBlock(record: ServiceRecord, block: RecordBlock): boolean {
  if (record.serviceStatus === "COMPLETED") {
    return true;
  }
  if (block === "A") {
    return true;
  }
  if (block === "B") {
    return record.serviceStatus === "QUOTED";
  }
  return record.serviceStatus === "QUOTED" && isBlockDone(record, "B");
}

export function getSuggestedBlock(record: ServiceRecord): RecordBlock {
  if (record.serviceStatus === "DRAFT") {
    return "A";
  }
  if (record.serviceStatus === "QUOTED" && !isBlockDone(record, "B")) {
    return "B";
  }
  return "C";
}

export function getRecordDetailNotices(record: ServiceRecord): RecordDetailNotice[] {
  const notices: RecordDetailNotice[] = [];

  if (record.requestId && record.requestNumber) {
    notices.push({
      id: "origin-request",
      message: `Criado a partir da solicitação ${record.requestNumber}.`,
      tone: "info",
      href: getRequestHref(record.requestId),
      linkLabel: `Abrir ${record.requestNumber}`,
    });
  }

  if (record.serviceStatus === "QUOTED" && record.quoteSnapshot) {
    notices.push({
      id: "frozen-quote",
      message: "Orçamento congelado. Alterações no bloco A atualizam a prévia, mas o snapshot salvo permanece como referência.",
      tone: "info",
    });
  }

  if (record.serviceStatus === "DRAFT") {
    notices.push({
      id: "draft-quote",
      message: "Complete o bloco A e salve para congelar o orçamento antes da execução.",
      tone: "warning",
    });
  }

  if (record.serviceStatus === "COMPLETED" && record.lessonStatus === "PENDING") {
    notices.push({
      id: "lesson-pending",
      message: "Lição enviada e aguardando validação pelo time.",
      tone: "warning",
      href: getValidationHref(record.id),
      linkLabel: "Ir para validação",
    });
  }

  if (record.lessonStatus === "FORMALIZED") {
    notices.push({
      id: "lesson-formalized",
      message: "Lição formalizada e disponível para o Assistente.",
      tone: "success",
    });
  }

  return notices;
}
