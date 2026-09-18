"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge, Button, Input, Label } from "@cem/ui";
import { CostCompositionPanel } from "@/components/CostCompositionPanel";
import { LabSettingsPanel } from "@/components/LabSettingsPanel";
import { buildRecommendation, findSimilarRecords } from "@/lib/assistant";
import { createEmptyRecord, updateDemoState } from "@/lib/demo-store";
import { CaseComparisonChart } from "@/components/charts/CaseComparisonChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { HourRangeChart } from "@/components/charts/HourRangeChart";
import { buildCaseComparison, buildCostDonut } from "@/lib/chart-data";
import { buildPriceHistory, buildQuoteSnapshot, computeQuoteCost, formatCurrency } from "@/lib/pricing";
import { useDemoStore } from "@/lib/use-demo-store";
import "./assistant.css";

export function AssistantBoard({
  userName,
  canCreate,
  canEditLabSettings = false,
}: {
  userName: string;
  canCreate: boolean;
  canEditLabSettings?: boolean;
}) {
  const router = useRouter();
  const { records, vocabulary, labSettings } = useDemoStore();
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [partTraitIds, setPartTraitIds] = useState<string[]>([]);
  const [resourceIds, setResourceIds] = useState<string[]>([]);
  const [teamHours, setTeamHours] = useState("");
  const [equipmentHours, setEquipmentHours] = useState("");
  const [proposedValue, setProposedValue] = useState("");
  const [hoursOverrideReason, setHoursOverrideReason] = useState("");
  const [priceOverrideReason, setPriceOverrideReason] = useState("");
  const [showCases, setShowCases] = useState(false);

  const serviceTypes = vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active);
  const partTraits = vocabulary.filter((term) => term.class === "PART_TRAIT" && term.active);
  const resources = vocabulary.filter((term) => term.class === "RESOURCE" && term.active);

  const similarCases = useMemo(
    () => (serviceTypeId ? findSimilarRecords(records, serviceTypeId, partTraitIds) : []),
    [records, serviceTypeId, partTraitIds],
  );
  const recommendation = useMemo(() => buildRecommendation(similarCases), [similarCases]);
  const priceHistory = useMemo(() => buildPriceHistory(similarCases), [similarCases]);

  const suggestedTeamHours = recommendation.median
    ? Math.round(recommendation.correctionFactor ? recommendation.median * recommendation.correctionFactor : recommendation.median)
    : null;

  const parsedTeamHours = Number(teamHours) || 0;
  const parsedEquipmentHours = Number(equipmentHours) || 0;

  const costBreakdown = useMemo(
    () =>
      computeQuoteCost({
        vocabulary,
        resourceIds,
        teamHours: parsedTeamHours,
        equipmentHours: parsedEquipmentHours || parsedTeamHours * 0.6,
        labSettings,
      }),
    [vocabulary, resourceIds, parsedTeamHours, parsedEquipmentHours, labSettings],
  );

  const suggestedPrice = useMemo(() => {
    if (priceHistory.median) {
      return Math.round(priceHistory.median);
    }
    return costBreakdown.suggestedPrice;
  }, [priceHistory.median, costBreakdown.suggestedPrice]);

  const caseComparison = useMemo(() => buildCaseComparison(similarCases), [similarCases]);
  const costDonut = useMemo(() => buildCostDonut(costBreakdown.lines), [costBreakdown.lines]);

  const needsHoursOverride =
    suggestedTeamHours !== null && teamHours && Math.abs(parsedTeamHours - suggestedTeamHours) > 0.5;
  const needsPriceOverride =
    suggestedPrice > 0 && proposedValue && Math.abs(Number(proposedValue) - suggestedPrice) > suggestedPrice * 0.05;

  function toggleTrait(id: string) {
    setPartTraitIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleResource(id: string) {
    setResourceIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function applySuggestedPrice() {
    setProposedValue(String(suggestedPrice));
  }

  function createFromAssistant() {
    if (!serviceTypeId || !teamHours || !proposedValue) return;
    if (needsHoursOverride && hoursOverrideReason.trim().length < 5) return;
    if (needsPriceOverride && priceOverrideReason.trim().length < 5) return;

    const serviceType = serviceTypes.find((term) => term.id === serviceTypeId);
    const snapshot = buildQuoteSnapshot({
      vocabulary,
      resourceIds,
      teamHours: parsedTeamHours,
      equipmentHours: parsedEquipmentHours || parsedTeamHours * 0.6,
      labSettings,
    });
    const record = createEmptyRecord({
      company: "A definir",
      requester: "A definir",
      service: serviceType?.label ?? "Serviço",
      serviceTypeId,
      partTraitIds,
      resourceIds,
      estimatedHours: parsedTeamHours,
      estimatedEquipmentHours: parsedEquipmentHours || parsedTeamHours * 0.6,
      estimatedCost: snapshot.breakdown.totalCost,
      proposedValue: Number(proposedValue),
      quoteSnapshot: snapshot,
      assumptions: recommendation.detail,
      estimatedBy: userName,
      estimationOverrideReason: needsHoursOverride ? hoursOverrideReason.trim() : undefined,
      priceOverrideReason: needsPriceOverride ? priceOverrideReason.trim() : undefined,
      serviceStatus: "QUOTED",
    });
    updateDemoState((state) => ({ ...state, records: [...state.records, record] }));
    router.push(`/registros/${record.id}`);
  }

  return (
    <main className="assistant-page">
      <header className="assistant-page__header">
        <div>
          <p className="assistant-page__eyebrow"><Sparkles aria-hidden="true" /> Orçamento assistido</p>
          <h1 className="assistant-page__title">Assistente de orçamento</h1>
          <p className="assistant-page__intro">
            Sugere horas e valor a partir do histórico formalizado e das tarifas da planilha hora-máquina cadastradas nos recursos.
          </p>
        </div>
      </header>

      <section className="assistant-page__grid">
        <article className="assistant-panel">
          <h2>1. Perfil do serviço</h2>
          <div className="assistant-form">
            <div>
              <Label>Tipo de serviço</Label>
              <select value={serviceTypeId} onChange={(event) => setServiceTypeId(event.target.value)} className="assistant-select">
                <option value="">Selecionar</option>
                {serviceTypes.map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}
              </select>
            </div>
            <div>
              <Label>Características da peça</Label>
              <div className="record-chip-list">
                {partTraits.map((term) => (
                  <button key={term.id} type="button" className={`record-chip${partTraitIds.includes(term.id) ? " record-chip--active" : ""}`} onClick={() => toggleTrait(term.id)}>{term.label}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Recursos do laboratório</Label>
              <div className="record-chip-list">
                {resources.map((term) => (
                  <button key={term.id} type="button" className={`record-chip${resourceIds.includes(term.id) ? " record-chip--active" : ""}`} onClick={() => toggleResource(term.id)}>
                    {term.label}{term.hourlyRate ? ` · ${formatCurrency(term.hourlyRate)}/h` : ""}
                  </button>
                ))}
              </div>
            </div>
            <div className="assistant-form__two-columns">
              <div>
                <Label>Horas de mão de obra técnica</Label>
                <Input type="number" min="0" value={teamHours} onChange={(event) => setTeamHours(event.target.value)} className="h-12" placeholder={suggestedTeamHours ? String(suggestedTeamHours) : ""} />
                <p className="assistant-form__hint">Fora dos recursos com planilha — preparo, análise, gestão ({formatCurrency(labSettings.teamHourlyRate)}/h).</p>
              </div>
              <div>
                <Label>Horas de equipamento / software</Label>
                <Input type="number" min="0" value={equipmentHours} onChange={(event) => setEquipmentHours(event.target.value)} className="h-12" placeholder={teamHours ? String(Math.round(parsedTeamHours * 0.6)) : ""} />
                <p className="assistant-form__hint">Divididas entre os recursos selecionados (máquinas, ZRE etc.).</p>
              </div>
            </div>
          </div>
        </article>

        <article className="assistant-panel assistant-panel--highlight">
          <div className="assistant-panel__head">
            <h2>2. Recomendação de esforço</h2>
            <Badge variant="outline">{recommendation.label}</Badge>
          </div>
          <p className="assistant-panel__detail">{recommendation.detail}</p>
          {suggestedTeamHours ? <p className="assistant-suggestion">Horas sugeridas: <strong>{suggestedTeamHours} h</strong></p> : null}
          {recommendation.level === "medium" || recommendation.level === "high" ? (
            <div className="assistant-range">
              <div><span>Mediana</span><strong>{recommendation.median} h</strong></div>
              <div><span>Q1 – Q3</span><strong>{recommendation.q1} – {recommendation.q3} h</strong></div>
              {recommendation.correctionFactor ? <div><span>Fator</span><strong>{recommendation.correctionFactor.toFixed(2)}</strong></div> : null}
            </div>
          ) : null}
          <div className="assistant-charts">
            <HourRangeChart
              q1={recommendation.q1}
              median={recommendation.median}
              q3={recommendation.q3}
              current={parsedTeamHours > 0 ? parsedTeamHours : null}
              suggested={suggestedTeamHours}
            />
            <CaseComparisonChart data={caseComparison} />
          </div>
          <Button type="button" variant="ghost" onClick={() => setShowCases((current) => !current)}>
            {showCases ? "Ocultar casos" : "Ver casos usados"} ({recommendation.caseCount})
          </Button>
          {showCases ? (
            <ul className="assistant-case-list">
              {recommendation.cases.map((record) => (
                <li key={record.id}>
                  <strong>{record.recordNumber}</strong> · {record.estimatedHours} h · {record.proposedValue ? formatCurrency(record.proposedValue) : "—"}
                </li>
              ))}
            </ul>
          ) : null}
        </article>

        <article className="assistant-panel assistant-panel--wide">
          <h2>3. Composição de custo e preço</h2>
          <div className="assistant-cost-grid">
            <CostCompositionPanel
              breakdown={costBreakdown}
              priceHistory={priceHistory}
              proposedValue={proposedValue ? Number(proposedValue) : null}
            />
            <DonutChart
              title="Composição do custo"
              subtitle="Mão de obra técnica + recursos com planilha (máquinas, ZRE…)"
              slices={costDonut}
            />
          </div>
          <div className="assistant-form assistant-form--pricing">
            <div className="assistant-form__price-row">
              <div>
                <Label>Valor proposto ao cliente (R$)</Label>
                <Input type="number" min="0" value={proposedValue} onChange={(event) => setProposedValue(event.target.value)} className="h-12" placeholder={suggestedPrice ? String(suggestedPrice) : ""} />
              </div>
              {suggestedPrice > 0 ? (
                <Button type="button" variant="outline" onClick={applySuggestedPrice}>
                  Usar sugerido ({formatCurrency(suggestedPrice)})
                </Button>
              ) : null}
            </div>
            {needsHoursOverride ? (
              <div>
                <Label>Justificativa para horas diferentes da sugestão</Label>
                <textarea value={hoursOverrideReason} onChange={(event) => setHoursOverrideReason(event.target.value)} className="records-form__textarea" rows={2} />
              </div>
            ) : null}
            {needsPriceOverride ? (
              <div>
                <Label>Justificativa para valor diferente do sugerido</Label>
                <textarea value={priceOverrideReason} onChange={(event) => setPriceOverrideReason(event.target.value)} className="records-form__textarea" rows={2} />
              </div>
            ) : null}
            {canCreate ? (
              <Button
                type="button"
                onClick={createFromAssistant}
                disabled={
                  !serviceTypeId ||
                  !teamHours ||
                  !proposedValue ||
                  resourceIds.length === 0 ||
                  Boolean(needsHoursOverride && hoursOverrideReason.trim().length < 5) ||
                  Boolean(needsPriceOverride && priceOverrideReason.trim().length < 5)
                }
              >
                Criar registro com este orçamento <ArrowRight aria-hidden="true" />
              </Button>
            ) : null}
          </div>
        </article>
      </section>

      {canEditLabSettings ? <LabSettingsPanel canEdit /> : null}
    </main>
  );
}
