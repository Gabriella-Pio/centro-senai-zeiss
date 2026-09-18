"use client";

import { useMemo, useState } from "react";
import { ClipboardList, FilterX, Plus, Search } from "lucide-react";
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label } from "@cem/ui";
import type { UserRole } from "@/lib/api";
import { createEmptyRecord, pushNotification, updateDemoState } from "@/lib/demo-store";
import { useDemoStore } from "@/lib/use-demo-store";
import {
  LESSON_STATUS_LABELS,
  SERVICE_STATUS_LABELS,
  VISIBILITY_LABELS,
  type RecordVisibility,
  type ServiceRecord,
  type ServiceStatus,
} from "./types";
import "./records.css";

type BlockTab = "A" | "B" | "C";

function canViewRecord(record: ServiceRecord, role: UserRole) {
  if (record.visibility === "RESTRICTED" && role === "CONSULTA") {
    return false;
  }
  return true;
}

export function RecordsBoard({ userRole, userName }: { userRole: UserRole; userName: string }) {
  const { records, vocabulary } = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ServiceStatus>("ALL");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<ServiceRecord | null>(null);
  const [activeTab, setActiveTab] = useState<BlockTab>("A");
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ company: "", requester: "", service: "", serviceTypeId: "" });

  const serviceTypes = vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active);
  const partTraits = vocabulary.filter((term) => term.class === "PART_TRAIT" && term.active);
  const resources = vocabulary.filter((term) => term.class === "RESOURCE" && term.active);
  const deviationCauses = vocabulary.filter((term) => term.class === "DEVIATION_CAUSE" && term.active);

  const visibleRecords = useMemo(
    () => records.filter((record) => canViewRecord(record, userRole)),
    [records, userRole],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visibleRecords.filter((record) => {
      if (status !== "ALL" && record.serviceStatus !== status) return false;
      return !needle || [record.company, record.service, record.requester].some((value) => value.toLowerCase().includes(needle));
    });
  }, [query, status, visibleRecords]);

  const filtering = Boolean(query.trim()) || status !== "ALL";

  function saveRecords(next: ServiceRecord[], message?: string) {
    updateDemoState((state) => ({ ...state, records: next }));
    if (message) {
      setFormError(null);
    }
  }

  function updateSelected(patch: Partial<ServiceRecord>) {
    if (!selected) return;
    const next = records.map((record) => (record.id === selected.id ? { ...record, ...patch } : record));
    const updated = next.find((record) => record.id === selected.id) ?? null;
    saveRecords(next);
    setSelected(updated);
  }

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
    saveRecords([...records, record]);
    setDraft({ company: "", requester: "", service: "", serviceTypeId: "" });
    setFormError(null);
    setCreating(false);
  }

  function saveBlockA() {
    if (!selected) return;
    if (!selected.serviceTypeId || !selected.estimatedHours) {
      setFormError("Informe tipo de serviço e horas estimadas no bloco A.");
      return;
    }
    updateSelected({ serviceStatus: "QUOTED", estimatedBy: userName });
    setFormError(null);
  }

  function completeService() {
    if (!selected) return;
    if (!selected.actualHours || !selected.deviationCauseId || !selected.lesson.trim()) {
      setFormError("Preencha bloco B e C antes de concluir o serviço.");
      return;
    }
    const next = records.map((record) =>
      record.id === selected.id
        ? { ...record, serviceStatus: "COMPLETED" as ServiceStatus, lessonStatus: "PENDING" as const }
        : record,
    );
    saveRecords(next);
    setSelected(next.find((record) => record.id === selected.id) ?? null);
    pushNotification({
      roles: ["VALIDADOR", "ADMIN"],
      message: `Lição de ${selected.recordNumber} aguarda validação.`,
      href: "/validacao",
    });
    setFormError(null);
  }

  function toggleTrait(traitId: string) {
    if (!selected) return;
    const nextTraits = selected.partTraitIds.includes(traitId)
      ? selected.partTraitIds.filter((id) => id !== traitId)
      : [...selected.partTraitIds, traitId];
    updateSelected({ partTraitIds: nextTraits });
  }

  function toggleResource(resourceId: string) {
    if (!selected) return;
    const nextResources = selected.resourceIds.includes(resourceId)
      ? selected.resourceIds.filter((id) => id !== resourceId)
      : [...selected.resourceIds, resourceId];
    updateSelected({ resourceIds: nextResources });
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
          <div className="records-page__search"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar empresa, serviço ou responsável" className="h-12 pl-10 text-base" /></div>
          <div>
            <Label htmlFor="record-status-filter" className="sr-only">Filtrar por status</Label>
            <select id="record-status-filter" value={status} onChange={(event) => setStatus(event.target.value as "ALL" | ServiceStatus)} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base">
              <option value="ALL">Todos os status</option>
              {Object.entries(SERVICE_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          {filtering ? <Button type="button" variant="ghost" size="sm" onClick={() => { setQuery(""); setStatus("ALL"); }}><FilterX aria-hidden="true" /> Limpar</Button> : <p className="records-page__count">{filtered.length} registros</p>}
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
                    <td>{record.service}</td>
                    <td>{record.estimatedHours ? `${record.estimatedHours} h` : "A definir"}</td>
                    <td><Badge variant="outline">{SERVICE_STATUS_LABELS[record.serviceStatus]}</Badge></td>
                    <td><Button type="button" variant="ghost" size="sm" onClick={() => { setSelected(record); setActiveTab("A"); }}>Abrir</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl">
          <DialogHeader><DialogTitle>Novo registro de serviço</DialogTitle><DialogDescription>Comece pelo bloco A: os dados do que foi orçado.</DialogDescription></DialogHeader>
          <div className="records-form">
            <div><Label htmlFor="record-company">Empresa</Label><Input id="record-company" value={draft.company} onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))} className="mt-2 h-12" /></div>
            <div><Label htmlFor="record-requester">Solicitante</Label><Input id="record-requester" value={draft.requester} onChange={(event) => setDraft((current) => ({ ...current, requester: event.target.value }))} className="mt-2 h-12" /></div>
            <div><Label htmlFor="record-service-type">Tipo de serviço</Label><select id="record-service-type" value={draft.serviceTypeId} onChange={(event) => setDraft((current) => ({ ...current, serviceTypeId: event.target.value }))} className="mt-2 h-12 w-full rounded-(--radius) border border-input bg-card px-3"><option value="">Selecionar do vocabulário</option>{serviceTypes.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></div>
            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            <div className="records-form__actions"><Button type="button" variant="outline" onClick={() => setCreating(false)}>Cancelar</Button><Button type="button" onClick={createRecord}>Criar rascunho</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-3xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.recordNumber} · {selected.company}</DialogTitle>
                <DialogDescription>{selected.service} · {SERVICE_STATUS_LABELS[selected.serviceStatus]} · Lição: {LESSON_STATUS_LABELS[selected.lessonStatus]}</DialogDescription>
              </DialogHeader>
              <div className="record-tabs">
                {(["A", "B", "C"] as BlockTab[]).map((tab) => (
                  <button key={tab} type="button" className={`record-tabs__btn${activeTab === tab ? " record-tabs__btn--active" : ""}`} onClick={() => setActiveTab(tab)}>Bloco {tab}</button>
                ))}
              </div>

              {activeTab === "A" ? (
                <div className="records-form">
                  <div><Label>Tipo de serviço</Label><select value={selected.serviceTypeId ?? ""} disabled={userRole === "CONSULTA"} onChange={(event) => { const term = serviceTypes.find((item) => item.id === event.target.value); updateSelected({ serviceTypeId: event.target.value, service: term?.label ?? selected.service }); }} className="mt-2 h-12 w-full rounded-(--radius) border border-input bg-card px-3"><option value="">Selecionar</option>{serviceTypes.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></div>
                  <div><Label>Características da peça</Label><div className="record-chip-list">{partTraits.map((term) => <button key={term.id} type="button" disabled={userRole === "CONSULTA"} className={`record-chip${selected.partTraitIds.includes(term.id) ? " record-chip--active" : ""}`} onClick={() => toggleTrait(term.id)}>{term.label}</button>)}</div></div>
                  <div><Label>Recursos</Label><div className="record-chip-list">{resources.map((term) => <button key={term.id} type="button" disabled={userRole === "CONSULTA"} className={`record-chip${selected.resourceIds.includes(term.id) ? " record-chip--active" : ""}`} onClick={() => toggleResource(term.id)}>{term.label}</button>)}</div></div>
                  <div className="records-form__two-columns">
                    <div><Label>Horas estimadas</Label><Input type="number" min="0" disabled={userRole === "CONSULTA"} value={selected.estimatedHours ?? ""} onChange={(event) => updateSelected({ estimatedHours: event.target.value ? Number(event.target.value) : null })} className="mt-2 h-12" /></div>
                    <div><Label>Valor proposto (R$)</Label><Input type="number" min="0" disabled={userRole === "CONSULTA"} value={selected.proposedValue ?? ""} onChange={(event) => updateSelected({ proposedValue: event.target.value ? Number(event.target.value) : null })} className="mt-2 h-12" /></div>
                  </div>
                  <div><Label>Premissas</Label><textarea disabled={userRole === "CONSULTA"} value={selected.assumptions} onChange={(event) => updateSelected({ assumptions: event.target.value })} className="records-form__textarea" rows={4} /></div>
                  {userRole !== "CONSULTA" ? <Button type="button" onClick={saveBlockA}>Salvar bloco A</Button> : null}
                </div>
              ) : null}

              {activeTab === "B" ? (
                <div className="records-form">
                  <div className="records-form__two-columns">
                    <div><Label>Horas realizadas</Label><Input type="number" min="0" disabled={userRole === "CONSULTA"} value={selected.actualHours ?? ""} onChange={(event) => updateSelected({ actualHours: event.target.value ? Number(event.target.value) : null })} className="mt-2 h-12" /></div>
                    <div><Label>Valor faturado (R$)</Label><Input type="number" min="0" disabled={userRole === "CONSULTA"} value={selected.billedValue ?? ""} onChange={(event) => updateSelected({ billedValue: event.target.value ? Number(event.target.value) : null })} className="mt-2 h-12" /></div>
                  </div>
                  <div className="records-form__two-columns">
                    <label className="record-check"><input type="checkbox" disabled={userRole === "CONSULTA"} checked={selected.rework} onChange={(event) => updateSelected({ rework: event.target.checked })} /> Houve retrabalho?</label>
                    <label className="record-check"><input type="checkbox" disabled={userRole === "CONSULTA"} checked={selected.scopeChange} onChange={(event) => updateSelected({ scopeChange: event.target.checked })} /> Mudança de escopo?</label>
                  </div>
                </div>
              ) : null}

              {activeTab === "C" ? (
                <div className="records-form">
                  <div><Label>Causa do desvio</Label><select disabled={userRole === "CONSULTA"} value={selected.deviationCauseId ?? ""} onChange={(event) => updateSelected({ deviationCauseId: event.target.value || null })} className="mt-2 h-12 w-full rounded-(--radius) border border-input bg-card px-3"><option value="">Selecionar</option>{deviationCauses.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></div>
                  <div><Label>Lição aprendida</Label><textarea disabled={userRole === "CONSULTA"} value={selected.lesson} onChange={(event) => updateSelected({ lesson: event.target.value })} className="records-form__textarea" rows={4} /></div>
                  <div><Label>Sigilo</Label><select disabled={userRole === "CONSULTA"} value={selected.visibility} onChange={(event) => updateSelected({ visibility: event.target.value as RecordVisibility })} className="mt-2 h-12 w-full rounded-(--radius) border border-input bg-card px-3">{Object.entries(VISIBILITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                  {userRole !== "CONSULTA" && selected.serviceStatus !== "COMPLETED" ? <Button type="button" onClick={completeService}>Concluir serviço e enviar lição</Button> : null}
                </div>
              ) : null}

              {formError ? <p className="text-sm text-destructive" role="alert">{formError}</p> : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
