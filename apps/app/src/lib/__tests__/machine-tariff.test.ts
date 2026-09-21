import { describe, expect, it } from "vitest";
import {
  buildFleetAverageComposition,
  buildFleetCapacityRows,
} from "@/lib/fleet-chart-data";
import { computeBreakevenHours } from "@/lib/chart-data-utils";
import { computeMachineCost } from "@/lib/machine-tariff";
import { DEFAULT_MACHINE_INPUTS } from "@/lib/machine-tariff-seed";
import { createMachineTariff } from "@/lib/machine-tariff";
import { hasValidationErrors, validateMachineInputs } from "@/lib/machine-tariff-validation";

describe("computeMachineCost", () => {
  it("calculates fixed, variable and item 32 rates from default inputs", () => {
    const result = computeMachineCost(DEFAULT_MACHINE_INPUTS);

    expect(result.fixedCostHourly).toBeGreaterThan(0);
    expect(result.variableWithSalary).toBeGreaterThan(result.variableWithoutSalary);
    expect(result.costWithLabor).toBeGreaterThan(result.costWithoutLabor);
    expect(result.costWithAdministrative).toBeGreaterThan(result.costWithLabor);
  });

  it("increases item 32 when administrative overhead rises", () => {
    const baseline = computeMachineCost(DEFAULT_MACHINE_INPUTS);
    const stressed = computeMachineCost({
      ...DEFAULT_MACHINE_INPUTS,
      administrativeOverheadPercent: DEFAULT_MACHINE_INPUTS.administrativeOverheadPercent + 10,
    });

    expect(stressed.costWithAdministrative).toBeGreaterThan(baseline.costWithAdministrative);
    expect(stressed.costWithLabor).toBe(baseline.costWithLabor);
  });
});

describe("computeBreakevenHours", () => {
  it("returns needed and available monthly hours", () => {
    const computed = computeMachineCost(DEFAULT_MACHINE_INPUTS);
    const breakeven = computeBreakevenHours(computed, DEFAULT_MACHINE_INPUTS);

    expect(breakeven.neededHours).toBeGreaterThan(0);
    expect(breakeven.availableHours).toBe(DEFAULT_MACHINE_INPUTS.usefulHoursPerYear / 12);
  });
});

describe("buildFleetCapacityRows", () => {
  it("sorts assets by required breakeven hours descending", () => {
    const tariffs = [
      createMachineTariff({
        id: "machine-a",
        resourceId: "vocab-a",
        label: "Ativo A",
        inputs: { ...DEFAULT_MACHINE_INPUTS, adoptedReplacementCost: 300000 },
      }),
      createMachineTariff({
        id: "machine-b",
        resourceId: "vocab-b",
        label: "Ativo B",
        inputs: { ...DEFAULT_MACHINE_INPUTS, adoptedReplacementCost: 900000 },
      }),
    ];

    const rows = buildFleetCapacityRows(tariffs);

    expect(rows).toHaveLength(2);
    expect(rows[0].neededHours).toBeGreaterThanOrEqual(rows[1].neededHours);
    expect(rows.every((row) => row.availableHours > 0)).toBe(true);
  });
});

describe("validateMachineInputs", () => {
  it("flags invalid useful hours and machine count", () => {
    const errors = validateMachineInputs({
      ...DEFAULT_MACHINE_INPUTS,
      usefulHoursPerYear: 0,
      machineCount: 0,
    });
    expect(hasValidationErrors(errors)).toBe(true);
    expect(errors.usefulHoursPerYear).toBeTruthy();
    expect(errors.machineCount).toBeTruthy();
  });
});

describe("buildFleetAverageComposition", () => {
  it("returns average composition segments for the fleet", () => {
    const tariffs = [
      createMachineTariff({
        id: "machine-a",
        resourceId: "vocab-a",
        label: "Ativo A",
        inputs: DEFAULT_MACHINE_INPUTS,
      }),
      createMachineTariff({
        id: "machine-b",
        resourceId: "vocab-b",
        label: "Ativo B",
        inputs: {
          ...DEFAULT_MACHINE_INPUTS,
          administrativeOverheadPercent: DEFAULT_MACHINE_INPUTS.administrativeOverheadPercent + 5,
        },
      }),
    ];

    const slices = buildFleetAverageComposition(tariffs);

    expect(slices.length).toBeGreaterThan(0);
    expect(slices.reduce((sum, slice) => sum + slice.value, 0)).toBeGreaterThan(0);
  });
});
