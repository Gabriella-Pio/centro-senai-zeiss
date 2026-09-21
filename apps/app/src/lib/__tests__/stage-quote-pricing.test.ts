import { describe, expect, it } from "vitest";
import type { ServiceStage } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import { DEFAULT_LAB_SETTINGS } from "@/lib/demo-store-types";
import { computeStageQuoteCost } from "@/lib/pricing";

const vocabulary: VocabularyTerm[] = [
  {
    id: "vocab-10",
    label: "ATOS Q 8M",
    class: "RESOURCE",
    guidance: "",
    active: true,
    updatedAt: "2026-09-01T00:00:00.000Z",
    hourlyRate: 200,
  },
  {
    id: "vocab-19",
    label: "ZEISS ZRE",
    class: "RESOURCE",
    guidance: "",
    active: true,
    updatedAt: "2026-09-01T00:00:00.000Z",
    hourlyRate: 150,
  },
];

describe("stage quote pricing", () => {
  it("sums hours per stage without extra margin", () => {
    const stages: ServiceStage[] = [
      {
        id: "stage-1",
        serviceTypeId: "vocab-2",
        label: "Digitalização 3D",
        resourceId: "vocab-10",
        resourceIds: ["vocab-10"],
        estimatedHours: 8,
        actualHours: null,
      },
      {
        id: "stage-2",
        serviceTypeId: "vocab-9",
        label: "Engenharia reversa",
        resourceId: "vocab-19",
        resourceIds: ["vocab-19"],
        estimatedHours: 4,
        actualHours: null,
      },
    ];

    const breakdown = computeStageQuoteCost({
      vocabulary,
      stages,
      labSettings: DEFAULT_LAB_SETTINGS,
    });

    expect(breakdown.suggestedPrice).toBe(8 * 200 + 4 * 150);
    expect(breakdown.marginPercent).toBe(0);
    expect(breakdown.tariffAsPrice).toBe(true);
    expect(breakdown.lines).toHaveLength(2);
  });
});
