"use client";

import { CircleHelp } from "lucide-react";

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
  const tooltipId = fieldId ? `tariff-field-help-${fieldId.replace(/^tariff-field-/, "")}` : undefined;

  return (
    <span className="tariff-field-help">
      <button
        type="button"
        className="tariff-field-help__btn"
        aria-label={`Ajuda: ${label}`}
        aria-describedby={tooltipId}
      >
        <CircleHelp aria-hidden="true" />
      </button>
      <span id={tooltipId} className="tariff-field-help__popover" role="tooltip">
        <p>{hint}</p>
        {formula ? <code>{formula}</code> : null}
      </span>
    </span>
  );
}
