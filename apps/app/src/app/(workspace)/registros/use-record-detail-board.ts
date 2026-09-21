"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserRole } from "@/lib/api";
import { findSimilarRecords } from "@/lib/assistant";
import { buildCostDonut } from "@/lib/chart-data";
import { pushNotification, updateDemoState } from "@/lib/demo-store";
import {
  canAccessBlock,
  getRecordDetailNotices,
  getSuggestedBlock,
  isBlockDone,
  type RecordBlock,
} from "@/lib/record-lifecycle";
import { getRecordStages, stagesHaveResources, sumStageEstimatedHours } from "@/lib/record-stages";
import { buildPriceHistory, buildStageQuoteSnapshot, computeStageQuoteCost } from "@/lib/pricing";
import {
  getValidationHref,
  parseRecordBlockParam,
  setRecordBlockParam,
} from "@/lib/records-navigation";
import { useDemoStore } from "@/lib/use-demo-store";
import type { ServiceRecord, ServiceStatus } from "./types";

export function useRecordDetailBoard(recordId: string, userRole: UserRole, userName: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { records, vocabulary, labSettings } = useDemoStore();
  const record = records.find((item) => item.id === recordId) ?? null;
  const [activeTab, setActiveTab] = useState<RecordBlock>("A");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const serviceTypes = useMemo(
    () => vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active),
    [vocabulary],
  );
  const partTraits = useMemo(
    () => vocabulary.filter((term) => term.class === "PART_TRAIT" && term.active),
    [vocabulary],
  );
  const resources = useMemo(
    () => vocabulary.filter((term) => term.class === "RESOURCE" && term.active),
    [vocabulary],
  );
  const deviationCauses = useMemo(
    () => vocabulary.filter((term) => term.class === "DEVIATION_CAUSE" && term.active),
    [vocabulary],
  );
  const relatedTopics = useMemo(
    () =>
      vocabulary.filter(
        (term) => term.active && (term.class === "SERVICE_TYPE" || term.class === "PART_TRAIT"),
      ),
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
      setActiveTab(block);
      syncBlockParam(block);
    },
    [syncBlockParam],
  );

  useEffect(() => {
    const match = records.find((item) => item.id === recordId);
    if (!match) return;

    const blockFromUrl = parseRecordBlockParam(searchParams.get("bloco"));
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

  const liveBreakdown = useMemo(() => {
    if (!record) return null;
    const stages = getRecordStages(record, serviceTypes);
    return computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings,
    });
  }, [record, serviceTypes, vocabulary, labSettings]);

  const costBreakdown = useMemo(() => {
    if (!record) return null;
    if (record.quoteSnapshot && record.serviceStatus !== "DRAFT") {
      return record.quoteSnapshot.breakdown;
    }
    return liveBreakdown;
  }, [record, liveBreakdown]);

  const frozenTariff = Boolean(record?.quoteSnapshot && record.serviceStatus !== "DRAFT");
  const detailNotices = useMemo(() => (record ? getRecordDetailNotices(record) : []), [record]);

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

  const readOnly = Boolean(record && (userRole === "CONSULTA" || record.serviceStatus === "COMPLETED"));

  function updateRecord(patch: Partial<ServiceRecord>) {
    if (!record) return;
    updateDemoState((state) => ({
      ...state,
      records: state.records.map((item) => (item.id === record.id ? { ...item, ...patch } : item)),
    }));
  }

  function handleBlockedSelect(block: RecordBlock) {
    if (block === "B") {
      setFormError("Salve o bloco A para liberar a execução.");
      return;
    }
    if (block === "C") {
      setFormError("Preencha e salve o bloco B antes de registrar a lição.");
    }
  }

  function saveBlockA() {
    if (!record) return;
    const stages = getRecordStages(record, serviceTypes);
    const stageHours = sumStageEstimatedHours(stages);
    if (stages.length === 0 || !stageHours || !stagesHaveResources(stages)) {
      setFormError("Informe etapas do serviço, recurso por etapa e horas orçadas no bloco A.");
      return;
    }
    if (needsPriceOverride && !record.priceOverrideReason?.trim()) {
      setFormError("Justifique o valor diferente do sugerido.");
      return;
    }
    const snapshot = buildStageQuoteSnapshot({
      vocabulary,
      stages,
      labSettings,
    });
    updateRecord({
      serviceStatus: "QUOTED",
      estimatedBy: userName,
      estimatedHours: stageHours,
      estimatedCost: snapshot.breakdown.suggestedPrice,
      estimatedEquipmentHours: stageHours,
      proposedValue: record.proposedValue ?? snapshot.breakdown.suggestedPrice,
      quoteSnapshot: snapshot,
    });
    setFormError(null);
    setNotice("Orçamento salvo e congelado. Você já pode registrar a execução no bloco B.");
    selectBlock("B");
  }

  function saveBlockB() {
    if (!record) return;
    if (!record.actualHours || !record.billedValue) {
      setFormError("Informe horas realizadas e valor faturado no bloco B.");
      return;
    }
    setFormError(null);
    setNotice("Execução registrada. Complete a lição no bloco C para concluir o serviço.");
    selectBlock("C");
  }

  function completeService() {
    if (!record) return;
    if (!isBlockDone(record, "B")) {
      setFormError("Salve o bloco B antes de concluir o serviço.");
      selectBlock("B");
      return;
    }
    if (!record.deviationCauseId || !record.lesson.trim()) {
      setFormError("Preencha causa do desvio e lição aprendida no bloco C.");
      selectBlock("C");
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
      href: getValidationHref(record.id),
    });
    setFormError(null);
    router.push(getValidationHref(record.id));
  }

  return {
    record,
    activeTab,
    formError,
    notice,
    serviceTypes,
    partTraits,
    resources,
    deviationCauses,
    relatedTopics,
    costBreakdown,
    frozenTariff,
    detailNotices,
    priceHistory,
    costDonut,
    suggestedPrice,
    needsPriceOverride,
    readOnly,
    updateRecord,
    selectBlock,
    handleBlockedSelect,
    saveBlockA,
    saveBlockB,
    completeService,
  };
}
