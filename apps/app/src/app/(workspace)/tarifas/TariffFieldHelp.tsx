"use client";

import { FieldHelp } from "@/components/FieldHelp";

export function TariffFieldHelp({
  label,
  hint,
  formula,
  fieldId,
}: {
  label: string;
  hint: string;
  formula?: string;
  fieldId?: string;
}) {
  const tooltipId = fieldId
    ? `tariff-field-help-${fieldId.replace(/^tariff-field-/, "")}`
    : undefined;

  return <FieldHelp label={label} hint={hint} formula={formula} id={tooltipId} />;
}
