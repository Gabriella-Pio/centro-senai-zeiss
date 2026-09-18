import type { ServiceRecord } from "@/app/(workspace)/registros/types";
import type { VocabularyTerm } from "@/app/(workspace)/vocabulario/types";
import type { LabSettings } from "./demo-store-types";
import { computeRealizedMargin } from "./pricing";

const TOLERANCE = 0.15;

export type IndicatorSummary = {
  totalFormalized: number;
  assertivenessRate: number;
  averageEffortDeviation: number;
  averageMarginPercent: number;
  belowTargetMarginCount: number;
  targetMarginPercent: number;
  topCauses: { label: string; count: number }[];
};

export function computeIndicators(
  records: ServiceRecord[],
  vocabulary: VocabularyTerm[],
  labSettings: LabSettings,
): IndicatorSummary {
  const formalized = records.filter(
    (record) => record.isDemo && record.lessonStatus === "FORMALIZED" && record.serviceStatus === "COMPLETED",
  );

  const withHours = formalized.filter(
    (record) => record.estimatedHours !== null && record.actualHours !== null && record.estimatedHours > 0,
  );

  const withinTolerance = withHours.filter((record) => {
    const deviation = Math.abs(record.actualHours! - record.estimatedHours!) / record.estimatedHours!;
    return deviation <= TOLERANCE;
  });

  const averageEffortDeviation =
    withHours.length === 0
      ? 0
      : withHours.reduce((sum, record) => {
          const deviation = (record.actualHours! - record.estimatedHours!) / record.estimatedHours!;
          return sum + deviation;
        }, 0) / withHours.length;

  const causeCounts = new Map<string, number>();
  formalized.forEach((record) => {
    if (!record.deviationCauseId) {
      return;
    }
    causeCounts.set(record.deviationCauseId, (causeCounts.get(record.deviationCauseId) ?? 0) + 1);
  });

  const topCauses = [...causeCounts.entries()]
    .map(([id, count]) => ({
      label: vocabulary.find((term) => term.id === id)?.label ?? id,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const withMargin = formalized
    .map((record) => computeRealizedMargin(record))
    .filter((margin): margin is number => margin !== null);

  const averageMarginPercent =
    withMargin.length === 0
      ? 0
      : Math.round(withMargin.reduce((sum, margin) => sum + margin, 0) / withMargin.length);

  const belowTargetMarginCount = withMargin.filter(
    (margin) => margin < labSettings.targetMarginPercent,
  ).length;

  return {
    totalFormalized: formalized.length,
    assertivenessRate: withHours.length === 0 ? 0 : Math.round((withinTolerance.length / withHours.length) * 100),
    averageEffortDeviation: Math.round(averageEffortDeviation * 100),
    averageMarginPercent,
    belowTargetMarginCount,
    targetMarginPercent: labSettings.targetMarginPercent,
    topCauses,
  };
}
