"use client";

import Link from "next/link";
import { Archive, ArrowRight, ClipboardPlus, UserRound } from "lucide-react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@cem/ui";
import { getRecordDetailPath } from "@/lib/records-navigation";
import { getAllowedActions } from "@/lib/request-lifecycle";
import type { QuoteRequest } from "./types";
import { formatReceivedAt } from "./requests-utils";
import { RequestStatusBadge } from "./RequestStatusBadge";

function RequestWorkflowStepper({ request }: { request: QuoteRequest }) {
  const steps = [
    {
      id: "received",
      label: "Recebida",
      done: true,
      current: request.status === "NEW",
      detail: formatReceivedAt(request.receivedAt),
    },
    {
      id: "assigned",
      label: "Atribuída",
      done: request.status === "ASSIGNED" || request.status === "CONVERTED",
      current: request.status === "ASSIGNED",
      detail: request.assignedToName ?? "Aguardando responsável",
    },
    {
      id: "converted",
      label: "Registro criado",
      done: request.status === "CONVERTED",
      current: request.status === "CONVERTED",
      detail: request.linkedRecordNumber ?? "Pendente",
    },
  ];

  if (request.status === "ARCHIVED") {
    return (
      <ol className="request-stepper" aria-label="Progresso da solicitação">
        {steps.slice(0, request.assignedToName ? 2 : 1).map((step) => (
          <li key={step.id} className="request-stepper__item request-stepper__item--done">
            <span className="request-stepper__label">{step.label}</span>
            <span className="request-stepper__detail">{step.detail}</span>
          </li>
        ))}
        <li className="request-stepper__item request-stepper__item--current request-stepper__item--archived">
          <span className="request-stepper__label">Arquivada</span>
          <span className="request-stepper__detail">{request.archiveReason ?? "Sem justificativa"}</span>
        </li>
      </ol>
    );
  }

  return (
    <ol className="request-stepper" aria-label="Progresso da solicitação">
      {steps.map((step) => (
        <li
          key={step.id}
          className={`request-stepper__item${step.done ? " request-stepper__item--done" : ""}${step.current ? " request-stepper__item--current" : ""}`}
        >
          <span className="request-stepper__label">{step.label}</span>
          <span className="request-stepper__detail">{step.detail}</span>
        </li>
      ))}
    </ol>
  );
}

export function RequestDetailDialog({
  request,
  open,
  onOpenChange,
  onAssign,
  onConvert,
  onArchive,
}: {
  request: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (request: QuoteRequest) => void;
  onConvert: (request: QuoteRequest) => void;
  onArchive: (request: QuoteRequest) => void;
}) {
  if (!request) {
    return null;
  }

  const actions = getAllowedActions(request);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="request-detail-modal max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-2xl">
        <DialogHeader className="request-detail__header">
          <div className="request-detail__header-copy">
            <DialogTitle className="text-xl font-semibold">
              {request.requestNumber} · {request.company}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Solicitação recebida em {formatReceivedAt(request.receivedAt)} · {request.service}
            </DialogDescription>
          </div>
          <RequestStatusBadge status={request.status} />
        </DialogHeader>

        <div className="request-detail">
          <RequestWorkflowStepper request={request} />

          <div className="request-detail__contact">
            <div className="request-detail__contact-card">
              <span className="request-detail__contact-label">Empresa</span>
              <strong className="request-detail__company">{request.company}</strong>
              <span className="request-detail__contact-label">Contato</span>
              <strong className="request-detail__requester">{request.requester}</strong>
              <div className="request-detail__contact-links">
                <a href={`mailto:${request.email}`}>{request.email}</a>
                <a href={`tel:${request.phone.replace(/\s+/g, "")}`}>{request.phone}</a>
              </div>
            </div>
          </div>

          {request.assignedToName ? (
            <div className="request-detail__assignee">
              <UserRound aria-hidden="true" />
              <span>Responsável: <strong>{request.assignedToName}</strong></span>
            </div>
          ) : null}

          <div className="request-detail__message">
            <span>Mensagem enviada</span>
            <p>{request.message}</p>
          </div>

          {request.status === "ARCHIVED" && request.archiveReason ? (
            <div className="request-detail__archive-reason">
              <span>Motivo do arquivamento</span>
              <p>{request.archiveReason}</p>
            </div>
          ) : null}

          {request.linkedRecordId && request.linkedRecordNumber ? (
            <div className="request-detail__record-link">
              <span>Registro de Serviço relacionado</span>
              <Link href={getRecordDetailPath(request.linkedRecordId)}>
                {request.linkedRecordNumber}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          ) : null}

          {actions.length > 0 ? (
            <DialogFooter className="gap-3 sm:gap-3">
              {actions.includes("archive") ? (
                <Button type="button" variant="outline" size="lg" onClick={() => onArchive(request)}>
                  <Archive aria-hidden="true" />
                  Arquivar
                </Button>
              ) : null}
              {actions.includes("assign") || actions.includes("reassign") ? (
                <Button type="button" variant="outline" size="lg" onClick={() => onAssign(request)}>
                  <UserRound aria-hidden="true" />
                  {actions.includes("reassign") ? "Reatribuir" : "Atribuir responsável"}
                </Button>
              ) : null}
              {actions.includes("convert") ? (
                <Button type="button" size="lg" onClick={() => onConvert(request)}>
                  <ClipboardPlus aria-hidden="true" />
                  Criar registro de serviço
                </Button>
              ) : null}
              {actions.includes("openRecord") && request.linkedRecordId ? (
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href={getRecordDetailPath(request.linkedRecordId)} />}
                >
                  Abrir registro
                  <ArrowRight aria-hidden="true" />
                </Button>
              ) : null}
            </DialogFooter>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
