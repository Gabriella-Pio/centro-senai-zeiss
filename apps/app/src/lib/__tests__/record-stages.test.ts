import { describe, expect, it } from "vitest";
import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import {
  addServiceStage,
  buildRecordPatchFromStages,
  createServiceStage,
  getRecordStages,
  sumStageEstimatedHours,
} from "@/lib/record-stages";

const serviceTypes: VocabularyTerm[] = [
  {
    id: "vocab-1",
    label: "Inspeção dimensional",
    class: "SERVICE_TYPE",
    guidance: "",
    active: true,
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "vocab-2",
    label: "Digitalização 3D",
    class: "SERVICE_TYPE",
    guidance: "",
    active: true,
    updatedAt: "2026-09-01T00:00:00.000Z",
  },
];

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
    estimatedEquipmentHours: null,
    estimatedCost: null,
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
    serviceTypeId: "vocab-1",
    ...overrides,
  };
}

describe("record stages", () => {
  it("creates legacy stage from service type", () => {
    const stages = getRecordStages(createRecord(), serviceTypes);
    expect(stages).toHaveLength(1);
    expect(stages[0]?.serviceTypeId).toBe("vocab-1");
  });

  it("adds stages and builds composite service label", () => {
    const record = createRecord({ serviceTypeId: undefined, stages: [] });
    const first = addServiceStage(record, serviceTypes, serviceTypes[0]);
    const withSecond = addServiceStage(
      { ...record, ...first, stages: first.stages ?? [] },
      serviceTypes,
      serviceTypes[1],
    );

    expect(withSecond.stages).toHaveLength(2);
    expect(withSecond.service).toBe("Inspeção dimensional + Digitalização 3D");
    expect(withSecond.recordKind).toBe("composite");
  });

  it("sums stage hours into estimated total", () => {
    const stages = [
      createServiceStage(serviceTypes[0]),
      createServiceStage(serviceTypes[1]),
    ];
    stages[0].estimatedHours = 6;
    stages[1].estimatedHours = 4;

    expect(sumStageEstimatedHours(stages)).toBe(10);
    expect(buildRecordPatchFromStages(createRecord(), stages).estimatedHours).toBe(10);
  });

  it("derives record resource ids from stage resources", () => {
    const stages = [
      {
        ...createServiceStage(serviceTypes[0]),
        resourceId: "resource-a",
        resourceIds: ["resource-a"],
        estimatedHours: 3,
      },
      {
        ...createServiceStage(serviceTypes[1]),
        resourceId: "resource-b",
        resourceIds: ["resource-b"],
        estimatedHours: 2,
      },
    ];

    expect(buildRecordPatchFromStages(createRecord(), stages).resourceIds).toEqual([
      "resource-a",
      "resource-b",
    ]);
  });
});
