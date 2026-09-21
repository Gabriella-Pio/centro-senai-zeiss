import { describe, expect, it } from "vitest";
import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import { getRecordScopeMode, resolveQuoteHours } from "@/lib/record-helpers";

function createRecord(overrides: Partial<ServiceRecord> = {}): ServiceRecord {
  return {
    id: "record-test",
    recordNumber: "RS-2026-0099",
    company: "Empresa",
    service: "Serviço",
    requester: "Cliente",
    createdAt: "2026-09-18T08:42:00.000Z",
    isDemo: true,
    partTraitIds: [],
    resourceIds: [],
    estimatedHours: 8,
    estimatedEquipmentHours: null,
    estimatedCost: null,
    proposedValue: null,
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
    quantity: 1,
    stages: [],
    serviceStatus: "DRAFT",
    lessonStatus: "DRAFT",
    assumptions: "",
    ...overrides,
  };
}

describe("record helpers", () => {
  it("detects scope mode from record kind", () => {
    expect(getRecordScopeMode(createRecord({ recordKind: "single" }))).toBe("single");
    expect(getRecordScopeMode(createRecord({ recordKind: "batch", quantity: 4 }))).toBe("batch");
  });

  it("routes planned hours to resources when selected", () => {
    expect(resolveQuoteHours(createRecord({ resourceIds: ["resource-1"], estimatedHours: 10 }))).toEqual({
      teamHours: 0,
      equipmentHours: 10,
    });
    expect(resolveQuoteHours(createRecord({ estimatedHours: 10 }))).toEqual({
      teamHours: 10,
      equipmentHours: 0,
    });
  });
});
