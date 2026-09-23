import type { ReactNode } from "react";
import { Label } from "@cem/ui";

export function RecordFieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      {required ? (
        <span className="records-form__required" aria-hidden="true"> *</span>
      ) : null}
    </Label>
  );
}

export function RecordFieldError({ error, id }: { error?: string; id?: string }) {
  if (!error) {
    return null;
  }
  return (
    <p id={id} className="records-form__field-error" role="alert">
      {error}
    </p>
  );
}
