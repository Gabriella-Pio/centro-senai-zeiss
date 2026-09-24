'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { UserRole } from '@/lib/api';
import { buildRecommendation, countServiceFormalizedCases, findSimilarRecords, getRecordResourceIds, needsEstimationOverrideReason } from '@/lib/assistant';
import { buildCostDonut, buildRecordFinancialSummary } from '@/lib/chart-data';
import { pushNotification, updateDemoState } from '@/lib/demo/demo-store';
import {
  canAccessBlock,
  getRecordDetailNotices,
  getSuggestedBlock,
  isBlockDone,
  type RecordBlock,
} from '@/lib/record-lifecycle';
import {
  deriveRelatedTopicIds,
  getPricingQuantity,
  getStageHoursScope,
  resolveBilledValue,
} from '@/lib/record-helpers';
import { getRecordQuoteMode, needsPriceOverrideReason } from '@/lib/quote-mode';
import { upsertVocabularyTerm } from '@/lib/vocabulary-mutations';
import {
  applySuggestedHoursToRecord,
  finalizeStagesForExecution,
  getRecordStages,
  stagesHaveResources,
  sumStageActualHours,
  sumStageEstimatedHours,
} from '@/lib/record-stages';
import {
  buildPriceHistory,
  buildStageQuoteSnapshot,
  computeStageQuoteCost,
  resolveSuggestedPrice,
} from '@/lib/pricing';
import {
  getValidationHref,
  parseRecordBlockParam,
  setRecordBlockParam,
} from '@/lib/records-navigation';
import { useDemoStore } from '@/lib/use-demo-store';
import { canViewRecord } from '@/lib/formalized-knowledge';
import type {
  RecordBlockAFieldErrors,
  RecordBlockBFieldErrors,
  RecordBlockCFieldErrors,
} from './record-block-field-errors';
import { syncPackageHoursFromStages } from '@/lib/record-package-hours';
import type { ServiceRecord, ServiceStatus } from './types';

