"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArrowRight, Bell, ClipboardPlus, FilterX, Plus, Search } from "lucide-react";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label } from "@cem/ui";
import { createEmptyRecord, nextRequestNumber, pushNotification, updateDemoState } from "@/lib/demo-store";
import { useDemoStore } from "@/lib/use-demo-store";
import { REQUEST_STATUS_LABELS, type QuoteRequest, type RequestStatus } from "./types";
import "./requests.css";

const REQUEST_STATUSES: RequestStatus[] = ["NEW", "IN_REVIEW", "CONVERTED", "ARCHIVED"];

function formatReceivedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function RequestsBoard() {
  const router = useRouter();
  const { requests, vocabulary } = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | RequestStatus>("ALL");
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<QuoteRequest | null>(null);
  const [archiveReason, setArchiveReason] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return requests.filter((request) => {
      if (status !== "ALL" && request.status !== status) return false;
      return !needle || [request.requester, request.company, request.service, request.email].some((value) => value.toLowerCase().includes(needle));
    });
  }, [query, requests, status]);

  const newCount = requests.filter((request) => request.status === "NEW").length;
  const filtering = Boolean(query.trim()) || status !== "ALL";

  function persistRequests(next: QuoteRequest[], message: string) {
    updateDemoState((state) => ({ ...state, requests: next }));
    setNotice(message);
    setSelected(null);
  }

  function convertToRecord(request: QuoteRequest) {
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
        item.id === request.id ? { ...item, status: "CONVERTED", linkedRecordNumber: record.recordNumber } : item,
      ),
    }));
    pushNotification({
      roles: ["TECNICO"],
      message: `Novo registro ${record.recordNumber} pronto para orçamento.`,
      href: "/registros",
    });
    setNotice("Registro criado a partir da solicitação.");
    setSelected(null);
    router.push("/registros");
  }

  function archiveRequest() {
    if (!archiveTarget || archiveReason.trim().length < 5) return;
    persistRequests(
      requests.map((item) =>
        item.id === archiveTarget.id ? { ...item, status: "ARCHIVED", archiveReason: archiveReason.trim() } : item,
      ),
      "Solicitação arquivada com justificativa.",
    );
    setArchiveTarget(null);
    setArchiveReason("");
  }

  function updateStatus(request: QuoteRequest, nextStatus: RequestStatus) {
    persistRequests(
      requests.map((item) => (item.id === request.id ? { ...item, status: nextStatus } : item)),
      "Solicitação atualizada.",
    );
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

  return (
    <main className="requests-page">
      <header className="requests-page__header">
        <div>
          <p className="requests-page__eyebrow"><Bell aria-hidden="true" /> Entrada comercial</p>
          <h1 className="requests-page__title">Solicitações de orçamento</h1>
          <p className="requests-page__intro">Acompanhe o que chegou pelo site e transforme oportunidades aprovadas em registros do laboratório.</p>
        </div>
        <div className="requests-page__header-actions">
          {newCount > 0 ? <div className="requests-page__new-count"><strong>{newCount}</strong><span>novas solicitações</span></div> : null}
          <Button type="button" variant="outline" onClick={simulateWebsiteRequest}><Plus aria-hidden="true" /> Simular pedido do site</Button>
        </div>
      </header>

      <div className="requests-page__summary"><div><strong>{requests.length}</strong><span>solicitações no total</span></div><div><strong>{newCount}</strong><span>aguardando análise</span></div><p>Dados da demonstração</p></div>

      <section className="requests-page__content" aria-labelledby="requests-heading">
        <div className="requests-page__toolbar">
          <div className="requests-page__search"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar empresa, pessoa ou serviço" aria-label="Pesquisar empresa, pessoa ou serviço" className="h-12 pl-10 text-base" /></div>
          <div><Label htmlFor="request-status-filter" className="sr-only">Filtrar por situação</Label><select id="request-status-filter" value={status} onChange={(event) => setStatus(event.target.value as "ALL" | RequestStatus)} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"><option value="ALL">Todas as situações</option>{REQUEST_STATUSES.map((value) => <option key={value} value={value}>{REQUEST_STATUS_LABELS[value]}</option>)}</select></div>
          {filtering ? <Button type="button" variant="ghost" size="sm" onClick={clearFilters}><FilterX aria-hidden="true" /> Limpar</Button> : <p className="requests-page__count">{filtered.length} solicitações</p>}
        </div>
        {notice ? <p className="requests-page__notice" role="status">{notice}</p> : null}
        <h2 id="requests-heading" className="sr-only">Solicitações recebidas</h2>
        <div className="requests-page__table-wrap">{filtered.length === 0 ? <div className="requests-page__empty"><FilterX aria-hidden="true" /><p>Nenhuma solicitação encontrada.</p>{filtering ? <Button type="button" variant="outline" onClick={clearFilters}>Limpar filtros</Button> : null}</div> : <table className="requests-page__table"><thead><tr><th>Solicitação</th><th>Empresa</th><th>Serviço</th><th>Situação</th><th className="requests-page__actions-heading">Ação</th></tr></thead><tbody>{filtered.map((request) => <tr key={request.id} onClick={() => setSelected(request)}><td><strong className="requests-page__number">{request.requestNumber}</strong><span>{request.linkedRecordNumber ?? "Sem registro"}</span></td><td><strong>{request.company}</strong><span>{request.requester} · {request.email}</span></td><td>{request.service}</td><td><span className={`request-status request-status--${request.status.toLowerCase()}`}>{REQUEST_STATUS_LABELS[request.status]}</span></td><td className="requests-page__actions"><Button type="button" variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); setSelected(request); }}>Ver detalhes <ArrowRight aria-hidden="true" /></Button></td></tr>)}</tbody></table>}</div>
      </section>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-2xl"><DialogHeader><DialogTitle className="text-xl font-semibold">{selected?.requestNumber} · {selected?.company}</DialogTitle><DialogDescription className="text-base text-muted-foreground">Solicitação recebida em {selected ? formatReceivedAt(selected.receivedAt) : ""} · {selected?.service}</DialogDescription></DialogHeader>{selected ? <div className="request-detail"><div className="request-detail__contact"><p><strong>{selected.requester}</strong><span>{selected.email}</span><span>{selected.phone}</span></p><span className={`request-status request-status--${selected.status.toLowerCase()}`}>{REQUEST_STATUS_LABELS[selected.status]}</span></div><div className="request-detail__message"><span>Mensagem enviada</span><p>{selected.message}</p></div>{selected.linkedRecordNumber ? <div className="request-detail__record-link"><span>Registro de Serviço relacionado</span><strong>{selected.linkedRecordNumber}</strong></div> : null}<div className="request-detail__actions">{selected.status === "NEW" ? <Button type="button" variant="outline" onClick={() => updateStatus(selected, "IN_REVIEW")}>Marcar em análise</Button> : null}{selected.status !== "CONVERTED" && selected.status !== "ARCHIVED" ? <Button type="button" onClick={() => convertToRecord(selected)}><ClipboardPlus aria-hidden="true" /> Criar registro de serviço</Button> : null}{selected.status !== "ARCHIVED" ? <Button type="button" variant="ghost" onClick={() => { setArchiveTarget(selected); setSelected(null); }}><Archive aria-hidden="true" /> Arquivar</Button> : null}</div></div> : null}</DialogContent></Dialog>
      <Dialog open={archiveTarget !== null} onOpenChange={(open) => { if (!open) { setArchiveTarget(null); setArchiveReason(""); } }}><DialogContent className="gap-5 p-6 sm:max-w-lg"><DialogHeader><DialogTitle className="text-xl font-semibold">Arquivar solicitação</DialogTitle><DialogDescription className="text-base text-muted-foreground">Registre por que esta solicitação não seguirá para um Registro de Serviço.</DialogDescription></DialogHeader><div className="request-archive-form"><Label htmlFor="archive-reason">Justificativa</Label><textarea id="archive-reason" value={archiveReason} onChange={(event) => setArchiveReason(event.target.value)} placeholder="Ex.: cliente mudou o escopo e encerrou o pedido." rows={4} autoFocus /><div className="request-detail__actions"><Button type="button" variant="outline" onClick={() => setArchiveTarget(null)}>Cancelar</Button><Button type="button" disabled={archiveReason.trim().length < 5} onClick={archiveRequest}>Confirmar arquivamento</Button></div></div></DialogContent></Dialog>
    </main>
  );
}
