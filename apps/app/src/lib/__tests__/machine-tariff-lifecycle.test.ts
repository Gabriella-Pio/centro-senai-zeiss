import { describe, expect, it } from "vitest";
import {
  addMachineTariff,
  archiveMachineTariff,
  deleteMachineTariff,
  restoreMachineTariff,
} from "@/lib/demo-store";
import { createSeedState } from "@/lib/demo-store-seed";
import { getResourceUsageCount } from "@/lib/machine-tariff-utils";

describe("machine tariff lifecycle", () => {
  it("archives and restores syncing vocabulary active state", () => {
    const base = createSeedState();
    const withNew = addMachineTariff(base, "Test Machine", { tariffId: "machine-test-1" });
    const tariff = withNew.machineTariffs.find((item) => item.id === "machine-test-1");
    expect(tariff).toBeTruthy();

    const archived = archiveMachineTariff(withNew, "machine-test-1");
    const archivedTariff = archived.machineTariffs.find((item) => item.id === "machine-test-1");
    const vocabTerm = archived.vocabulary.find((term) => term.id === tariff!.resourceId);

    expect(archivedTariff?.archivedAt).toBeTruthy();
    expect(vocabTerm?.active).toBe(false);

    const restored = restoreMachineTariff(archived, "machine-test-1");
    const restoredTerm = restored.vocabulary.find((term) => term.id === tariff!.resourceId);
    expect(restored.machineTariffs.find((item) => item.id === "machine-test-1")?.archivedAt).toBeNull();
    expect(restoredTerm?.active).toBe(true);
  });

  it("counts resource usage from records", () => {
    const state = createSeedState();
    const duramax = state.machineTariffs.find((item) => item.id === "machine-duramax");
    expect(duramax).toBeTruthy();

    const usage = getResourceUsageCount(state, duramax!.resourceId);
    expect(usage.total).toBeGreaterThan(0);
  });

  it("blocks delete when resource is used", () => {
    const state = createSeedState();
    const duramax = state.machineTariffs.find((item) => item.id === "machine-duramax");
    const before = state.machineTariffs.length;
    const next = deleteMachineTariff(state, duramax!.id);
    expect(next.machineTariffs.length).toBe(before);
  });

  it("allows delete for unused newly created asset", () => {
    const base = createSeedState();
    const withNew = addMachineTariff(base, "Temp Machine", { tariffId: "machine-temp" });
    const next = deleteMachineTariff(withNew, "machine-temp");
    expect(next.machineTariffs.some((item) => item.id === "machine-temp")).toBe(false);
    expect(next.vocabulary.some((term) => term.id === "vocab-temp")).toBe(false);
  });
});
