import type { ServiceRecord, ServiceStage } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import { getRecordScopeMode } from "@/lib/record-helpers";
import { getDefaultStageResourceId } from "@/lib/record-stage-resources";

export function getStageResourceId(stage: ServiceStage): string | null {
  if (stage.resourceId) {
    return stage.resourceId;
  }
  return stage.resourceIds[0] ?? null;
}

export function normalizeServiceStage(stage: ServiceStage): ServiceStage {
  const resourceId = getStageResourceId(stage);
  return {
    ...stage,
    resourceId,
    resourceIds: resourceId ? [resourceId] : [],
  };
}

export function createServiceStage(
  term: VocabularyTerm,
  resources: VocabularyTerm[] = [],
): ServiceStage {
  const resourceId = getDefaultStageResourceId(term.id, resources);
  return {
    id: `stage-${term.id}-${Date.now()}`,
    serviceTypeId: term.id,
    label: term.label,
    resourceId,
    resourceIds: resourceId ? [resourceId] : [],
    estimatedHours: null,
    actualHours: null,
  };
}

export function getRecordStages(record: ServiceRecord, serviceTypes: VocabularyTerm[]): ServiceStage[] {
  if (record.stages && record.stages.length > 0) {
    return record.stages.map(normalizeServiceStage);
  }
  if (!record.serviceTypeId) {
    return [];
  }
  const term = serviceTypes.find((item) => item.id === record.serviceTypeId);
  const resourceId = record.resourceIds[0] ?? null;
  return [
    normalizeServiceStage({
      id: `stage-legacy-${record.id}`,
      serviceTypeId: record.serviceTypeId,
      label: term?.label ?? record.service,
      resourceId,
      resourceIds: record.resourceIds,
      estimatedHours: record.estimatedHours,
      actualHours: record.actualHours,
    }),
  ];
}

export function collectStageResourceIds(stages: ServiceStage[]) {
  return [...new Set(stages.map(getStageResourceId).filter((id): id is string => Boolean(id)))];
}

export function stagesHaveResources(stages: ServiceStage[]) {
  return stages.length > 0 && stages.every((stage) => Boolean(getStageResourceId(stage)));
}

export function sumStageEstimatedHours(stages: ServiceStage[]) {
  if (stages.length === 0 || stages.some((stage) => stage.estimatedHours === null)) {
    return null;
  }
  return stages.reduce((total, stage) => total + (stage.estimatedHours ?? 0), 0);
}

export function buildRecordPatchFromStages(
  record: ServiceRecord,
  stages: ServiceStage[],
): Partial<ServiceRecord> {
  const estimatedHours = sumStageEstimatedHours(stages);
  const scopeMode = getRecordScopeMode(record);

  const normalizedStages = stages.map(normalizeServiceStage);

  return {
    stages: normalizedStages,
    serviceTypeId: normalizedStages[0]?.serviceTypeId,
    service: normalizedStages.map((stage) => stage.label).join(" + ") || record.service,
    resourceIds: collectStageResourceIds(normalizedStages),
    estimatedHours: estimatedHours ?? record.estimatedHours,
    recordKind: normalizedStages.length > 1 ? "composite" : scopeMode === "batch" ? "batch" : "single",
  };
}

export function addServiceStage(
  record: ServiceRecord,
  serviceTypes: VocabularyTerm[],
  term: VocabularyTerm,
  resources: VocabularyTerm[] = [],
): Partial<ServiceRecord> {
  const stages = getRecordStages(record, serviceTypes);
  if (stages.some((stage) => stage.serviceTypeId === term.id)) {
    return {};
  }
  return buildRecordPatchFromStages(record, [...stages, createServiceStage(term, resources)]);
}

export function removeServiceStage(
  record: ServiceRecord,
  serviceTypes: VocabularyTerm[],
  stageId: string,
): Partial<ServiceRecord> {
  const stages = getRecordStages(record, serviceTypes).filter((stage) => stage.id !== stageId);
  return buildRecordPatchFromStages(record, stages);
}

export function updateServiceStage(
  record: ServiceRecord,
  serviceTypes: VocabularyTerm[],
  stageId: string,
  patch: Partial<ServiceStage>,
): Partial<ServiceRecord> {
  const stages = getRecordStages(record, serviceTypes).map((stage) =>
    stage.id === stageId ? { ...stage, ...patch } : stage,
  );
  return buildRecordPatchFromStages(record, stages);
}
