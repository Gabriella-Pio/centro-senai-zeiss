import type { UserRole } from "./api";
import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { QuoteRequest } from "@/app/(workspace)/solicitacoes/types";
import { upgradeQuoteRequest } from "./request-lifecycle";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import { DEMO_SEED_VERSION } from "./cargill-demo-records";
import { createSeedState } from "./demo-store-seed";
import {
  applyMachineTariffsToVocabulary,
  createMachineTariff,
  type MachineCostInputs,
  type MachineTariff,
} from "./machine-tariff";
import { getResourceUsageCount } from "./machine-tariff-utils";
import { DEFAULT_MACHINE_INPUTS } from "./machine-tariff-seed";
import { DEFAULT_LAB_SETTINGS, type DemoNotification, type DemoState } from "./demo-store-types";

export const DEMO_STATE_KEY = "cem_demo_state";
export const DEMO_CHANGED_EVENT = "cem-demo-changed";

const LEGACY_KEYS = [
  "cem_demo_quote_requests",
  "cem_demo_service_records",
  "cem_demo_vocabulary",
];

function isBrowser() {
  return typeof window !== "undefined";
}

function migrateLegacyState(): DemoState | null {
  if (!isBrowser()) {
    return null;
  }
  const hasLegacy = LEGACY_KEYS.some((key) => window.localStorage.getItem(key));
  if (!hasLegacy) {
    return null;
  }
  const seed = createSeedState();
  try {
    const requestsRaw = window.localStorage.getItem("cem_demo_quote_requests");
    if (requestsRaw) {
      seed.requests = (JSON.parse(requestsRaw) as QuoteRequest[]).map(upgradeQuoteRequest);
    }
    const recordsRaw = window.localStorage.getItem("cem_demo_service_records");
    if (recordsRaw) {
      seed.records = (JSON.parse(recordsRaw) as ServiceRecord[]).map(upgradeRecord);
    }
    const vocabularyRaw = window.localStorage.getItem("cem_demo_vocabulary");
    if (vocabularyRaw) {
      seed.vocabulary = JSON.parse(vocabularyRaw) as VocabularyTerm[];
    }
  } catch {
    return createSeedState();
  }
  LEGACY_KEYS.forEach((key) => window.localStorage.removeItem(key));
  return seed;
}

function upgradeRecord(record: ServiceRecord & { status?: string }): ServiceRecord {
  const legacyStatus = record.status as string | undefined;
  let serviceStatus = record.serviceStatus ?? "DRAFT";
  let lessonStatus = record.lessonStatus ?? "DRAFT";
  if (legacyStatus === "IN_REVIEW") {
    lessonStatus = "PENDING";
    serviceStatus = "COMPLETED";
  } else if (legacyStatus === "FORMALIZED") {
    lessonStatus = "FORMALIZED";
    serviceStatus = "COMPLETED";
  } else if (legacyStatus === "DRAFT") {
    serviceStatus = record.estimatedHours ? "QUOTED" : "DRAFT";
  }
  return {
    ...record,
    isDemo: record.isDemo ?? true,
    partTraitIds: record.partTraitIds ?? [],
    resourceIds: record.resourceIds ?? [],
    estimatedCost: record.estimatedCost ?? null,
    proposedValue: record.proposedValue ?? null,
    actualHours: record.actualHours ?? null,
    actualCost: record.actualCost ?? null,
    billedValue: record.billedValue ?? null,
    deliveredAt: record.deliveredAt ?? null,
    rework: record.rework ?? false,
    scopeChange: record.scopeChange ?? false,
    deviationCauseId: record.deviationCauseId ?? null,
    lesson: record.lesson ?? "",
    relatedTopicIds: record.relatedTopicIds ?? [],
    visibility: record.visibility ?? "PUBLIC",
    quantity: record.quantity ?? 1,
    stages: record.stages ?? [],
    quoteSnapshot: record.quoteSnapshot,
    serviceStatus,
    lessonStatus,
  };
}

export function updateMachineTariffInputs(
  state: DemoState,
  tariffId: string,
  patch: Partial<MachineCostInputs>,
): DemoState {
  const machineTariffs = state.machineTariffs.map((tariff) =>
    tariff.id === tariffId ? { ...tariff, inputs: { ...tariff.inputs, ...patch } } : tariff,
  );
  return {
    ...state,
    machineTariffs,
    vocabulary: applyMachineTariffsToVocabulary(state.vocabulary, machineTariffs),
  };
}

function setVocabularyResourceActive(state: DemoState, resourceId: string, active: boolean) {
  return state.vocabulary.map((term) =>
    term.id === resourceId ? { ...term, active, updatedAt: new Date().toISOString() } : term,
  );
}

