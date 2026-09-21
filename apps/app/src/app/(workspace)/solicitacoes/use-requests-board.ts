"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createEmptyRecord, nextRequestNumber, pushNotification, updateDemoState } from "@/lib/demo-store";
import {
  archiveRequestState,
  assignRequest,
  convertRequestState,
} from "@/lib/request-lifecycle";
import { useDemoStore } from "@/lib/use-demo-store";
import type { QuoteRequest, RequestStatus } from "./types";
import { countRequestsByStatus, filterRequests } from "./requests-utils";

export function useRequestsBoard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { requests, vocabulary } = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | RequestStatus>("ALL");
  const [pendingClose, setPendingClose] = useState(false);
  const [assignTarget, setAssignTarget] = useState<QuoteRequest | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<QuoteRequest | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const solicitacaoId = searchParams.get("solicitacao");
  const statusCounts = useMemo(() => countRequestsByStatus(requests), [requests]);
  const filtered = useMemo(() => filterRequests(requests, query, status), [query, requests, status]);
  const selected = useMemo(() => {
    if (pendingClose || !solicitacaoId) {
      return null;
    }
    return requests.find((request) => request.id === solicitacaoId) ?? null;
  }, [pendingClose, requests, solicitacaoId]);
  const filtering = Boolean(query.trim()) || status !== "ALL";

  useEffect(() => {
    if (!solicitacaoId) {
      setPendingClose(false);
    }
  }, [solicitacaoId]);

  const syncSolicitacaoParam = useCallback(
    (requestId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (requestId) {
        if (params.get("solicitacao") === requestId) return;
        params.set("solicitacao", requestId);
      } else {
        if (!params.has("solicitacao")) return;
        params.delete("solicitacao");
      }
      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  function openRequest(request: QuoteRequest) {
    setPendingClose(false);
    syncSolicitacaoParam(request.id);
  }

  function closeRequest() {
    setPendingClose(true);
    syncSolicitacaoParam(null);
  }

  function persistRequests(next: QuoteRequest[], message: string) {
    updateDemoState((state) => ({ ...state, requests: next }));
    setNotice(message);
  }

  function handleAssign(request: QuoteRequest, userId: string, userName: string) {
    const next = requests.map((item) =>
      item.id === request.id ? assignRequest(item, userId, userName) : item,
    );
    persistRequests(next, `Solicitação atribuída para ${userName}.`);
    pushNotification({
      roles: ["VALIDADOR", "TECNICO"],
      message: `Você recebeu a solicitação ${request.requestNumber}.`,
      href: `/solicitacoes?solicitacao=${request.id}`,
    });
    setAssignTarget(null);
    setPendingClose(false);
    syncSolicitacaoParam(request.id);
  }

  function handleConvert(request: QuoteRequest) {
    const serviceType = vocabulary.find(
      (term) => term.class === "SERVICE_TYPE" && term.label.toLowerCase() === request.service.toLowerCase(),
    );
    const record = createEmptyRecord({
      requestId: request.id,
      requestNumber: request.requestNumber,
      company: request.company,
      service: request.service,
      requester: request.requester,
      serviceTypeId: serviceType?.id,
      assumptions: `Solicitação recebida: ${request.message}`,
    });
    updateDemoState((state) => ({
      ...state,
      records: [...state.records, record],
      requests: state.requests.map((item) =>
        item.id === request.id ? convertRequestState(item, record) : item,
      ),
    }));
    pushNotification({
      roles: ["TECNICO"],
      message: `Novo registro ${record.recordNumber} pronto para orçamento.`,
      href: `/registros/${record.id}`,
    });
    setNotice("Registro criado a partir da solicitação.");
    setPendingClose(true);
    syncSolicitacaoParam(null);
    router.push(`/registros/${record.id}`);
  }

  function handleArchive(request: QuoteRequest, reason: string) {
    const next = requests.map((item) =>
      item.id === request.id ? archiveRequestState(item, reason) : item,
    );
    persistRequests(next, "Solicitação arquivada com justificativa.");
    setArchiveTarget(null);
    setPendingClose(true);
    syncSolicitacaoParam(null);
  }

  function simulateWebsiteRequest() {
    const request: QuoteRequest = {
      id: `request-${Date.now()}`,
      requestNumber: nextRequestNumber(requests),
      requester: "Cliente demonstração",
      company: "Indústria Alfa",
      email: "contato@industriaalfa.example",
      phone: "+55 62 99999-0000",
      service: "Inspeção dimensional",
      message: "Precisamos de orçamento para inspeção dimensional de 12 carcaças usinadas.",
      receivedAt: new Date().toISOString(),
      status: "NEW",
    };
    updateDemoState((state) => ({ ...state, requests: [request, ...state.requests] }));
    pushNotification({
      roles: ["ADMIN", "VALIDADOR"],
      message: "Nova solicitação de orçamento recebida pelo site.",
      href: "/solicitacoes",
    });
    setNotice("Pedido simulado adicionado à fila.");
  }

  function clearFilters() {
    setQuery("");
    setStatus("ALL");
  }

  return {
    query,
    setQuery,
    status,
    setStatus,
    selected,
    assignTarget,
    setAssignTarget,
    archiveTarget,
    setArchiveTarget,
    notice,
    statusCounts,
    filtered,
    filtering,
    openRequest,
    closeRequest,
    handleAssign,
    handleConvert,
    handleArchive,
    simulateWebsiteRequest,
    clearFilters,
  };
}
