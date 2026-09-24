"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button, Input, Label } from "@cem/ui";
import {
  getRecordQuantity,
  getStageHoursScope,
  isBatchRecord,
  isPerPieceStageHours,
  shouldShowStageHoursScopeToggle,
} from "@/lib/record-helpers";
import { getRecordQuoteMode } from "@/lib/quote-mode";
import { getStageResourceOptions } from "@/lib/record-stage-resources";
import {
  addServiceStage,
  getRecordStages,
  removeServiceStage,
  sumStageActualHours,
  sumStageEstimatedHours,
  updateServiceStage,
} from "@/lib/record-stages";
import { formatCurrency } from "@/lib/pricing";
import type { VocabularyTerm } from "../vocabulario/types";
import { RecordFieldError } from "./RecordFieldLabel";
import { RecordVocabularyAddPanel } from "./RecordVocabularyAddPanel";
import type { ServiceRecord, StageHoursScope } from "./types";

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function RecordServiceStagesEditor({
  record,
  serviceTypes,
  resources,
  readOnly,
  mode = "estimate",
  stagesError,
  highlightPulse = 0,
  onUpdate,
}: {
  record: ServiceRecord;
  serviceTypes: VocabularyTerm[];
  resources: VocabularyTerm[];
  readOnly: boolean;
  mode?: "estimate" | "actual";
  stagesError?: string;
  highlightPulse?: number;
  onUpdate: (patch: Partial<ServiceRecord>) => void;
}) {
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    if (!highlightPulse) {
      return;
    }

    setPulseActive(true);
    const timer = window.setTimeout(() => setPulseActive(false), 1800);
    return () => window.clearTimeout(timer);
  }, [highlightPulse]);
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const stages = getRecordStages(record, serviceTypes);
  const isActual = mode === "actual";
  const isBatch = isBatchRecord(record);
  const quoteMode = getRecordQuoteMode(record);
  const hoursScope = getStageHoursScope(record);
  const perPieceHours = isPerPieceStageHours(record);
  const showHoursScopeToggle = shouldShowStageHoursScopeToggle(record);
  const quantity = getRecordQuantity(record);
  const totalEstimated = sumStageEstimatedHours(stages);
  const totalActual = sumStageActualHours(stages, { allowFallback: true });
  const stageTotal = isActual ? totalActual : totalEstimated;

  const sortedServiceTypes = useMemo(
    () => [...serviceTypes].sort((left, right) => left.label.localeCompare(right.label, "pt-BR")),
    [serviceTypes],
  );

  const canAddStages = useMemo(() => {
    if (isActual) {
      return sortedServiceTypes.length > 0;
    }
    const selectedIds = new Set(stages.map((stage) => stage.serviceTypeId));
    return sortedServiceTypes.some((term) => !selectedIds.has(term.id));
  }, [isActual, sortedServiceTypes, stages]);

  const available = useMemo(() => {
    const selectedIds = isActual
      ? new Set<string>()
      : new Set(stages.map((stage) => stage.serviceTypeId));
    const needle = normalize(query);
    return sortedServiceTypes.filter((term) => {
      if (!isActual && selectedIds.has(term.id)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return [term.label, term.guidance ?? ""].some((value) => normalize(value).includes(needle));
    });
  }, [isActual, query, sortedServiceTypes, stages]);

  function moveStage(stageId: string, direction: -1 | 1) {
    const index = stages.findIndex((stage) => stage.id === stageId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= stages.length) {
      return;
    }
    const next = [...stages];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onUpdate({
      stages: next,
      service: next.map((stage) => stage.label).join(" + "),
      serviceTypeId: next[0]?.serviceTypeId,
      recordKind: next.length > 1 ? "composite" : record.recordKind === "batch" ? "batch" : "single",
    });
  }

  const hoursSuffix = perPieceHours ? "/peça" : "";

  function setHoursScope(scope: StageHoursScope) {
    onUpdate({ stageHoursScope: scope });
  }

  function hoursHint() {
    if (isActual) {
      if (perPieceHours) {
        return `Horas por peça em cada etapa · lote de ${quantity} peças. Ajuste o realizado ou adicione etapas extras.`;
      }
      if (quoteMode === "hourly_package") {
        return "Horas totais do pacote em cada etapa. Ajuste o realizado ou adicione etapas extras.";
      }
      return "Horas totais em cada etapa. Ajuste o realizado ou adicione etapas extras.";
    }
    if (perPieceHours) {
      return `Cada etapa combina tipo de serviço, recurso e horas por peça · lote de ${quantity} peças.`;
    }
    if (quoteMode === "hourly_package") {
      return "Informe as horas totais de cada etapa do pacote/contrato — útil para distribuir o volume contratado.";
    }
    return "Cada etapa combina tipo de serviço, recurso e horas totais do serviço.";
  }

  return (
    <div
      className={`record-stages-editor${
        pulseActive ? " record-stages-editor--pulse" : ""
      }`}
      id="record-stages-editor"
    >
      <div className="record-stages-editor__header">
        <Label>{isActual ? "Etapas realizadas" : "Etapas do serviço"}</Label>
        <p className="record-detail-page__field-hint">{hoursHint()}</p>
        {!isActual && showHoursScopeToggle && !readOnly ? (
          <div
            className="record-scope-toggle record-stages-editor__hours-scope"
            role="radiogroup"
            aria-label="Como informar horas nas etapas"
          >
            <button
              type="button"
              role="radio"
              aria-checked={hoursScope === "per_piece"}
              className={`record-scope-toggle__option${
                hoursScope === "per_piece" ? " record-scope-toggle__option--active" : ""
              }`}
              onClick={() => setHoursScope("per_piece")}
            >
              Por peça
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={hoursScope === "total"}
              className={`record-scope-toggle__option${
                hoursScope === "total" ? " record-scope-toggle__option--active" : ""
              }`}
              onClick={() => setHoursScope("total")}
            >
              {quoteMode === "hourly_package" ? "Total do pacote" : "Horas totais"}
            </button>
          </div>
        ) : !isActual && showHoursScopeToggle ? (
          <p className="record-detail-page__quote-mode-badge">
            {hoursScope === "per_piece" ? "Horas por peça" : quoteMode === "hourly_package" ? "Horas totais do pacote" : "Horas totais"}
          </p>
        ) : null}
        <RecordFieldError error={stagesError} />
      </div>

      {stages.length > 0 ? (
        <div className="record-stages-editor__table-wrap">
          <table className="record-stages-table">
            <thead>
              <tr>
                <th scope="col">Etapa</th>
                <th scope="col">Recurso</th>
                {isActual ? <th scope="col">Orçado{hoursSuffix}</th> : null}
                <th scope="col">{isActual ? `Realizado${hoursSuffix}` : `Horas orçadas${hoursSuffix}`}</th>
                {!readOnly ? <th scope="col" className="record-stages-table__actions-heading">Ordem</th> : null}
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, index) => {
                const resourceOptions = getStageResourceOptions(stage.serviceTypeId, resources);
                const selectedResourceId = stage.resourceId ?? stage.resourceIds[0] ?? "";
                const actualDisplay = stage.actualHours ?? stage.estimatedHours ?? "";

                return (
                  <tr key={stage.id}>
                    <td>
                      <div className="record-stages-editor__stage-label">
                        {!readOnly && (isActual || stages.length > 1) ? (
                          <button
                            type="button"
                            className="record-stages-editor__remove"
                            onClick={() => onUpdate(removeServiceStage(record, serviceTypes, stage.id))}
                            aria-label={`Remover ${stage.label}`}
                          >
                            <X aria-hidden="true" />
                          </button>
                        ) : null}
                        <strong>{stage.label}</strong>
                      </div>
                    </td>
                    <td>
                      <select
                        disabled={readOnly}
                        value={selectedResourceId}
                        onChange={(event) => {
                          const resourceId = event.target.value || null;
                          onUpdate(
                            updateServiceStage(record, serviceTypes, stage.id, {
                              resourceId,
                              resourceIds: resourceId ? [resourceId] : [],
                            }),
                          );
                        }}
                        className="record-stages-editor__resource-select"
                        aria-label={`Recurso para ${stage.label}`}
                      >
                        <option value="">Selecione…</option>
                        {resourceOptions.map((resource) => (
                          <option key={resource.id} value={resource.id}>
                            {resource.label}
                            {resource.hourlyRate ? ` · ${formatCurrency(resource.hourlyRate)}/h` : ""}
                          </option>
                        ))}
                      </select>
                    </td>
                    {isActual ? (
                      <td className="record-stages-table__budgeted-hours">
                        {stage.estimatedHours ?? "—"}
                        {stage.estimatedHours ? ` h` : ""}
                      </td>
                    ) : null}
                    <td>
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        disabled={readOnly}
                        value={
                          isActual
                            ? actualDisplay === "" ? "" : actualDisplay
                            : stage.estimatedHours ?? ""
                        }
                        onChange={(event) =>
                          onUpdate(
                            updateServiceStage(record, serviceTypes, stage.id, isActual
                              ? {
                                  actualHours: event.target.value ? Number(event.target.value) : null,
                                }
                              : {
                                  estimatedHours: event.target.value ? Number(event.target.value) : null,
                                }),
                          )
                        }
                        className="h-11 record-stages-editor__hours-input"
                        placeholder="h"
                        aria-label={
                          isActual
                            ? `Horas realizadas para ${stage.label}`
                            : `Horas orçadas para ${stage.label}`
                        }
                      />
                    </td>
                    {!readOnly ? (
                      <td className="record-stages-table__actions">
                        <div className="record-stages-editor__order">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            aria-label={`Mover ${stage.label} para cima`}
                            onClick={() => moveStage(stage.id, -1)}
                          >
                            <ArrowUp aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === stages.length - 1}
                            aria-label={`Mover ${stage.label} para baixo`}
                            onClick={() => moveStage(stage.id, 1)}
                          >
                            <ArrowDown aria-hidden="true" />
                          </Button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
            {stageTotal !== null ? (
              <tfoot>
                <tr>
                  <td colSpan={isActual ? 2 : 2}>
                    <strong>{isActual ? "Total realizado" : "Total previsto"}</strong>
                    {perPieceHours ? (
                      <span className="record-stages-table__foot-note">
                        {" "}
                        · {stageTotal.toFixed(1)} h/peça
                        {" "}
                        · {(stageTotal * quantity).toFixed(1)} h no lote
                      </span>
                    ) : isBatch ? (
                      <span className="record-stages-table__foot-note">
                        {" "}
                        · total do lote ({quantity} peças)
                      </span>
                    ) : quoteMode === "hourly_package" ? (
                      <span className="record-stages-table__foot-note"> · total do pacote</span>
                    ) : null}
                  </td>
                  {isActual ? <td /> : null}
                  <td>
                    <strong>{stageTotal.toFixed(1)} h</strong>
                  </td>
                  {!readOnly ? <td /> : null}
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      ) : (
        <p className="record-stages-editor__empty">
          {isActual
            ? "Nenhuma etapa para registrar. Salve o bloco A primeiro."
            : "Adicione pelo menos uma etapa para classificar o serviço."}
        </p>
      )}

      {!readOnly ? (
        <RecordVocabularyAddPanel
          addLabel={isActual ? "Adicionar etapa extra" : "Adicionar etapa"}
          canAdd={canAddStages}
          query={query}
          onQueryChange={setQuery}
          open={addOpen}
          onOpenChange={setAddOpen}
          searchPlaceholder="Buscar tipo de serviço..."
          searchAriaLabel="Buscar tipo de serviço"
        >
          {available.length === 0 ? (
            <p className="record-vocab-picker__empty-list">
              {query.trim()
                ? `Nenhum tipo de serviço encontrado para "${query.trim()}".`
                : "Nenhum tipo de serviço disponível."}
            </p>
          ) : (
            available.map((term) => (
              <button
                key={`${term.id}-${isActual ? "exec" : "est"}`}
                type="button"
                className="record-vocab-picker__option"
                onClick={() => {
                  onUpdate(
                    addServiceStage(record, serviceTypes, term, resources, {
                      allowDuplicate: isActual,
                    }),
                  );
                  setQuery("");
                  setAddOpen(false);
                }}
              >
                <span className="record-vocab-picker__option-label">
                  <Plus aria-hidden="true" />
                  {term.label}
                </span>
                {term.guidance ? (
                  <span className="record-vocab-picker__option-guidance">{term.guidance}</span>
                ) : null}
              </button>
            ))
          )}
        </RecordVocabularyAddPanel>
      ) : null}
    </div>
  );
}