export function useRecordDetailBoard(recordId: string, userRole: UserRole, userName: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { records, vocabulary, labSettings } = useDemoStore();
  const rawRecord = records.find((item) => item.id === recordId) ?? null;
  const record =
    rawRecord && canViewRecord(rawRecord, userRole) ? rawRecord : null;
  const [activeTab, setActiveTab] = useState<RecordBlock>('A');
  const [formError, setFormError] = useState<string | null>(null);
  const [blockAFieldErrors, setBlockAFieldErrors] = useState<RecordBlockAFieldErrors>({});
  const [blockBFieldErrors, setBlockBFieldErrors] = useState<RecordBlockBFieldErrors>({});
  const [blockCFieldErrors, setBlockCFieldErrors] = useState<RecordBlockCFieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [stageHighlightPulse, setStageHighlightPulse] = useState(0);

  const serviceTypes = useMemo(
    () => vocabulary.filter((term) => term.class === 'SERVICE_TYPE' && term.active),
    [vocabulary],
  );
  const partTraits = useMemo(
    () => vocabulary.filter((term) => term.class === 'PART_TRAIT' && term.active),
    [vocabulary],
  );
  const resources = useMemo(
    () => vocabulary.filter((term) => term.class === 'RESOURCE' && term.active),
    [vocabulary],
  );
  const deviationCauses = useMemo(
    () => vocabulary.filter((term) => term.class === 'DEVIATION_CAUSE' && term.active),
    [vocabulary],
  );
  const syncBlockParam = useCallback(
    (block: RecordBlock) => {
      const params = new URLSearchParams(searchParams.toString());
      setRecordBlockParam(params, block);
      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const selectBlock = useCallback(
    (block: RecordBlock) => {
      setFormError(null);
      if (block !== 'A') setBlockAFieldErrors({});
      if (block !== 'B') setBlockBFieldErrors({});
      if (block !== 'C') setBlockCFieldErrors({});
      setActiveTab(block);
      syncBlockParam(block);
    },
    [syncBlockParam],
  );

  useEffect(() => {
    const match = records.find((item) => item.id === recordId);
    if (!match) return;

    const blockFromUrl = parseRecordBlockParam(searchParams.get('bloco'));
    if (blockFromUrl && canAccessBlock(match, blockFromUrl)) {
      setActiveTab(blockFromUrl);
      return;
    }

    const suggested = getSuggestedBlock(match);
    setActiveTab(suggested);
    if (blockFromUrl && blockFromUrl !== suggested) {
      syncBlockParam(suggested);
    }
  }, [recordId, records, searchParams, syncBlockParam]);

  const pricingQuantity = record ? getPricingQuantity(record) : 1;
  const stageHoursScope = record ? getStageHoursScope(record) : 'total';

  const liveBreakdown = useMemo(() => {
    if (!record) return null;
    const stages = getRecordStages(record, serviceTypes);
    return computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings,
      quantity: pricingQuantity,
      stageHoursScope,
      resourceRates: record.quoteSnapshot?.resourceRates,
    });
  }, [record, serviceTypes, vocabulary, labSettings, pricingQuantity, stageHoursScope]);

  const actualBreakdown = useMemo(() => {
    if (!record) return null;
    const stages = getRecordStages(record, serviceTypes).map((stage) => ({
      ...stage,
      actualHours: stage.actualHours ?? stage.estimatedHours,
    }));
    return computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings,
      hoursField: 'actualHours',
      quantity: pricingQuantity,
      stageHoursScope,
      resourceRates: record.quoteSnapshot?.resourceRates,
    });
  }, [record, serviceTypes, vocabulary, labSettings, pricingQuantity, stageHoursScope]);

  const costBreakdown = liveBreakdown;

  const frozenTariff = Boolean(record?.quoteSnapshot && record.serviceStatus !== 'DRAFT');
  const quoteOutdated = useMemo(() => {
    if (!record?.quoteSnapshot?.breakdown || !liveBreakdown) {
      return false;
    }
    return record.quoteSnapshot.breakdown.suggestedPrice !== liveBreakdown.suggestedPrice;
  }, [record, liveBreakdown]);
  const detailNotices = useMemo(() => (record ? getRecordDetailNotices(record) : []), [record]);

  const similarCases = useMemo(() => {
    if (!record?.serviceTypeId) return [];
    const resourceIds = getRecordResourceIds(record);
    return findSimilarRecords(
      records,
      record.serviceTypeId,
      record.partTraitIds,
      resourceIds,
      { excludeRecordId: record.id, viewerRole: userRole },
    );
  }, [records, record, userRole]);

  const serviceOnlyCaseCount = useMemo(() => {
    if (!record?.serviceTypeId) return 0;
    return countServiceFormalizedCases(records, record.serviceTypeId, {
      excludeRecordId: record.id,
      viewerRole: userRole,
    });
  }, [records, record, userRole]);

  const priceHistory = useMemo(() => buildPriceHistory(similarCases), [similarCases]);

  const recommendation = useMemo(
    () => buildRecommendation(similarCases),
    [similarCases],
  );

  const serviceTypeGuidance = useMemo(() => {
    if (!record?.serviceTypeId) return null;
    return serviceTypes.find((term) => term.id === record.serviceTypeId)?.guidance ?? null;
  }, [record, serviceTypes]);

  const serviceTypeLabel = useMemo(() => {
    if (!record?.serviceTypeId) return null;
    return serviceTypes.find((term) => term.id === record.serviceTypeId)?.label ?? null;
  }, [record, serviceTypes]);

  const profileChips = useMemo(() => {
    if (!record) return [];
    const chips: string[] = [];
    if (serviceTypeLabel) {
      chips.push(serviceTypeLabel);
    }
    for (const traitId of record.partTraitIds) {
      const trait = partTraits.find((term) => term.id === traitId);
      if (trait) {
        chips.push(trait.label);
      }
    }
    for (const resourceId of getRecordResourceIds(record)) {
      const resource = resources.find((term) => term.id === resourceId);
      if (resource) {
        chips.push(resource.label);
      }
    }
    return chips;
  }, [record, serviceTypeLabel, partTraits, resources]);

  const currentEstimatedHours = useMemo(() => {
    if (!record) return null;
    const stages = getRecordStages(record, serviceTypes);
    const stageHours = sumStageEstimatedHours(stages);
    return stageHours ?? record.estimatedHours ?? null;
  }, [record, serviceTypes]);

  const costDonut = useMemo(
    () => (costBreakdown ? buildCostDonut(costBreakdown.lines) : []),
    [costBreakdown],
  );

  const tariffReferencePrice = costBreakdown?.suggestedPrice ?? 0;
  const suggestedPrice = useMemo(
    () =>
      resolveSuggestedPrice({
        quoteMode: record ? getRecordQuoteMode(record) : 'tariff',
        tariffPrice: tariffReferencePrice,
        historicalCases: similarCases,
      }),
    [record, tariffReferencePrice, similarCases],
  );
  const suggestedUnitPrice = costBreakdown?.unitPrice ?? suggestedPrice;

  const readOnly = Boolean(
    record && (userRole === 'CONSULTA' || record.serviceStatus === 'COMPLETED'),
  );

  const quoteMode = record ? getRecordQuoteMode(record) : 'tariff';
  const needsPriceOverride = record
    ? needsPriceOverrideReason(record, tariffReferencePrice)
    : false;
  const needsEstimationOverride = useMemo(
    () =>
      needsEstimationOverrideReason(
        currentEstimatedHours,
        recommendation.suggestedHours,
        recommendation.level,
      ),
    [currentEstimatedHours, recommendation],
  );
  const canEditQuoteMode =
    (userRole === 'ADMIN' || userRole === 'VALIDADOR') && !readOnly;

  const financialSummary = useMemo(
    () => (record ? buildRecordFinancialSummary(record) : null),
    [record],
  );

  function updateRecord(patch: Partial<ServiceRecord>) {
    if (!record) return;
    const merged = { ...record, ...patch };
    const nextPatch: Partial<ServiceRecord> = {
      ...patch,
      relatedTopicIds: deriveRelatedTopicIds(merged),
    };

    if (patch.hoursPackageRef !== undefined) {
      setBlockAFieldErrors((current) => ({ ...current, hoursPackageRef: undefined }));
    }
    if (patch.estimatedHours !== undefined) {
      setBlockAFieldErrors((current) => ({ ...current, estimatedHours: undefined }));
    }
    if (patch.proposedValue !== undefined) {
      setBlockAFieldErrors((current) => ({ ...current, proposedValue: undefined }));
    }
    if (patch.priceOverrideReason !== undefined) {
      setBlockAFieldErrors((current) => ({ ...current, priceOverrideReason: undefined }));
    }
    if (patch.estimationOverrideReason !== undefined) {
      setBlockAFieldErrors((current) => ({ ...current, estimationOverrideReason: undefined }));
    }
    if (patch.stages !== undefined) {
      setBlockAFieldErrors((current) => ({ ...current, stages: undefined }));
      setBlockBFieldErrors((current) => ({ ...current, stages: undefined }));
    }
    if (patch.billedValue !== undefined) {
      setBlockBFieldErrors((current) => ({ ...current, billedValue: undefined }));
    }
    if (patch.deviationCauseId !== undefined) {
      setBlockCFieldErrors((current) => ({ ...current, deviationCauseId: undefined }));
    }
    if (patch.lesson !== undefined) {
      setBlockCFieldErrors((current) => ({ ...current, lesson: undefined }));
    }

    const syncedPackageHours = syncPackageHoursFromStages(merged, serviceTypes);
    if (syncedPackageHours !== null) {
      nextPatch.estimatedHours = syncedPackageHours;
    }

    if (patch.stages && record.serviceStatus === 'QUOTED') {
      const stages = getRecordStages(merged, serviceTypes).map((stage) => ({
        ...stage,
        actualHours: stage.actualHours ?? stage.estimatedHours,
      }));
      const perPieceHours = sumStageActualHours(stages);
      if (perPieceHours) {
        const breakdown = computeStageQuoteCost({
          vocabulary,
          stages,
          labSettings,
          hoursField: 'actualHours',
          quantity: getPricingQuantity(merged),
          stageHoursScope: getStageHoursScope(merged),
          resourceRates: record.quoteSnapshot?.resourceRates,
        });
        if (breakdown.suggestedPrice > 0) {
          nextPatch.actualHours = perPieceHours;
          nextPatch.actualCost = breakdown.suggestedPrice;
        }
      }
    }

    updateDemoState((state) => ({
      ...state,
      records: state.records.map((item) =>
        item.id === record.id ? { ...item, ...nextPatch } : item,
      ),
    }));
  }

  function createDeviationCause(label: string) {
    if (!record) return;
    updateDemoState((state) => {
      const { vocabulary: nextVocabulary, term } = upsertVocabularyTerm(state.vocabulary, {
        label,
        class: 'DEVIATION_CAUSE',
      });
      const merged = { ...record, deviationCauseId: term.id };
      return {
        ...state,
        vocabulary: nextVocabulary,
        records: state.records.map((item) =>
          item.id === record.id
            ? { ...item, deviationCauseId: term.id, relatedTopicIds: deriveRelatedTopicIds(merged) }
            : item,
        ),
      };
    });
    setNotice(`Causa "${label.trim()}" salva no vocabulário.`);
  }

  function handleBlockedSelect(block: RecordBlock) {
    if (block === 'B') {
      setFormError('Salve o bloco A para liberar a execução.');
      return;
    }
    if (block === 'C') {
      setFormError('Preencha e salve o bloco B antes de registrar a lição.');
    }
  }

  function validateBlockAStages(stages: ReturnType<typeof getRecordStages>, required: boolean) {
    const stageHours = sumStageEstimatedHours(stages);
    if (required && (stages.length === 0 || !stageHours)) {
      return 'Adicione pelo menos uma etapa com horas orçadas.';
    }
    if (stages.length > 0 && stageHours && !stagesHaveResources(stages)) {
      return 'Selecione o recurso de cada etapa informada.';
    }
    if (stages.length > 0 && !stageHours) {
      return 'Informe as horas de cada etapa.';
    }
    return undefined;
  }

  function saveBlockA() {
    if (!record) return;
    const mode = getRecordQuoteMode(record);
    const stages = getRecordStages(record, serviceTypes);
    const syncedHours = syncPackageHoursFromStages(record, serviceTypes);
    const effectiveEstimatedHours = syncedHours ?? record.estimatedHours;

    if (mode === 'hourly_package') {
      const errors: RecordBlockAFieldErrors = {};
      if (!record.hoursPackageRef?.trim()) {
        errors.hoursPackageRef = 'Informe a referência do pacote ou contrato.';
      }
      if (!effectiveEstimatedHours) {
        errors.estimatedHours =
          stages.length > 0
            ? 'Informe horas nas etapas ou no total do pacote.'
            : 'Informe as horas totais do pacote.';
      }
      if (!record.proposedValue) {
        errors.proposedValue = 'Informe o valor do contrato.';
      }
      if (needsEstimationOverride && !record.estimationOverrideReason?.trim()) {
        errors.estimationOverrideReason =
          'Justifique as horas diferentes da sugestão do assistente.';
      }
      const stagesError = validateBlockAStages(stages, false);
      if (stagesError) {
        errors.stages = stagesError;
      }
      if (Object.keys(errors).length > 0) {
        setBlockAFieldErrors(errors);
        setFormError('Corrija os campos obrigatórios destacados no bloco A.');
        return;
      }

      const stageHours = sumStageEstimatedHours(stages);
      const hasPricedStages =
        stages.length > 0 && stageHours && stagesHaveResources(stages);

      let quoteSnapshot = record.quoteSnapshot;
      let estimatedCost = record.estimatedCost;

      if (hasPricedStages) {
        const snapshot = buildStageQuoteSnapshot({
          vocabulary,
          stages: stages.map((stage) => ({
            ...stage,
            actualHours: stage.actualHours ?? stage.estimatedHours,
          })),
          labSettings,
        });
        const pricedBreakdown = computeStageQuoteCost({
          vocabulary,
          stages,
          labSettings,
          quantity: getPricingQuantity(record),
          stageHoursScope: getStageHoursScope(record),
        });
        quoteSnapshot = { ...snapshot, breakdown: pricedBreakdown };
        estimatedCost = pricedBreakdown.suggestedPrice;
      }

      updateRecord({
        serviceStatus: 'QUOTED',
        estimatedBy: userName,
        estimatedHours: effectiveEstimatedHours,
        estimatedCost,
        proposedValue: record.proposedValue,
        billedValue: record.billedValue ?? record.proposedValue,
        quoteSnapshot,
        priceOverrideReason: undefined,
        stages: hasPricedStages
          ? stages.map((stage) => ({
              ...stage,
              actualHours: stage.actualHours ?? stage.estimatedHours,
            }))
          : record.stages,
      });
      setBlockAFieldErrors({});
      setFormError(null);
      setNotice('Pacote salvo e congelado. Você já pode registrar a execução no bloco B.');
      selectBlock('B');
      return;
    }

    const errors: RecordBlockAFieldErrors = {};
    const stagesError = validateBlockAStages(stages, true);
    if (stagesError) {
      errors.stages = stagesError;
    }
    if (!record.proposedValue) {
      errors.proposedValue = 'Informe o valor proposto do orçamento.';
    }
    if (needsPriceOverride && !record.priceOverrideReason?.trim()) {
      errors.priceOverrideReason = 'Justifique o valor diferente do sugerido pela tarifa.';
    }
    if (needsEstimationOverride && !record.estimationOverrideReason?.trim()) {
      errors.estimationOverrideReason =
        'Justifique as horas diferentes da sugestão do assistente.';
    }
    if (Object.keys(errors).length > 0) {
      setBlockAFieldErrors(errors);
      setFormError('Corrija os campos obrigatórios destacados no bloco A.');
      return;
    }

    const stageHours = sumStageEstimatedHours(stages);
    const snapshot = buildStageQuoteSnapshot({
      vocabulary,
      stages: stages.map((stage) => ({
        ...stage,
        actualHours: stage.actualHours ?? stage.estimatedHours,
      })),
      labSettings,
    });
    const pricedBreakdown = computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings,
      quantity: getPricingQuantity(record),
      stageHoursScope: getStageHoursScope(record),
    });
    const proposedValue =
      mode === 'tariff'
        ? (record.proposedValue ?? pricedBreakdown.suggestedPrice)
        : record.proposedValue;
    updateRecord({
      serviceStatus: 'QUOTED',
      estimatedBy: userName,
      estimatedHours: stageHours,
      estimatedCost: pricedBreakdown.suggestedPrice,
      proposedValue,
      billedValue: record.billedValue ?? proposedValue,
      priceOverrideReason: mode === 'tariff' ? record.priceOverrideReason : undefined,
      quoteSnapshot: {
        ...snapshot,
        breakdown: pricedBreakdown,
      },
      stages: stages.map((stage) => ({
        ...stage,
        actualHours: stage.actualHours ?? stage.estimatedHours,
      })),
    });
    setBlockAFieldErrors({});
    setFormError(null);
    setNotice(
      mode === 'commercial_fixed'
        ? 'Valor comercial salvo e congelado. Você já pode registrar a execução no bloco B.'
        : 'Orçamento salvo e congelado. Você já pode registrar a execução no bloco B.',
    );
    selectBlock('B');
  }

  function saveBlockB() {
    if (!record) return;
    const stages = finalizeStagesForExecution(getRecordStages(record, serviceTypes));
    const actualHours = sumStageActualHours(stages);
    const breakdown = computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings,
      hoursField: 'actualHours',
      quantity: getPricingQuantity(record),
      stageHoursScope: getStageHoursScope(record),
      resourceRates: record.quoteSnapshot?.resourceRates,
    });

    const billedValue = resolveBilledValue(record);
    const errors: RecordBlockBFieldErrors = {};
    if (!actualHours) {
      errors.stages = 'Informe as horas realizadas em cada etapa.';
    } else if (!stagesHaveResources(stages)) {
      errors.stages = 'Selecione o recurso de cada etapa realizada.';
    }
    if (!billedValue) {
      errors.billedValue = 'Informe o valor faturado ao cliente.';
    }
    if (Object.keys(errors).length > 0) {
      setBlockBFieldErrors(errors);
      setFormError('Corrija os campos obrigatórios destacados no bloco B.');
      return;
    }

    updateRecord({
      stages,
      actualHours,
      actualCost: breakdown.suggestedPrice,
      billedValue,
    });
    setBlockBFieldErrors({});
    setFormError(null);
    setNotice('Execução registrada. Complete a lição no bloco C para concluir o serviço.');
    selectBlock('C');
  }

  function completeService() {
    if (!record) return;
    if (!isBlockDone(record, 'B')) {
      setFormError('Salve o bloco B antes de concluir o serviço.');
      selectBlock('B');
      return;
    }
    const nextBlockCErrors: RecordBlockCFieldErrors = {};
    if (!record.deviationCauseId) {
      nextBlockCErrors.deviationCauseId = 'Selecione ou cadastre uma causa do desvio.';
    }
    if (!record.lesson.trim()) {
      nextBlockCErrors.lesson = 'Descreva o que a equipe deve lembrar na próxima vez.';
    }
    if (nextBlockCErrors.deviationCauseId || nextBlockCErrors.lesson) {
      setBlockCFieldErrors(nextBlockCErrors);
      setFormError('Corrija os campos obrigatórios destacados no bloco C.');
      selectBlock('C');
      return;
    }
    setBlockCFieldErrors({});
    updateDemoState((state) => ({
      ...state,
      records: state.records.map((item) =>
        item.id === record.id
          ? {
              ...item,
              serviceStatus: 'COMPLETED' as ServiceStatus,
              lessonStatus: 'PENDING' as const,
            }
          : item,
      ),
    }));
    pushNotification({
      roles: ['VALIDADOR', 'ADMIN'],
      message: `Lição de ${record.recordNumber} aguarda validação.`,
      href: getValidationHref(record.id),
    });
    setFormError(null);
    router.push(getValidationHref(record.id));
  }

  function applySuggestedHours() {
    if (!record || recommendation.suggestedHours === null || readOnly) {
      return;
    }

    const patch = applySuggestedHoursToRecord(
      record,
      serviceTypes,
      recommendation.suggestedHours,
    );
    updateRecord({ ...patch, estimationOverrideReason: undefined });
    setStageHighlightPulse((value) => value + 1);
    setNotice(
      `Horas sugeridas (${recommendation.suggestedHours} h) aplicadas ${
        getRecordQuoteMode(record) === 'hourly_package' ? 'ao pacote' : 'às etapas'
      }.`,
    );
    requestAnimationFrame(() => {
      document
        .getElementById('record-stages-editor')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  return {
    record,
    activeTab,
    formError,
    blockAFieldErrors,
    blockBFieldErrors,
    blockCFieldErrors,
    notice,
    serviceTypes,
    partTraits,
    resources,
    deviationCauses,
    vocabulary,
    costBreakdown,
    financialSummary,
    actualBreakdown,
    frozenTariff,
    quoteOutdated,
    detailNotices,
    priceHistory,
    recommendation,
    serviceTypeGuidance,
    serviceTypeLabel,
    profileChips,
    serviceOnlyCaseCount,
    stageHighlightPulse,
    currentEstimatedHours,
    costDonut,
    suggestedPrice,
    suggestedUnitPrice,
    tariffReferencePrice,
    actualCost: actualBreakdown?.suggestedPrice ?? record?.actualCost ?? null,
    needsPriceOverride,
    needsEstimationOverride,
    quoteMode,
    canEditQuoteMode,
    readOnly,
    updateRecord,
    selectBlock,
    handleBlockedSelect,
    saveBlockA,
    saveBlockB,
    completeService,
    createDeviationCause,
    applySuggestedHours,
  };
}
