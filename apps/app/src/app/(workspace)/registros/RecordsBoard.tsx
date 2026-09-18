"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ClipboardList, FilterX, Plus, Search } from "lucide-react";
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label } from "@cem/ui";
import type { UserRole } from "@/lib/api";
import { createEmptyRecord, updateDemoState } from "@/lib/demo-store";
import { formatEffort } from "@/lib/record-helpers";
import { formatCurrency } from "@/lib/pricing";
import { useDemoStore } from "@/lib/use-demo-store";
import { SERVICE_STATUS_LABELS, type ServiceRecord, type ServiceStatus } from "./types";
import "./records.css";

function canViewRecord(record: ServiceRecord, role: UserRole) {
  if (record.visibility === "RESTRICTED" && role === "CONSULTA") {
    return false;
  }
  return true;
}

export function RecordsBoard({ userRole, userName }: { userRole: UserRole; userName: string }) {
  const router = useRouter();
  const { records, vocabulary } = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ServiceStatus>("ALL");
  const [company, setCompany] = useState("ALL");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ company: "", requester: "", service: "", serviceTypeId: "" });

  const serviceTypes = vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active);

  const visibleRecords = useMemo(
    () => records.filter((record) => canViewRecord(record, userRole)),
    [records, userRole],
  );

  const companies = useMemo(
    () => [...new Set(visibleRecords.map((record) => record.company))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [visibleRecords],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visibleRecords.filter((record) => {
      if (status !== "ALL" && record.serviceStatus !== status) return false;
      if (company !== "ALL" && record.company !== company) return false;
      const haystack = [record.company, record.service, record.requester, record.batchLabel ?? ""];
      return !needle || haystack.some((value) => value.toLowerCase().includes(needle));
    });
  }, [company, query, status, visibleRecords]);

  const filtering = Boolean(query.trim()) || status !== "ALL" || company !== "ALL";

  function createRecord() {
    if (!draft.company.trim() || !draft.requester.trim() || !draft.serviceTypeId) {
      setFormError("Preencha empresa, solicitante e tipo de serviço.");
      return;
    }
    const serviceType = serviceTypes.find((term) => term.id === draft.serviceTypeId);
    const record = createEmptyRecord({
      company: draft.company.trim(),
      requester: draft.requester.trim(),
      service: serviceType?.label ?? draft.service.trim(),
      serviceTypeId: draft.serviceTypeId,
      estimatedBy: userName,
    });
    updateDemoState((state) => ({ ...state, records: [...state.records, record] }));
    setDraft({ company: "", requester: "", service: "", serviceTypeId: "" });
    setFormError(null);
    setCreating(false);
    router.push(`/registros/${record.id}`);
  }

  return (
    <main className="records-page">
      <header className="records-page__header">
        <div>
          <p className="records-page__eyebrow"><ClipboardList aria-hidden="true" /> Ciclo do serviço</p>
          <h1 className="records-page__title">Registros de serviço</h1>
          <p className="records-page__intro">Acompanhe o que foi orçado, realizado e aprendido em cada serviço do laboratório.</p>
        </div>
        {userRole !== "CONSULTA" ? (
          <Button type="button" size="lg" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> Novo registro</Button>
        ) : null}
      </header>

      <div className="records-page__summary">
        <div><strong>{visibleRecords.length}</strong><span>registros</span></div>
        <div><strong>{visibleRecords.filter((record) => record.serviceStatus === "DRAFT").length}</strong><span>rascunhos</span></div>
        <div><strong>{visibleRecords.filter((record) => record.lessonStatus === "PENDING").length}</strong><span>em validação</span></div>
        <p>Dados da demonstração</p>
      </div>

      <section className="records-page__content" aria-labelledby="records-heading">
        <div className="records-page__toolbar">
          <div className="records-page__search"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar empresa, serviço ou lote" className="h-12 pl-10 text-base" /></div>
          <div>
            <Label htmlFor="record-company-filter" className="sr-only">Filtrar por empresa</Label>
            <select id="record-company-filter" value={company} onChange={(event) => setCompany(event.target.value)} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base">
              <option value="ALL">Todas as empresas</option>
              {companies.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="record-status-filter" className="sr-only">Filtrar por status</Label>
            <select id="record-status-filter" value={status} onChange={(event) => setStatus(event.target.value as "ALL" | ServiceStatus)} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base">
              <option value="ALL">Todos os status</option>
              {Object.entries(SERVICE_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          {filtering ? <Button type="button" variant="ghost" size="sm" onClick={() => { setQuery(""); setStatus("ALL"); setCompany("ALL"); }}><FilterX aria-hidden="true" /> Limpar</Button> : <p className="records-page__count">{filtered.length} registros</p>}
        </div>

        <div className="records-page__table-wrap">
          {filtered.length === 0 ? <div className="records-page__empty"><p>Nenhum registro encontrado.</p></div> : (
            <table className="records-page__table">
              <thead><tr><th>Registro</th><th>Empresa</th><th>Serviço</th><th>Esforço</th><th>Status</th><th>Ação</th></tr></thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id}>
                    <td><strong className="records-page__number">{record.recordNumber}</strong><span>{record.requestNumber ?? "Sem solicitação"}</span></td>
                    <td><strong>{record.company}</strong><span>{record.requester}</span></td>
                    <td>
                      {record.service}
                      {record.batchLabel ? <span className="records-page__batch">{record.batchLabel}</span> : null}
                      {(record.stages?.length ?? 0) > 0 ? <span className="records-page__batch">{record.stages!.length} etapas</span> : null}
                    </td>
                    <td>
                      {formatEffort(record)}
                      {record.proposedValue ? <span className="records-page__value">{formatCurrency(record.proposedValue)}</span> : null}
                    </td>
                    <td><Badge variant="outline">{SERVICE_STATUS_LABELS[record.serviceStatus]}</Badge></td>
                    <td><Link href={`/registros/${record.id}`} className="records-page__open">Abrir</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl">
          <DialogHeader><DialogTitle>Novo registro de serviço</DialogTitle><DialogDescription>Informe os dados básicos. O orçamento completo fica na página do registro.</DialogDescription></DialogHeader>
          <div className="records-form">
            <div><Label htmlFor="record-company">Empresa</Label><Input id="record-company" value={draft.company} onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))} className="mt-2 h-12" /></div>
            <div><Label htmlFor="record-requester">Solicitante</Label><Input id="record-requester" value={draft.requester} onChange={(event) => setDraft((current) => ({ ...current, requester: event.target.value }))} className="mt-2 h-12" /></div>
            <div><Label htmlFor="record-service-type">Tipo de serviço</Label><select id="record-service-type" value={draft.serviceTypeId} onChange={(event) => setDraft((current) => ({ ...current, serviceTypeId: event.target.value }))} className="mt-2 h-12 w-full rounded-(--radius) border border-input bg-card px-3"><option value="">Selecionar do vocabulário</option>{serviceTypes.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></div>
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            <div className="records-form__actions"><Button type="button" variant="outline" onClick={() => setCreating(false)}>Cancelar</Button><Button type="button" onClick={createRecord}>Criar e abrir</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