function withMachineTariffs(state: DemoState, machineTariffs: MachineTariff[]): DemoState {
  return {
    ...state,
    machineTariffs,
    vocabulary: applyMachineTariffsToVocabulary(state.vocabulary, machineTariffs),
  };
}

export function addMachineTariff(
  state: DemoState,
  label: string,
  options?: {
    tariffId?: string;
    inputs?: MachineCostInputs;
  },
): DemoState {
  const trimmed = label.trim();
  const stamp = options?.tariffId ? options.tariffId.replace(/^machine-/, "") : String(Date.now());
  const id = options?.tariffId ?? `machine-${stamp}`;
  const resourceId = `vocab-${stamp}`;
  const tariff = createMachineTariff({
    id,
    resourceId,
    label: trimmed,
    inputs: options?.inputs ?? { ...DEFAULT_MACHINE_INPUTS },
  });
  const resource: VocabularyTerm = {
    id: resourceId,
    label: trimmed,
    class: "RESOURCE",
    guidance: "Recurso cadastrado na folha de custos por máquina.",
    active: true,
    updatedAt: new Date().toISOString(),
  };
  const machineTariffs = [...state.machineTariffs, tariff];
  return {
    ...state,
    machineTariffs,
    vocabulary: applyMachineTariffsToVocabulary([...state.vocabulary, resource], machineTariffs),
  };
}

export function archiveMachineTariff(state: DemoState, tariffId: string): DemoState {
  const tariff = state.machineTariffs.find((item) => item.id === tariffId);
  if (!tariff) return state;

  const archivedAt = new Date().toISOString();
  const machineTariffs = state.machineTariffs.map((item) =>
    item.id === tariffId ? { ...item, archivedAt } : item,
  );
  const next = withMachineTariffs(state, machineTariffs);

  return {
    ...next,
    vocabulary: setVocabularyResourceActive(next, tariff.resourceId, false),
  };
}

export function restoreMachineTariff(state: DemoState, tariffId: string): DemoState {
  const tariff = state.machineTariffs.find((item) => item.id === tariffId);
  if (!tariff) return state;

  const machineTariffs = state.machineTariffs.map((item) =>
    item.id === tariffId ? { ...item, archivedAt: null } : item,
  );
  const next = withMachineTariffs(state, machineTariffs);

  return {
    ...next,
    vocabulary: setVocabularyResourceActive(next, tariff.resourceId, true),
  };
}

export function renameMachineTariff(state: DemoState, tariffId: string, label: string): DemoState {
  const trimmed = label.trim();
  const tariff = state.machineTariffs.find((item) => item.id === tariffId);
  if (!tariff) return state;

  const machineTariffs = state.machineTariffs.map((item) =>
    item.id === tariffId ? { ...item, label: trimmed } : item,
  );
  const vocabulary = state.vocabulary.map((term) =>
    term.id === tariff.resourceId
      ? { ...term, label: trimmed, updatedAt: new Date().toISOString() }
      : term,
  );

  return {
    ...state,
    machineTariffs,
    vocabulary: applyMachineTariffsToVocabulary(vocabulary, machineTariffs),
  };
}

export function duplicateMachineTariff(
  state: DemoState,
  sourceId: string,
  label: string,
  tariffId?: string,
): DemoState {
  const source = state.machineTariffs.find((item) => item.id === sourceId);
  if (!source) return state;

  return addMachineTariff(state, label, {
    tariffId,
    inputs: { ...source.inputs },
  });
}

export function deleteMachineTariff(state: DemoState, tariffId: string): DemoState {
  const tariff = state.machineTariffs.find((item) => item.id === tariffId);
  if (!tariff) return state;

  const usage = getResourceUsageCount(state, tariff.resourceId);
  if (usage.total > 0) return state;

  const machineTariffs = state.machineTariffs.filter((item) => item.id !== tariffId);
  const vocabulary = state.vocabulary.filter((term) => term.id !== tariff.resourceId);

  return {
    ...state,
    machineTariffs,
    vocabulary: applyMachineTariffsToVocabulary(vocabulary, machineTariffs),
  };
}

function mergeVocabularyWithSeed(stored: VocabularyTerm[], seed: VocabularyTerm[]) {
  const seedById = new Map(seed.map((term) => [term.id, term]));
  const merged = stored.map((term) => {
    const seedTerm = seedById.get(term.id);
    if (term.class === "RESOURCE" && seedTerm?.hourlyRate && !term.hourlyRate) {
      return { ...term, hourlyRate: seedTerm.hourlyRate };
    }
    return term;
  });
  seed.forEach((term) => {
    if (!merged.some((item) => item.id === term.id)) {
      merged.push(term);
    }
  });
  return merged;
}

