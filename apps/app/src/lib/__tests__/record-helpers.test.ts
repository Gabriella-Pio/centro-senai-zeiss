import { describe, expect, it } from "vitest";
import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import {
  deriveRelatedTopicIds,
  formatEffort,
  getRecordScopeMode,
  resolveBilledValue,
  resolveQuoteHours,
} from "@/lib/record-helpers";

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

  it("formats batch effort as per-piece and total", () => {
    expect(
      formatEffort(
        createRecord({
          recordKind: "batch",
          quantity: 16,
          estimatedHours: 5,
        }),
      ),
    ).toBe("5 h/peça · 80 h total (16 peças)");
  });

  it("derives related topics from stages and traits", () => {
    expect(
      deriveRelatedTopicIds(
        createRecord({
          serviceTypeId: "vocab-1",
          partTraitIds: ["vocab-3"],
          stages: [
            {
              id: "stage-1",
              serviceTypeId: "vocab-2",
              label: "Inspeção",
              resourceIds: [],
              estimatedHours: 4,
              actualHours: null,
            },
          ],
        }),
      ),
    ).toEqual(["vocab-3", "vocab-1", "vocab-2"]);
  });

  it("falls back billed value to proposed value", () => {
    expect(resolveBilledValue(createRecord({ proposedValue: 1200 }))).toBe(1200);
    expect(resolveBilledValue(createRecord({ proposedValue: 1200, billedValue: 900 }))).toBe(900);
  });
});
