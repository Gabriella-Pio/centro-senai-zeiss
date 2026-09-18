"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ClipboardList, FilterX, Plus, Search } from "lucide-react";
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label } from "@cem/ui";
import { DEMO_EQUIPMENT, DEMO_RECORDS_KEY } from "./demo";
import { RECORD_STATUS_LABELS, type ServiceRecord, type ServiceRecordStatus } from "./types";
import "./records.css";

const STATUSES: ServiceRecordStatus[] = ["DRAFT", "IN_REVIEW", "FORMALIZED"];

export function RecordsBoard({ initialRecords }: { initialRecords: ServiceRecord[] }) {
  const storedRecords = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("cem-demo-records-changed", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("cem-demo-records-changed", onStoreChange);
      };
    },
    () => window.localStorage.getItem(DEMO_RECORDS_KEY) ?? "",
    () => "",
  );
  const records = useMemo(() => {
    let parsed: ServiceRecord[] = initialRecords;
    if (storedRecords) {
      try { parsed = JSON.parse(storedRecords) as ServiceRecord[]; } catch { parsed = initialRecords; }
    }
    return parsed.map((record, index) => ({
      ...record,
      recordNumber: record.recordNumber ?? `RS-2026-${String(index + 1).padStart(4, "0")}`,
      estimatedEquipmentHours: record.estimatedEquipmentHours ?? null,
    }));
  }, [initialRecords, storedRecords]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ServiceRecordStatus>("ALL");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<ServiceRecord | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ company: "", requester: "", service: "", equipment: "", estimatedEquipmentHours: "", estimatedHours: "", assumptions: "" });

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return records.filter((record) => {
      if (status !== "ALL" && record.status !== status) return false;
      return !needle || [record.company, record.service, record.requester].some((value) => value.toLowerCase().includes(needle));
    });
  }, [query, records, status]);
  const filtering = Boolean(query.trim()) || status !== "ALL";

  function clearFilters() {
    setQuery("");
    setStatus("ALL");
  }

  function updateDraft(field: keyof typeof draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function createRecord() {
    if (!draft.company.trim() || !draft.requester.trim() || !draft.service.trim()) {
      setFormError("Preencha empresa, solicitante e serviço.");
      return;
    }
    const nextSequence = records.reduce((highest, record) => {
      const sequence = Number(record.recordNumber?.match(/-(\d{4})$/)?.[1] ?? 0);
      return Math.max(highest, sequence);
    }, 0) + 1;
    const record: ServiceRecord = {
      id: `record-${Date.now()}`,
      recordNumber: `RS-2026-${String(nextSequence).padStart(4, "0")}`,
      company: draft.company.trim(),
      requester: draft.requester.trim(),
      service: draft.service.trim(),
      equipment: draft.equipment || undefined,
      estimatedEquipmentHours: draft.estimatedEquipmentHours ? Number(draft.estimatedEquipmentHours) : null,
      estimatedHours: draft.estimatedHours ? Number(draft.estimatedHours) : null,
      assumptions: draft.assumptions.trim(),
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };
    window.localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify([...records, record]));
    window.dispatchEvent(new Event("cem-demo-records-changed"));
    setDraft({ company: "", requester: "", service: "", equipment: "", estimatedEquipmentHours: "", estimatedHours: "", assumptions: "" });
    setFormError(null);
    setCreating(false);
  }

  return (
    <main className="records-page">
      <header className="records-page__header">
        <div>
          <p className="records-page__eyebrow"><ClipboardList aria-hidden="true" /> Ciclo do serviço</p>
          <h1 className="records-page__title">Registros de serviço</h1>
          <p className="records-page__intro">Acompanhe o que foi orçado, realizado e aprendido em cada serviço do laboratório.</p>
        </div>
        <Button type="button" size="lg" onClick={() => setCreating(true)}><Plus aria-hidden="true" /> Novo registro</Button>
      </header>
      <div className="records-page__summary"><div><strong>{records.length}</strong><span>registros</span></div><div><strong>{records.filter((record) => record.status === "DRAFT").length}</strong><span>rascunhos</span></div><div><strong>{records.filter((record) => record.status === "IN_REVIEW").length}</strong><span>em validação</span></div><p>Dados da demonstração</p></div>
      <section className="records-page__content" aria-labelledby="records-heading">
        <div className="records-page__toolbar"><div className="records-page__search"><Search aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar empresa, serviço ou responsável" aria-label="Pesquisar empresa, serviço ou responsável" className="h-12 pl-10 text-base" /></div><div><Label htmlFor="record-status-filter" className="sr-only">Filtrar por status</Label><select id="record-status-filter" value={status} onChange={(event) => setStatus(event.target.value as "ALL" | ServiceRecordStatus)} className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"><option value="ALL">Todos os status</option>{STATUSES.map((value) => <option key={value} value={value}>{RECORD_STATUS_LABELS[value]}</option>)}</select></div>{filtering ? <Button type="button" variant="ghost" size="sm" onClick={clearFilters}><FilterX aria-hidden="true" /> Limpar</Button> : <p className="records-page__count">{filtered.length} registros</p>}</div>
        <h2 id="records-heading" className="sr-only">Registros de serviço</h2>
        <div className="records-page__table-wrap">{filtered.length === 0 ? <div className="records-page__empty"><FilterX aria-hidden="true" /><p>Nenhum registro encontrado.</p></div> : <table className="records-page__table"><thead><tr><th>Registro</th><th>Empresa</th><th>Serviço</th><th>Esforço estimado</th><th>Status</th><th>Ação</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id}><td><strong className="records-page__number">{record.recordNumber}</strong><span>{record.requestNumber ?? "Sem solicitação"}</span></td><td><strong>{record.company}</strong><span>{record.requester}</span></td><td>{record.service}</td><td>{record.estimatedHours ? `${record.estimatedHours} h` : "A definir"}</td><td><Badge variant="outline">{RECORD_STATUS_LABELS[record.status]}</Badge></td><td><Button type="button" variant="ghost" size="sm" onClick={() => setSelected(record)}>Abrir</Button></td></tr>)}</tbody></table>}</div>
      </section>

      <Dialog open={creating} onOpenChange={setCreating}><DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl"><DialogHeader><DialogTitle className="text-xl font-semibold">Novo registro de serviço</DialogTitle><DialogDescription className="text-base text-muted-foreground">Comece pelo bloco A: os dados do que foi orçado.</DialogDescription></DialogHeader><div className="records-form"><div><Label htmlFor="record-company">Empresa</Label><Input id="record-company" value={draft.company} onChange={(event) => updateDraft("company", event.target.value)} className="mt-2 h-12 text-base" autoFocus /></div><div><Label htmlFor="record-requester">Solicitante</Label><Input id="record-requester" value={draft.requester} onChange={(event) => updateDraft("requester", event.target.value)} className="mt-2 h-12 text-base" /></div><div><Label htmlFor="record-service">Tipo de serviço</Label><Input id="record-service" value={draft.service} onChange={(event) => updateDraft("service", event.target.value)} className="mt-2 h-12 text-base" placeholder="Use um termo do vocabulário" /></div><div><Label htmlFor="record-equipment">Equipamento principal</Label><select id="record-equipment" value={draft.equipment} onChange={(event) => updateDraft("equipment", event.target.value)} className="mt-2 h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground"><option value="">Selecionar depois</option>{DEMO_EQUIPMENT.map((equipment) => <option key={equipment} value={equipment}>{equipment}</option>)}</select></div><div className="records-form__two-columns"><div><Label htmlFor="record-equipment-hours">Horas de equipamento</Label><Input id="record-equipment-hours" type="number" min="0" value={draft.estimatedEquipmentHours} onChange={(event) => updateDraft("estimatedEquipmentHours", event.target.value)} className="mt-2 h-12 text-base" /></div><div><Label htmlFor="record-hours">Horas de equipe</Label><Input id="record-hours" type="number" min="0" value={draft.estimatedHours} onChange={(event) => updateDraft("estimatedHours", event.target.value)} className="mt-2 h-12 text-base" /></div></div><div><Label htmlFor="record-assumptions">Premissas</Label><textarea id="record-assumptions" value={draft.assumptions} onChange={(event) => updateDraft("assumptions", event.target.value)} className="records-form__textarea" rows={4} placeholder="O que precisa ser verdade para esta estimativa?" /></div>{formError ? <p className="text-sm text-destructive" role="alert">{formError}</p> : null}<div className="records-form__actions"><Button type="button" variant="outline" size="xl" onClick={() => setCreating(false)}>Cancelar</Button><Button type="button" size="xl" onClick={createRecord}>Criar rascunho</Button></div></div></DialogContent></Dialog>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-2xl"><DialogHeader><DialogTitle className="text-xl font-semibold">{selected?.recordNumber} · {selected?.company}</DialogTitle><DialogDescription className="text-base text-muted-foreground">{selected?.service} · {selected ? RECORD_STATUS_LABELS[selected.status] : ""}</DialogDescription></DialogHeader>{selected ? <div className="record-detail"><div className="record-detail__grid"><div><span>Solicitante</span><strong>{selected.requester}</strong></div><div><span>Solicitação de origem</span><strong>{selected.requestNumber ?? "Registro direto"}</strong></div><div><span>Equipamento</span><strong>{selected.equipment ?? "Ainda não definido"}</strong></div><div><span>Horas de equipamento</span><strong>{selected.estimatedEquipmentHours ? `${selected.estimatedEquipmentHours} horas` : "Ainda não informado"}</strong></div></div><div className="record-detail__block"><span>Bloco A · Orçado</span><p><strong>Premissas</strong>{selected.assumptions || "Ainda não preenchidas."}</p></div><div className="record-detail__next"><strong>Próximo passo</strong><span>Preencher os dados realizados e o aprendizado quando o serviço for concluído.</span></div></div> : null}</DialogContent></Dialog>
    </main>
  );
}
