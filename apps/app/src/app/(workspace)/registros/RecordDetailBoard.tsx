"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { Badge, Button, Input, Label } from "@cem/ui";
import type { UserRole } from "@/lib/api";
import { CostCompositionPanel } from "@/components/CostCompositionPanel";
import { DonutChart } from "@/components/charts/DonutChart";
import { findSimilarRecords } from "@/lib/assistant";
import { buildCostDonut } from "@/lib/chart-data";
import { pushNotification, updateDemoState } from "@/lib/demo-store";
import { formatEffort, getRecordQuantity } from "@/lib/record-helpers";
import { buildPriceHistory, buildQuoteSnapshot, computeQuoteCost, formatCurrency } from "@/lib/pricing";
import { useDemoStore } from "@/lib/use-demo-store";
import {
  LESSON_STATUS_LABELS,
  SERVICE_STATUS_LABELS,
  VISIBILITY_LABELS,
  type RecordVisibility,
  type ServiceRecord,
  type ServiceStatus,
} from "./types";
import "./record-detail.css";

type BlockTab = "A" | "B" | "C";

function blockDone(record: ServiceRecord, tab: BlockTab) {
  if (tab === "A") {
    return Boolean(record.serviceTypeId && record.estimatedHours && record.proposedValue && record.resourceIds.length > 0);
  }
  if (tab === "B") {
    return Boolean(record.actualHours && record.billedValue);
  }
  return Boolean(record.deviationCauseId && record.lesson.trim());
}

