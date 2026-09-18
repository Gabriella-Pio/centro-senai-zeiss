"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge, Button, Input, Label } from "@cem/ui";
import { buildRecommendation, findSimilarRecords } from "@/lib/assistant";
import { createEmptyRecord, updateDemoState } from "@/lib/demo-store";
import { useDemoStore } from "@/lib/use-demo-store";
import "./assistant.css";

export function AssistantBoard({ userName, canCreate }: { userName: string; canCreate: boolean }) {
  const router = useRouter();
  const { records, vocabulary } = useDemoStore();
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [partTraitIds, setPartTraitIds] = useState<string[]>([]);
  const [estimatedHours, setEstimatedHours] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  const [showCases, setShowCases] = useState(false);

  const serviceTypes = vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active);
  const partTraits = vocabulary.filter((term) => term.class === "PART_TRAIT" && term.active);

  const similarCases = useMemo(
    () => (serviceTypeId ? findSimilarRecords(records, serviceTypeId, partTraitIds) : []),
    [records, serviceTypeId, partTraitIds],
  );
  const recommendation = useMemo(() => buildRecommendation(similarCases), [similarCases]);

  const suggestedHours = recommendation.median
    ? Math.round(recommendation.correctionFactor ? recommendation.median * recommendation.correctionFactor : recommendation.median)
    : null;
  const needsOverride =
    suggestedHours !== null && estimatedHours && Math.abs(Number(estimatedHours) - suggestedHours) > 0.5;

  function toggleTrait(id: string) {
    setPartTraitIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function createFromAssistant() {
    if (!serviceTypeId || !estimatedHours) {
      return;
    }
    if (needsOverride && overrideReason.trim().length < 5) {
      return;
    }
    const serviceType = serviceTypes.find((term) => term.id === serviceTypeId);
    const record = createEmptyRecord({
      company: "A definir",
      requester: "A definir",
      service: serviceType?.label ?? "Serviço",
      serviceTypeId,
      partTraitIds,
      estimatedHours: Number(estimatedHours),
      proposedValue: Number(estimatedHours) * 320,
      assumptions: recommendation.detail,
      estimatedBy: userName,
      estimationOverrideReason: needsOverride ? overrideReason.trim() : undefined,
      serviceStatus: "QUOTED",
    });
    updateDemoState((state) => ({ ...state, records: [...state.records, record] }));
    router.push("/registros");
  }

  return (
    <main className="assistant-page">
      <header className="assistant-page__header">
        <div>
          <p className="assistant-page__eyebrow"><Sparkles aria-hidden="true" /> Orçamento assistido</p>
          <h1 className="assistant-page__title">Assistente de orçamento</h1>
          <p className="assistant-page__intro">O sistema sugere faixas a partir do histórico formalizado. Você sempre pode conferir os casos usados.</p>
        </div>
      </header>

      <section className="assistant-page__grid">
        <article className="assistant-panel">
          <h2>1. Perfil do serviço</h2>
          <div className="assistant-form">
            <div><Label>Tipo de serviço</Label><select value={serviceTypeId} onChange={(event) => setServiceTypeId(event.target.value)} className="assistant-select"><option value="">Selecionar</option>{serviceTypes.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></div>
            <div><Label>Características da peça</Label><div className="record-chip-list">{partTraits.map((term) => <button key={term.id} type="button" className={`record-chip${partTraitIds.includes(term.id) ? " record-chip--active" : ""}`} onClick={() => toggleTrait(term.id)}>{term.label}</button>)}</div></div>
          </div>
        </article>

        <article className="assistant-panel assistant-panel--highlight">
          <div className="assistant-panel__head"><h2>2. Recomendação</h2><Badge variant="outline">{recommendation.label}</Badge></div>
          <p className="assistant-panel__detail">{recommendation.detail}</p>
          {recommendation.level === "none" ? <p className="assistant-panel__empty">Sem histórico comparável. Use o roteiro de premissas do vocabulário.</p> : null}
          {recommendation.level === "low" ? <ul className="assistant-case-list">{recommendation.cases.map((record) => <li key={record.id}><strong>{record.recordNumber}</strong> · {record.actualHours} h realizadas</li>)}</ul> : null}
          {recommendation.level === "medium" || recommendation.level === "high" ? (
            <div className="assistant-range">
              <div><span>Mediana</span><strong>{recommendation.median} h</strong></div>
              <div><span>Q1 – Q3</span><strong>{recommendation.q1} – {recommendation.q3} h</strong></div>
              {recommendation.correctionFactor ? <div><span>Fator de correção</span><strong>{recommendation.correctionFactor.toFixed(2)}</strong></div> : null}
            </div>
          ) : null}
          <Button type="button" variant="ghost" onClick={() => setShowCases((current) => !current)}>{showCases ? "Ocultar casos" : "Ver casos usados"} ({recommendation.caseCount})</Button>
          {showCases ? <ul className="assistant-case-list">{recommendation.cases.map((record) => <li key={record.id}><strong>{record.recordNumber}</strong> · estimado {record.estimatedHours} h · realizado {record.actualHours} h</li>)}</ul> : null}
        </article>

        <article className="assistant-panel">
          <h2>3. Sua estimativa</h2>
          <div className="assistant-form">
            <div><Label>Horas estimadas</Label><Input type="number" min="0" value={estimatedHours} onChange={(event) => setEstimatedHours(event.target.value)} className="h-12" placeholder={suggestedHours ? String(suggestedHours) : ""} /></div>
            {suggestedHours ? <p className="assistant-suggestion">Sugestão do assistente: <strong>{suggestedHours} h</strong></p> : null}
            {needsOverride ? (
              <div><Label>Justificativa (obrigatória se diferente da sugestão)</Label><textarea value={overrideReason} onChange={(event) => setOverrideReason(event.target.value)} className="records-form__textarea" rows={3} /></div>
            ) : null}
            {canCreate ? <Button type="button" onClick={createFromAssistant} disabled={!serviceTypeId || !estimatedHours || Boolean(needsOverride && overrideReason.trim().length < 5)}>Criar registro com esta estimativa <ArrowRight aria-hidden="true" /></Button> : null}
          </div>
        </article>
      </section>
    </main>
  );
}
