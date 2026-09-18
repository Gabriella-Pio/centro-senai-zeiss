"use client";

import { CircleHelp } from "lucide-react";

export function TariffFieldHelp({
  hint,
  formula,
}: {
  hint: string;
  formula?: string;
}) {
  return (
    <span className="tariff-field-help">
      <button
        type="button"
        className="tariff-field-help__btn"
        aria-label="O que significa este valor?"
      >
        <CircleHelp aria-hidden="true" />
      </button>
      <span className="tariff-field-help__popover" role="tooltip">
        <p>{hint}</p>
        {formula ? <code>{formula}</code> : null}
      </span>
    </span>
  );
}
