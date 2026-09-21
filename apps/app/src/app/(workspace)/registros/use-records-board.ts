"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { UserRole } from "@/lib/api";
import { createEmptyRecord, updateDemoState } from "@/lib/demo-store";
import { getRecordDetailPath } from "@/lib/records-navigation";
import { useDemoStore } from "@/lib/use-demo-store";
import type { ServiceRecord, ServiceStatus } from "./types";
import { countRecordsByStatus, filterRecords } from "./records-utils";

function canViewRecord(record: ServiceRecord, role: UserRole) {
  if (record.visibility === "RESTRICTED" && role === "CONSULTA") {
    return false;
  }
  return true;
}

export function useRecordsBoard(userRole: UserRole, userName: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { records, vocabulary } = useDemoStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | ServiceStatus>("ALL");
  const [company, setCompany] = useState("ALL");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ company: "", requester: "", service: "", serviceTypeId: "" });

  const registroId = searchParams.get("registro");
  const serviceTypes = vocabulary.filter((term) => term.class === "SERVICE_TYPE" && term.active);
  const canCreate = userRole !== "CONSULTA";

  useEffect(() => {
    if (!registroId) {
      return;
    }
    router.replace(getRecordDetailPath(registroId));
  }, [registroId, router]);

  const visibleRecords = useMemo(
    () => records.filter((record) => canViewRecord(record, userRole)),
    [records, userRole],
  );

  const companies = useMemo(
    () => [...new Set(visibleRecords.map((record) => record.company))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [visibleRecords],
  );

  const statusCounts = useMemo(() => countRecordsByStatus(visibleRecords), [visibleRecords]);
  const filtered = useMemo(
    () => filterRecords(visibleRecords, query, status, company),
    [company, query, status, visibleRecords],
  );
  const filtering = Boolean(query.trim()) || status !== "ALL" || company !== "ALL";

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
    updateDemoState((state) => ({ ...state, records: [...state.records, record] }));
    setDraft({ company: "", requester: "", service: "", serviceTypeId: "" });
    setFormError(null);
    setCreating(false);
    router.push(getRecordDetailPath(record.id));
  }

  function clearFilters() {
    setQuery("");
    setStatus("ALL");
    setCompany("ALL");
  }

  return {
    query,
    setQuery,
    status,
    setStatus,
    company,
    setCompany,
    creating,
    setCreating,
    formError,
    setFormError,
    draft,
    setDraft,
    serviceTypes,
    canCreate,
    companies,
    statusCounts,
    filtered,
    filtering,
    createRecord,
    clearFilters,
  };
}
