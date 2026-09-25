"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  BookOpen,
  ChevronDown,
  FlaskConical,
  Sparkles,
} from "lucide-react";
import { Badge, Button } from "@cem/ui";
import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";
import type { AssistantRecommendation, ConfidenceLevel } from "@/lib/assistant";
import { getHoursRangePosition } from "@/lib/assistant";
import { formatCurrency } from "@/lib/pricing";
import { getRecordDetailPath } from "@/lib/records-navigation";
import { getTotalEffortHours } from "@/lib/record-helpers";
import type { ServiceRecord } from "./types";
import "./record-assistant.css";

const VISIBLE_CASE_LIMIT = 3;

const CONFIDENCE_STEPS: Array<{ level: ConfidenceLevel; label: string; hint: string }> = [
  { level: "none", label: "0", hint: "Sem histórico" },
  { level: "low", label: "1–4", hint: "Confiança baixa" },
  { level: "medium", label: "5–14", hint: "Confiança média" },
  { level: "high", label: "15+", hint: "Confiança alta" },
];

function formatHours(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${value.toFixed(1)} h`;
}

function confidenceStepIndex(level: ConfidenceLevel) {
  return CONFIDENCE_STEPS.findIndex((step) => step.level === level);
}

function HoursCompareBar({
  current,
  suggested,
  q1,
  q3,
}: {
  current: number | null;
  suggested: number | null;
  q1: number | null;
  q3: number | null;
}) {
  if (q1 === null || q3 === null) {
    return null;
  }

  const points = [q1, q3, current, suggested].filter(
    (value): value is number => value !== null && value > 0,
  );
  const min = Math.max(0, Math.min(...points) * 0.82);
  const max = Math.max(...points) * 1.12;
  const span = max - min || 1;
  const toPercent = (value: number) => `${((value - min) / span) * 100}%`;

  return (
    <div className="record-assistant__hours-bar" aria-hidden="true">
      <div className="record-assistant__hours-bar-track">
        <div
          className="record-assistant__hours-bar-band"
          style={{ left: toPercent(q1), width: `calc(${toPercent(q3)} - ${toPercent(q1)})` }}
        />
        {current && current > 0 ? (
          <span
            className="record-assistant__hours-bar-marker record-assistant__hours-bar-marker--current"
            style={{ left: toPercent(current) }}
          />
        ) : null}
        {suggested && suggested > 0 ? (
          <span
            className="record-assistant__hours-bar-marker record-assistant__hours-bar-marker--suggested"
            style={{ left: toPercent(suggested) }}
          />
        ) : null}
      </div>
      <div className="record-assistant__hours-bar-legend">
        <span>
          <i className="record-assistant__hours-bar-dot record-assistant__hours-bar-dot--band" />
          Faixa usual
        </span>
        {current && current > 0 ? (
          <span>
            <i className="record-assistant__hours-bar-dot record-assistant__hours-bar-dot--current" />
            Informadas
          </span>
        ) : null}
        {suggested && suggested > 0 ? (
          <span>
            <i className="record-assistant__hours-bar-dot record-assistant__hours-bar-dot--suggested" />
            Sugeridas
          </span>
        ) : null}
      </div>
    </div>
  );
}

function CaseCard({ item }: { item: ServiceRecord }) {
  const hours = formatHours(getTotalEffortHours(item, "estimated"));
  const price = item.proposedValue ? formatCurrency(item.proposedValue) : null;

  return (
    <li className="record-assistant__case">
      <div className="record-assistant__case-head">
        <Link href={getRecordDetailPath(item.id, "C")} className="record-assistant__case-link">
          {item.recordNumber}
        </Link>
        <span className="record-assistant__case-meta">
          {hours}
          {price ? ` · ${price}` : ""}
        </span>
      </div>
      {item.lesson.trim() ? (
        <blockquote className="record-assistant__lesson">{item.lesson.trim()}</blockquote>
      ) : null}
    </li>
  );
}

function getEmptyDescription({
  hasServiceType,
  serviceOnlyCaseCount,
  serviceTypeGuidance,
}: {
  hasServiceType: boolean;
  serviceOnlyCaseCount: number;
  serviceTypeGuidance?: string | null;
}) {
  if (!hasServiceType) {
    return "Adicione etapas com tipo de serviço no bloco A para buscar histórico comparável.";
  }

  if (serviceOnlyCaseCount > 0) {
    return `Nenhum caso combina com os filtros atuais. Há ${serviceOnlyCaseCount} ${
      serviceOnlyCaseCount === 1 ? "caso" : "casos"
    } só pelo tipo de serviço — alivie características ou recursos no bloco A.`;
  }

  if (serviceTypeGuidance?.trim()) {
    return serviceTypeGuidance;
  }

  return "Não há casos formalizados para este perfil. Siga o roteiro de premissas do vocabulário.";
}

export function RecordAssistantPanel({
  recommendation,
  serviceTypeGuidance,
  serviceTypeLabel,
  profileChips = [],
  currentEstimatedHours,
  isDemoData = false,
  embedded = false,
  readOnly = false,
  hasServiceType = false,
  partTraitCount = 0,
  resourceCount = 0,
  serviceOnlyCaseCount = 0,
  tariffReferencePrice = null,
  priceHistoryMedian = null,
  onApplySuggestedHours,
}: {
  recommendation: AssistantRecommendation;
  serviceTypeGuidance?: string | null;
  serviceTypeLabel?: string | null;
  profileChips?: string[];
  currentEstimatedHours?: number | null;
  isDemoData?: boolean;
  embedded?: boolean;
  readOnly?: boolean;
  hasServiceType?: boolean;
  partTraitCount?: number;
  resourceCount?: number;
  serviceOnlyCaseCount?: number;
  tariffReferencePrice?: number | null;
  priceHistoryMedian?: number | null;
  onApplySuggestedHours?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAllCases, setShowAllCases] = useState(false);

  const rangePosition = getHoursRangePosition(
    currentEstimatedHours ?? null,
    recommendation.q1,
    recommendation.q3,
  );
  const activeStep = confidenceStepIndex(recommendation.level);
  const visibleCases = showAllCases
    ? recommendation.cases
    : recommendation.cases.slice(0, VISIBLE_CASE_LIMIT);
  const hiddenCaseCount = Math.max(0, recommendation.cases.length - VISIBLE_CASE_LIMIT);
  const showHoursBar =
    recommendation.q1 !== null &&
    recommendation.q3 !== null &&
    (currentEstimatedHours || recommendation.suggestedHours);

  const rangeStatusLabel =
    rangePosition === "within"
      ? "Dentro da faixa usual"
      : rangePosition === "below"
        ? "Abaixo da faixa usual"
        : rangePosition === "above"
          ? "Acima da faixa usual"
          : null;

  return (
    <section
      className={`record-assistant${embedded ? " record-assistant--embedded" : ""}${
        collapsed ? " record-assistant--collapsed" : ""
      }`}
      aria-labelledby="record-assistant-heading"
    >
      <header className="record-assistant__header">
        <div className="record-assistant__header-main">
          <div className="record-assistant__header-icon" aria-hidden="true">
            <Sparkles />
          </div>
          <div className="record-assistant__header-copy">
            <h3 id="record-assistant-heading">Assistente de orçamento</h3>
            <p>Referência histórica para estimar esforço e conferir preço.</p>
          </div>
        </div>
        <button
          type="button"
          className="record-assistant__collapse"
          aria-expanded={!collapsed}
          aria-controls="record-assistant-body"
          onClick={() => setCollapsed((value) => !value)}
        >
          <ChevronDown aria-hidden="true" />
          <span className="sr-only">{collapsed ? "Expandir assistente" : "Recolher assistente"}</span>
        </button>
      </header>

      <div id="record-assistant-body" className="record-assistant__body" hidden={collapsed}>
        <div className="record-assistant__confidence">
          <ol className="record-assistant__ladder" aria-label="Escada de confiança">
            {CONFIDENCE_STEPS.map((step, index) => (
              <li
                key={step.level}
                className={`record-assistant__ladder-step${
                  index === activeStep ? " record-assistant__ladder-step--active" : ""
                }${index < activeStep ? " record-assistant__ladder-step--done" : ""}`}
              >
                <span className="record-assistant__ladder-dot">{step.label}</span>
                <span className="record-assistant__ladder-label">{step.hint}</span>
              </li>
            ))}
          </ol>
          <div className="record-assistant__badges">
            <Badge variant="outline">{recommendation.label}</Badge>
            {recommendation.caseCount > 0 ? (
              <Badge variant="muted">
                {recommendation.caseCount}{" "}
                {recommendation.caseCount === 1 ? "caso" : "casos"}
              </Badge>
            ) : null}
          </div>
        </div>

        {profileChips.length > 0 ? (
          <div className="record-assistant__chips" aria-label="Perfil de busca">
            {profileChips.map((chip) => (
              <span key={chip} className="record-assistant__chip">
                {chip}
              </span>
            ))}
            {partTraitCount === 0 && hasServiceType ? (
              <span
                className="record-assistant__chip record-assistant__chip--muted"
                title="Sem características — busca ampla por tipo de serviço"
              >
                + todos os perfis de peça
              </span>
            ) : null}
            {resourceCount === 0 && hasServiceType ? (
              <span
                className="record-assistant__chip record-assistant__chip--muted"
                title="Sem recursos — histórico não filtra equipamento"
              >
                + qualquer recurso
              </span>
            ) : null}
          </div>
        ) : null}

        {recommendation.level === "none" ? (
          <WorkspaceEmptyState
            icon={BookOpen}
            title="Sem histórico comparável"
            description={getEmptyDescription({
              hasServiceType,
              serviceOnlyCaseCount,
              serviceTypeGuidance,
            })}
            action={
              !hasServiceType || serviceOnlyCaseCount > 0 ? (
                <a href="#record-classification" className="record-assistant__anchor-action">
                  <ArrowDown aria-hidden="true" />
                  Ajustar perfil no bloco A
                </a>
              ) : serviceTypeLabel ? (
                <Link href="/vocabulario" className="record-assistant__anchor-action">
                  Ver roteiro no vocabulário
                </Link>
              ) : undefined
            }
            className="record-assistant__empty workspace-empty-state--panel"
          />
        ) : (
          <>
            <section className="record-assistant__section record-assistant__section--decision">
              <h4 className="record-assistant__section-title">Decisão</h4>

              {recommendation.suggestedHours !== null ? (
                <div className="record-assistant__decision-card">
                  <div className="record-assistant__decision-metrics">
                    <div>
                      <span>Sugeridas</span>
                      <strong>{formatHours(recommendation.suggestedHours)}</strong>
                    </div>
                    <div>
                      <span>Informadas</span>
                      <strong>
                        {currentEstimatedHours && currentEstimatedHours > 0
                          ? formatHours(currentEstimatedHours)
                          : "—"}
                      </strong>
                    </div>
                    {rangeStatusLabel ? (
                      <div>
                        <span>Status</span>
                        <strong className="record-assistant__status">{rangeStatusLabel}</strong>
                      </div>
                    ) : null}
                  </div>

                  {showHoursBar ? (
                    <HoursCompareBar
                      current={currentEstimatedHours ?? null}
                      suggested={recommendation.suggestedHours}
                      q1={recommendation.q1}
                      q3={recommendation.q3}
                    />
                  ) : null}

                  {!readOnly && onApplySuggestedHours ? (
                    <div className="record-assistant__cta">
                      <Button type="button" size="sm" onClick={onApplySuggestedHours}>
                        Usar horas sugeridas
                      </Button>
                      <p className="record-assistant__cta-hint">
                        Distribui proporcionalmente entre as etapas já informadas.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="record-assistant__detail">
                  Poucos casos — use a lista abaixo caso a caso antes de fechar horas.
                </p>
              )}
            </section>

            {recommendation.level === "medium" || recommendation.level === "high" ? (
              <section className="record-assistant__section record-assistant__section--reference">
                <h4 className="record-assistant__section-title">Referência</h4>
                <div
                  className={`record-assistant__range${
                    recommendation.level === "high" ? "" : " record-assistant__range--two"
                  }`}
                >
                  <div>
                    <span>Mediana</span>
                    <strong>{formatHours(recommendation.median)}</strong>
                  </div>
                  <div>
                    <span>Faixa usual</span>
                    <strong>
                      {formatHours(recommendation.q1)} – {formatHours(recommendation.q3)}
                    </strong>
                    <p className="record-assistant__stat-hint">
                      Onde ficam os 50% centrais dos casos
                    </p>
                  </div>
                  {recommendation.level === "high" ? (
                    <div>
                      <span>Fator realizado/estimado</span>
                      <strong>
                        {recommendation.correctionFactor !== null
                          ? recommendation.correctionFactor.toFixed(2)
                          : "—"}
                      </strong>
                      {recommendation.correctionFactor !== null ? (
                        <p className="record-assistant__stat-hint">
                          Histórico tende a{" "}
                          {recommendation.correctionFactor >= 1 ? "+" : ""}
                          {Math.round((recommendation.correctionFactor - 1) * 100)}% vs orçado
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <details
              className="record-assistant__evidence"
              open={recommendation.level === "low"}
            >
              <summary>
                Casos formalizados
                <span>{recommendation.caseCount}</span>
              </summary>
              <ul className="record-assistant__cases">
                {visibleCases.map((item) => (
                  <CaseCard key={item.id} item={item} />
                ))}
              </ul>
              {hiddenCaseCount > 0 ? (
                <button
                  type="button"
                  className="record-assistant__cases-toggle"
                  onClick={() => setShowAllCases((value) => !value)}
                >
                  {showAllCases
                    ? "Mostrar menos"
                    : `Ver todos (${recommendation.cases.length} casos)`}
                </button>
              ) : null}
            </details>

            {tariffReferencePrice || priceHistoryMedian ? (
              <footer className="record-assistant__footer">
                {tariffReferencePrice ? (
                  <p>
                    Tarifa calculada: <strong>{formatCurrency(tariffReferencePrice)}</strong>
                  </p>
                ) : null}
                {priceHistoryMedian ? (
                  <p>
                    Histórico mediano: <strong>{formatCurrency(priceHistoryMedian)}</strong>/peça
                  </p>
                ) : null}
                {tariffReferencePrice ? (
                  <a href="#record-cost-composition" className="record-assistant__footer-link">
                    Ver composição tarifária ↓
                  </a>
                ) : null}
              </footer>
            ) : null}
          </>
        )}

        {/* {isDemoData ? (
          <p className="record-assistant__mock-note">
            <FlaskConical aria-hidden="true" />
            Base mock de demonstração — confira os registros fonte.
          </p>
        ) : null} */}
      </div>
    </section>
  );
}