export function readDemoState(): DemoState {
  if (!isBrowser()) {
    return createSeedState();
  }
  const seed = createSeedState();
  const raw = window.localStorage.getItem(DEMO_STATE_KEY);
  if (!raw) {
    const migrated = migrateLegacyState();
    const initial = migrated ?? seed;
    writeDemoState(initial);
    return initial;
  }
  try {
    const parsed = JSON.parse(raw) as DemoState;
    const storedVersion = parsed.seedVersion ?? 1;
    const userRecords = (parsed.records ?? []).filter((record) => !record.isDemo);
    const records =
      storedVersion < DEMO_SEED_VERSION
        ? [...seed.records, ...userRecords.map(upgradeRecord)]
        : (parsed.records ?? []).map(upgradeRecord);
    const merged = {
      ...seed,
      ...parsed,
      seedVersion: DEMO_SEED_VERSION,
      requests: (parsed.requests ?? seed.requests).map(upgradeQuoteRequest),
      records,
      vocabulary: mergeVocabularyWithSeed(parsed.vocabulary ?? [], seed.vocabulary),
      machineTariffs: (storedVersion < DEMO_SEED_VERSION
        ? seed.machineTariffs
        : (parsed.machineTariffs ?? seed.machineTariffs)
      ).map((tariff) => ({
        ...tariff,
        inputs: {
          ...tariff.inputs,
          variableSalaryHourly: tariff.inputs.variableSalaryHourly ?? tariff.inputs.hourlySalary,
          administrativeOverheadPercent: tariff.inputs.administrativeOverheadPercent ?? 65,
        },
      })),
      labSettings: { ...DEFAULT_LAB_SETTINGS, ...parsed.labSettings },
    };
    if (storedVersion < DEMO_SEED_VERSION) {
      writeDemoState(merged);
    }
    return merged;
  } catch {
    writeDemoState(seed);
    return seed;
  }
}

export function writeDemoState(state: DemoState) {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(DEMO_STATE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(DEMO_CHANGED_EVENT));
}

export function patchDemoState(patch: Partial<DemoState>) {
  const current = readDemoState();
  writeDemoState({ ...current, ...patch });
}

export function updateDemoState(updater: (state: DemoState) => DemoState) {
  writeDemoState(updater(readDemoState()));
}

export function subscribeDemoStore(onChange: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(DEMO_CHANGED_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(DEMO_CHANGED_EVENT, handler);
  };
}

export function pushNotification(input: {
  roles: UserRole[];
  message: string;
  href: string;
}) {
  updateDemoState((state) => ({
    ...state,
    notifications: [
      {
        id: `notif-${Date.now()}`,
        roles: input.roles,
        message: input.message,
        href: input.href,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...state.notifications,
    ],
  }));
}

export function markNotificationRead(id: string) {
  updateDemoState((state) => ({
    ...state,
    notifications: state.notifications.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    ),
  }));
}

export function markAllNotificationsRead(role: UserRole) {
  updateDemoState((state) => ({
    ...state,
    notifications: state.notifications.map((item) =>
      item.roles.includes(role) ? { ...item, read: true } : item,
    ),
  }));
}

export function unreadNotificationCount(role: UserRole) {
  return readDemoState().notifications.filter((item) => item.roles.includes(role) && !item.read).length;
}

export function nextRecordNumber(records: ServiceRecord[]) {
  const nextSequence =
    records.reduce((highest, record) => {
      const sequence = Number(record.recordNumber?.match(/-(\d{4})$/)?.[1] ?? 0);
      return Math.max(highest, sequence);
    }, 0) + 1;
  return `RS-2026-${String(nextSequence).padStart(4, "0")}`;
}

export function nextRequestNumber(requests: QuoteRequest[]) {
  const nextSequence =
    requests.reduce((highest, request) => {
      const sequence = Number(request.requestNumber?.match(/-(\d{4})$/)?.[1] ?? 0);
      return Math.max(highest, sequence);
    }, 0) + 1;
  return `SO-2026-${String(nextSequence).padStart(4, "0")}`;
}

export function createEmptyRecord(partial: Partial<ServiceRecord> & Pick<ServiceRecord, "company" | "requester" | "service">): ServiceRecord {
  const state = readDemoState();
  return {
    id: `record-${Date.now()}`,
    recordNumber: nextRecordNumber(state.records),
    createdAt: new Date().toISOString(),
    isDemo: true,
    partTraitIds: [],
    resourceIds: [],
    estimatedHours: null,
    estimatedEquipmentHours: null,
    estimatedCost: null,
    proposedValue: null,
    assumptions: "",
    serviceStatus: "DRAFT",
    actualHours: null,
    actualCost: null,
    billedValue: null,
    deliveredAt: null,
    rework: false,
    scopeChange: false,
    deviationCauseId: null,
    lesson: "",
    relatedTopicIds: [],
    visibility: "PUBLIC",
    lessonStatus: "DRAFT",
    quantity: 1,
    stages: [],
    ...partial,
  };
}

export type { DemoNotification, DemoState };
