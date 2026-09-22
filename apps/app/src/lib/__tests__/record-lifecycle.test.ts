import { describe, expect, it } from "vitest";
import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import {
  canAccessBlock,
  getRecordDetailNotices,
  getSuggestedBlock,
  isBlockDone,
} from "@/lib/record-lifecycle";

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
    resourceIds: ["resource-1"],
    estimatedHours: 8,
    estimatedCost: 1000,
    proposedValue: 1500,
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
    serviceTypeId: "service-type-1",
    ...overrides,
  };
}

describe("record lifecycle", () => {
  it("tracks block completion for hourly package mode", () => {
    const packageRecord = createRecord({
      quoteMode: "hourly_package",
      hoursPackageRef: "Pacote anual 120 h",
      estimatedHours: 120,
      proposedValue: 16200,
      stages: [],
      estimatedCost: null,
    });
    expect(isBlockDone(packageRecord, "A")).toBe(true);
  });

  it("tracks block completion", () => {
    const draft = createRecord();
    expect(isBlockDone(draft, "A")).toBe(true);
    expect(isBlockDone(draft, "B")).toBe(false);

    const quoted = createRecord({
      serviceStatus: "QUOTED",
      actualHours: 7,
      billedValue: 1400,
    });
    expect(isBlockDone(quoted, "B")).toBe(true);
  });

  it("locks blocks until prerequisites are met", () => {
    const draft = createRecord();
    expect(canAccessBlock(draft, "A")).toBe(true);
    expect(canAccessBlock(draft, "B")).toBe(false);
    expect(canAccessBlock(draft, "C")).toBe(false);

    const quoted = createRecord({
      serviceStatus: "QUOTED",
      actualHours: 6,
      billedValue: 1200,
    });
    expect(canAccessBlock(quoted, "B")).toBe(true);
    expect(canAccessBlock(quoted, "C")).toBe(true);
  });

  it("suggests the next actionable block", () => {
    expect(getSuggestedBlock(createRecord())).toBe("A");
    expect(getSuggestedBlock(createRecord({ serviceStatus: "QUOTED" }))).toBe("B");
    expect(
      getSuggestedBlock(
        createRecord({
          serviceStatus: "QUOTED",
          actualHours: 6,
          billedValue: 1200,
        }),
      ),
    ).toBe("C");
  });

  it("builds contextual notices", () => {
    const notices = getRecordDetailNotices(
      createRecord({
        requestId: "request-1",
        requestNumber: "SO-2026-0001",
        serviceStatus: "COMPLETED",
        lessonStatus: "PENDING",
      }),
    );

    const originNotice = notices.find((notice) => notice.id === "origin-request");
    const lessonNotice = notices.find((notice) => notice.id === "lesson-pending");

    expect(originNotice?.href).toBe("/solicitacoes?solicitacao=request-1");
    expect(lessonNotice?.href).toBe("/validacao?registro=record-test");
  });
});
