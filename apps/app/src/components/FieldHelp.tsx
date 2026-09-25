"use client";

import { CircleHelp } from "lucide-react";
import "./field-help.css";

export type FieldHelpContent = {
  hint: string;
  formula?: string;
};

export function FieldHelp({
  label,
  hint,
  formula,
  id,
}: {
  label: string;
  hint: string;
  formula?: string;
  id?: string;
}) {
  const tooltipId = id;

  return (
    <span className="field-help">
      <button
        type="button"
        className="field-help__btn"
        aria-label={`Ajuda: ${label}`}
        aria-describedby={tooltipId}
      >
        <CircleHelp aria-hidden="true" />
      </button>
      <span id={tooltipId} className="field-help__popover" role="tooltip">
        <p>{hint}</p>
        {formula ? <code>{formula}</code> : null}
      </span>
    </span>
  );
}