export function RecordDetailBoard({
  recordId,
  userRole,
  userName,
}: {
  recordId: string;
  userRole: UserRole;
  userName: string;
}) {
  const { records, vocabulary, labSettings } = useDemoStore();
  const record = records.find((item) => item.id === recordId) ?? null;
  const [activeTab, setActiveTab] = useState<BlockTab>("A");
  const [formError, setFormError] = useState<string | null>(null);

  const serviceTypes = vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active);
  const partTraits = vocabulary.filter((term) => term.class === "PART_TRAIT" && term.active);
  const resources = vocabulary.filter((term) => term.class === "RESOURCE" && term.active);
  const deviationCauses = vocabulary.filter((term) => term.class === "DEVIATION_CAUSE" && term.active);

  const liveBreakdown = useMemo(() => {
    if (!record) return null;
    return computeQuoteCost({
      vocabulary,
      resourceIds: record.resourceIds,
      teamHours: record.estimatedHours ?? 0,
      equipmentHours: record.estimatedEquipmentHours ?? (record.estimatedHours ? record.estimatedHours * 0.6 : 0),
      labSettings,
    });
  }, [record, vocabulary, labSettings]);

  const costBreakdown = useMemo(() => {
    if (!record) return null;
    if (record.quoteSnapshot && record.serviceStatus !== "DRAFT") {
      return record.quoteSnapshot.breakdown;
    }
    return liveBreakdown;
  }, [record, liveBreakdown]);

  const frozenTariff = Boolean(record?.quoteSnapshot && record.serviceStatus !== "DRAFT");

  const priceHistory = useMemo(() => {
    if (!record?.serviceTypeId) return null;
    const similar = findSimilarRecords(records, record.serviceTypeId, record.partTraitIds);
    return buildPriceHistory(similar);
  }, [records, record]);

  const costDonut = useMemo(
    () => (costBreakdown ? buildCostDonut(costBreakdown.lines) : []),
    [costBreakdown],
  );

  const suggestedPrice = priceHistory?.median
    ? Math.round(priceHistory.median)
    : costBreakdown?.suggestedPrice ?? 0;

  const needsPriceOverride =
    record &&
    suggestedPrice > 0 &&
    record.proposedValue &&
    Math.abs(record.proposedValue - suggestedPrice) > suggestedPrice * 0.05;

  function updateRecord(patch: Partial<ServiceRecord>) {
    if (!record) return;
    updateDemoState((state) => ({
      ...state,
      records: state.records.map((item) => (item.id === record.id ? { ...item, ...patch } : item)),
    }));
  }

  function saveBlockA() {
    if (!record) return;
    if (!record.serviceTypeId || !record.estimatedHours || record.resourceIds.length === 0) {
      setFormError("Informe tipo de serviço, recursos e horas estimadas no bloco A.");
      return;
    }
    if (needsPriceOverride && !record.priceOverrideReason?.trim()) {
      setFormError("Justifique o valor diferente do sugerido.");
      return;
    }
    const snapshot = buildQuoteSnapshot({
      vocabulary,
      resourceIds: record.resourceIds,
      teamHours: record.estimatedHours,
      equipmentHours: record.estimatedEquipmentHours ?? record.estimatedHours * 0.6,
      labSettings,
    });
    updateRecord({
      serviceStatus: "QUOTED",
      estimatedBy: userName,
      estimatedCost: snapshot.breakdown.totalCost,
      estimatedEquipmentHours: record.estimatedEquipmentHours ?? record.estimatedHours * 0.6,
      quoteSnapshot: snapshot,
    });
    setFormError(null);
  }

  function completeService() {
    if (!record) return;
    if (!record.actualHours || !record.deviationCauseId || !record.lesson.trim()) {
      setFormError("Preencha bloco B e C antes de concluir o serviço.");
      return;
    }
    updateDemoState((state) => ({
      ...state,
      records: state.records.map((item) =>
        item.id === record.id
          ? { ...item, serviceStatus: "COMPLETED" as ServiceStatus, lessonStatus: "PENDING" as const }
          : item,
      ),
    }));
    pushNotification({
      roles: ["VALIDADOR", "ADMIN"],
      message: `Lição de ${record.recordNumber} aguarda validação.`,
      href: "/validacao",
    });
    setFormError(null);
  }

  if (!record) {
    return (
      <main className="record-detail-page">
        <Link href="/registros" className="record-detail-page__back"><ArrowLeft aria-hidden="true" /> Voltar aos registros</Link>
        <p>Registro não encontrado.</p>
      </main>
    );
  }

  const readOnly = userRole === "CONSULTA";

  return (
    <main className="record-detail-page">
      <Link href="/registros" className="record-detail-page__back"><ArrowLeft aria-hidden="true" /> Voltar aos registros</Link>

      <header className="record-detail-page__header">
        <div>
          <p className="record-detail-page__number">{record.recordNumber}</p>
          <h1 className="record-detail-page__title">{record.company}</h1>
          <p className="record-detail-page__subtitle">{record.service}</p>
          {record.batchLabel ? <p className="record-detail-page__batch">{record.batchLabel}</p> : null}
        </div>
        <div className="record-detail-page__badges">
          {getRecordQuantity(record) > 1 ? <Badge variant="outline">Lote · {getRecordQuantity(record)} peças</Badge> : null}
          {(record.stages?.length ?? 0) > 0 ? <Badge variant="outline">Composto · {record.stages!.length} etapas</Badge> : null}
          <Badge variant="outline">{SERVICE_STATUS_LABELS[record.serviceStatus]}</Badge>
          <Badge variant="outline">Lição: {LESSON_STATUS_LABELS[record.lessonStatus]}</Badge>
        </div>
      </header>

      <nav className="record-stepper" aria-label="Blocos do registro">
        {(["A", "B", "C"] as BlockTab[]).map((tab) => {
          const done = blockDone(record, tab);
          return (
            <button
              key={tab}
              type="button"
              className={`record-stepper__step${activeTab === tab ? " record-stepper__step--active" : ""}${done ? " record-stepper__step--done" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {done ? <CheckCircle2 aria-hidden="true" /> : <Circle aria-hidden="true" />}
              <span>
                <strong>Bloco {tab}</strong>
                <small>{tab === "A" ? "Orçado" : tab === "B" ? "Realizado" : "Aprendizado"}</small>
              </span>
            </button>
          );
        })}
      </nav>

      <div className={`record-detail-page__layout${activeTab === "A" ? " record-detail-page__layout--split" : ""}`}>
        <section className="record-detail-page__form">
          {activeTab === "A" ? (
            <div className="records-form">
              <div className="record-section">
                <h2>Lote e escopo</h2>
                <div className="records-form__two-columns">
                  <div><Label>Quantidade de peças</Label><Input type="number" min="1" disabled={readOnly} value={getRecordQuantity(record)} onChange={(event) => updateRecord({ quantity: Math.max(1, Number(event.target.value) || 1), recordKind: Number(event.target.value) > 1 ? "batch" : "single" })} className="h-12" /></div>
                  <div><Label>Identificação do lote</Label><Input disabled={readOnly} value={record.batchLabel ?? ""} onChange={(event) => updateRecord({ batchLabel: event.target.value })} className="h-12" placeholder="Ex.: Lote bicos 1–16" /></div>
                </div>
                <div><Label>Pacote de horas (referência)</Label><Input disabled={readOnly} value={record.hoursPackageRef ?? ""} onChange={(event) => updateRecord({ hoursPackageRef: event.target.value })} className="h-12" placeholder="Opcional — ex.: Pacote 40 h Cargill" /></div>
              </div>

              {(record.stages?.length ?? 0) > 0 ? (
                <div className="record-section">
                  <h2>Etapas do serviço</h2>
                  <table className="record-stages-table">
                    <thead><tr><th>Etapa</th><th>Horas orçadas</th><th>Horas realizadas</th></tr></thead>
                    <tbody>
                      {record.stages!.map((stage) => (
                        <tr key={stage.id}>
                          <td>{stage.label}</td>
                          <td>{stage.estimatedHours ?? "—"} h</td>
                          <td>{stage.actualHours ?? "—"} h</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>{record.stages!.reduce((sum, stage) => sum + (stage.estimatedHours ?? 0), 0)} h</strong></td>
                        <td><strong>{record.stages!.some((stage) => stage.actualHours) ? `${record.stages!.reduce((sum, stage) => sum + (stage.actualHours ?? 0), 0)} h` : "—"}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : null}

              <div className="record-section">
                <h2>Classificação</h2>
                <div><Label>Tipo de serviço</Label><select value={record.serviceTypeId ?? ""} disabled={readOnly} onChange={(event) => { const term = serviceTypes.find((item) => item.id === event.target.value); updateRecord({ serviceTypeId: event.target.value, service: term?.label ?? record.service }); }} className="record-select"><option value="">Selecionar</option>{serviceTypes.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></div>
                <div><Label>Características da peça</Label><div className="record-chip-list">{partTraits.map((term) => <button key={term.id} type="button" disabled={readOnly} className={`record-chip${record.partTraitIds.includes(term.id) ? " record-chip--active" : ""}`} onClick={() => updateRecord({ partTraitIds: record.partTraitIds.includes(term.id) ? record.partTraitIds.filter((id) => id !== term.id) : [...record.partTraitIds, term.id] })}>{term.label}</button>)}</div></div>
                <div><Label>Recursos</Label><div className="record-chip-list">{resources.map((term) => <button key={term.id} type="button" disabled={readOnly} className={`record-chip${record.resourceIds.includes(term.id) ? " record-chip--active" : ""}`} onClick={() => updateRecord({ resourceIds: record.resourceIds.includes(term.id) ? record.resourceIds.filter((id) => id !== term.id) : [...record.resourceIds, term.id] })}>{term.label}{term.hourlyRate ? ` · ${formatCurrency(term.hourlyRate)}/h` : ""}</button>)}</div></div>
              </div>

              <div className="record-section">
                <h2>Esforço e valor</h2>
                <div className="records-form__two-columns">
                  <div><Label>Horas de equipe</Label><Input type="number" min="0" disabled={readOnly} value={record.estimatedHours ?? ""} onChange={(event) => updateRecord({ estimatedHours: event.target.value ? Number(event.target.value) : null })} className="h-12" /></div>
                  <div><Label>Horas de equipamento</Label><Input type="number" min="0" disabled={readOnly} value={record.estimatedEquipmentHours ?? ""} onChange={(event) => updateRecord({ estimatedEquipmentHours: event.target.value ? Number(event.target.value) : null })} className="h-12" placeholder={record.estimatedHours ? String(Math.round(record.estimatedHours * 0.6)) : ""} /></div>
                </div>
                <div className="records-form__two-columns">
                  <div><Label>Valor proposto (R$)</Label><Input type="number" min="0" disabled={readOnly} value={record.proposedValue ?? ""} onChange={(event) => updateRecord({ proposedValue: event.target.value ? Number(event.target.value) : null })} className="h-12" placeholder={suggestedPrice ? String(suggestedPrice) : ""} /></div>
                  {!readOnly && suggestedPrice > 0 ? (
                    <div className="records-form__apply-price">
                      <Button type="button" variant="outline" size="lg" onClick={() => updateRecord({ proposedValue: suggestedPrice })}>
                        Usar sugerido ({formatCurrency(suggestedPrice)})
                      </Button>
                    </div>
                  ) : null}
                </div>
                {needsPriceOverride ? (
                  <div><Label>Justificativa para valor diferente do sugerido</Label><textarea disabled={readOnly} value={record.priceOverrideReason ?? ""} onChange={(event) => updateRecord({ priceOverrideReason: event.target.value })} className="records-form__textarea" rows={2} /></div>
                ) : null}
                <div><Label>Premissas</Label><textarea disabled={readOnly} value={record.assumptions} onChange={(event) => updateRecord({ assumptions: event.target.value })} className="records-form__textarea" rows={3} /></div>
                {!readOnly ? <Button type="button" size="lg" onClick={saveBlockA}>Salvar bloco A</Button> : null}
              </div>
            </div>
          ) : null}

          {activeTab === "B" ? (
            <div className="records-form record-section">
              <h2>Execução</h2>
              <div className="records-form__two-columns">
                <div><Label>Horas realizadas</Label><Input type="number" min="0" disabled={readOnly} value={record.actualHours ?? ""} onChange={(event) => updateRecord({ actualHours: event.target.value ? Number(event.target.value) : null })} className="h-12" /></div>
                <div><Label>Valor faturado (R$)</Label><Input type="number" min="0" disabled={readOnly} value={record.billedValue ?? ""} onChange={(event) => updateRecord({ billedValue: event.target.value ? Number(event.target.value) : null })} className="h-12" /></div>
              </div>
              <div className="records-form__two-columns">
                <label className="record-check"><input type="checkbox" disabled={readOnly} checked={record.rework} onChange={(event) => updateRecord({ rework: event.target.checked })} /> Houve retrabalho?</label>
                <label className="record-check"><input type="checkbox" disabled={readOnly} checked={record.scopeChange} onChange={(event) => updateRecord({ scopeChange: event.target.checked })} /> Mudança de escopo?</label>
              </div>
            </div>
          ) : null}

          {activeTab === "C" ? (
            <div className="records-form record-section">
              <h2>Lição aprendida</h2>
              <div><Label>Causa do desvio</Label><select disabled={readOnly} value={record.deviationCauseId ?? ""} onChange={(event) => updateRecord({ deviationCauseId: event.target.value || null })} className="record-select"><option value="">Selecionar</option>{deviationCauses.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></div>
              <div><Label>Lição aprendida</Label><textarea disabled={readOnly} value={record.lesson} onChange={(event) => updateRecord({ lesson: event.target.value })} className="records-form__textarea" rows={5} /></div>
              <div><Label>Sigilo</Label><select disabled={readOnly} value={record.visibility} onChange={(event) => updateRecord({ visibility: event.target.value as RecordVisibility })} className="record-select">{Object.entries(VISIBILITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
              {!readOnly && record.serviceStatus !== "COMPLETED" ? (
                <Button type="button" size="lg" onClick={completeService}>Concluir serviço e enviar lição</Button>
              ) : null}
            </div>
          ) : null}

          {formError ? <p className="record-detail-page__error" role="alert">{formError}</p> : null}
        </section>

        <aside className="record-detail-page__aside">
          {activeTab === "A" && costBreakdown ? (
            <>
              <CostCompositionPanel
                breakdown={costBreakdown}
                priceHistory={priceHistory ?? undefined}
                proposedValue={record.proposedValue}
                frozenAt={frozenTariff ? record.quoteSnapshot?.savedAt : undefined}
                tariffLabel={frozenTariff ? record.quoteSnapshot?.tariffTableLabel : undefined}
              />
              {!frozenTariff && record.quoteSnapshot ? (
                <p className="record-detail-page__tariff-note">
                  Prévia com tarifas atuais. Salve o bloco A para congelar o orçamento.
                </p>
              ) : null}
              {costDonut.length > 0 ? (
                <DonutChart title="Distribuição do custo" slices={costDonut} />
              ) : null}
            </>
          ) : (
            <div className="record-summary-card">
              <h3>Resumo do orçamento</h3>
              <dl>
                <div><dt>Horas estimadas</dt><dd>{record.estimatedHours ? formatEffort(record) : "—"}</dd></div>
                <div><dt>Valor proposto</dt><dd>{record.proposedValue ? formatCurrency(record.proposedValue) : "—"}</dd></div>
                <div><dt>Custo estimado</dt><dd>{record.estimatedCost ? formatCurrency(record.estimatedCost) : "—"}</dd></div>
                {record.actualHours ? <div><dt>Horas realizadas</dt><dd>{record.actualHours} h</dd></div> : null}
                {record.billedValue ? <div><dt>Faturado</dt><dd>{formatCurrency(record.billedValue)}</dd></div> : null}
              </dl>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
