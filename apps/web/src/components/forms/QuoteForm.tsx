"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { Label, Input, Textarea, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@cem/ui";
import { apiRequest, ApiError } from "@/lib/api";
import type { QuoteFormCopy } from "@/copy/quote";
import { Link } from "@/i18n/navigation";
import "./quote-form.css";

const FIELD_IDS = [
  "company",
  "cnpj",
  "contactName",
  "email",
  "phone",
  "service",
  "otherDetail",
  "description",
] as const;

type FieldId = (typeof FIELD_IDS)[number];
type QuoteValues = {
  company: string;
  cnpj: string;
  contactName: string;
  email: string;
  phone: string;
  otherDetail: string;
  description: string;
};
type QuoteErrors = Partial<Record<FieldId, string>>;

interface QuoteFormProps {
  defaultServiceId?: string;
  services: { id: string; label: string }[];
  copy: QuoteFormCopy;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_VALUES: QuoteValues = {
  company: "",
  cnpj: "",
  contactName: "",
  email: "",
  phone: "",
  otherDetail: "",
  description: "",
};

function isValidBrPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return true;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) return true;
  return false;
}

function formatBrPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCnpj(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function cnpjCheckDigit(digits: number[], weights: number[]) {
  const sum = digits.reduce((total, digit, index) => total + digit * weights[index], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

function isValidCnpj(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const numbers = digits.split("").map(Number);
  const first = cnpjCheckDigit(numbers.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = cnpjCheckDigit(numbers.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return first === numbers[12] && second === numbers[13];
}

function validateQuote(
  values: QuoteValues,
  serviceIds: string[],
  copy: QuoteFormCopy,
): QuoteErrors {
  const required = copy.validation.required;
  const errors: QuoteErrors = {};

  if (!values.company.trim()) errors.company = required;
  if (!values.cnpj.trim()) errors.cnpj = required;
  else if (!isValidCnpj(values.cnpj)) errors.cnpj = copy.validation.cnpj;
  if (!values.contactName.trim()) errors.contactName = required;

  if (!values.email.trim()) errors.email = required;
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = copy.validation.email;

  if (!values.phone.trim()) errors.phone = required;
  else if (!isValidBrPhone(values.phone)) errors.phone = copy.validation.phone;

  if (serviceIds.length === 0) errors.service = copy.validation.service;

  if (serviceIds.includes(copy.otherService.id) && !values.otherDetail.trim()) {
    errors.otherDetail = required;
  }

  if (!values.description.trim()) errors.description = required;

  return errors;
}

function toLeadPayload(
  values: QuoteValues,
  serviceIds: string[],
  serviceOptions: { id: string; label: string }[],
) {
  const labels = serviceIds.map(
    (id) => serviceOptions.find((item) => item.id === id)?.label ?? id,
  );
  const lines = [`CNPJ: ${values.cnpj.trim()}`, `Serviços: ${labels.join(", ")}`];

  if (values.otherDetail.trim()) {
    lines.push(`Outro serviço: ${values.otherDetail.trim()}`);
  }
  lines.push(values.description.trim());

  return {
    name: values.contactName.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    phone: values.phone.trim(),
    service: serviceIds.join(",").slice(0, 120),
    message: lines.join("\n"),
  };
}

export function QuoteForm({ defaultServiceId, services, copy }: QuoteFormProps) {
  const serviceOptions = [...services, copy.otherService];
  const initialServiceIds = serviceOptions.some((item) => item.id === defaultServiceId)
    ? [defaultServiceId!]
    : [];
  const alertRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<QuoteValues>(EMPTY_VALUES);
  const [serviceIds, setServiceIds] = useState<string[]>(initialServiceIds);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const otherSelected = serviceIds.includes(copy.otherService.id);

  function applyValidation(nextValues: QuoteValues, nextServiceIds: string[]) {
    if (attempted) {
      setErrors(validateQuote(nextValues, nextServiceIds, copy));
    }
  }

  function setField<K extends keyof QuoteValues>(id: K, value: QuoteValues[K]) {
    const nextValues = { ...values, [id]: value };
    setValues(nextValues);
    applyValidation(nextValues, serviceIds);
  }

  function toggleService(id: string) {
    const nextServiceIds = serviceIds.includes(id)
      ? serviceIds.filter((item) => item !== id)
      : [...serviceIds, id];
    const nextValues =
      id === copy.otherService.id && !nextServiceIds.includes(id)
        ? { ...values, otherDetail: "" }
        : values;
    setServiceIds(nextServiceIds);
    if (nextValues !== values) setValues(nextValues);
    applyValidation(nextValues, nextServiceIds);
  }

  function resetForm() {
    setSubmitted(false);
    setAttempted(false);
    setPending(false);
    setSubmitError("");
    setValues(EMPTY_VALUES);
    setServiceIds([]);
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    setSubmitError("");
    const nextErrors = validateQuote(values, serviceIds, copy);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstId = FIELD_IDS.find((id) => nextErrors[id]);
      requestAnimationFrame(() => {
        const field = firstId ? document.getElementById(firstId) : null;
        field?.scrollIntoView({ behavior: "smooth", block: "center" });
        field?.focus({ preventScroll: true });
        if (!field) alertRef.current?.focus();
      });
      return;
    }

    setPending(true);
    try {
      await apiRequest("leads", {
        method: "POST",
        body: toLeadPayload(values, serviceIds, serviceOptions),
      });
      setValues(EMPTY_VALUES);
      setServiceIds([]);
      setAttempted(false);
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : copy.validation.submit);
      requestAnimationFrame(() => alertRef.current?.focus());
    } finally {
      setPending(false);
    }
  }

  const { fields } = copy;

  return (
    <>
    <form onSubmit={handleSubmit} className="quote-form" noValidate>
      <p className="quote-form__legend">
        <span className="quote-form__required" aria-hidden="true">
          *
        </span>{" "}
        {copy.requiredLegend}
      </p>

      <div className="quote-form__grid">
        <QuoteField id="company" label={fields.company.label} error={errors.company}>
          <Input
            id="company"
            name="company"
            value={values.company}
            onChange={(event) => setField("company", event.target.value)}
            placeholder={fields.company.placeholder}
            autoComplete="organization"
            aria-required="true"
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "company-error" : undefined}
          />
        </QuoteField>
        <QuoteField id="cnpj" label={fields.cnpj.label} error={errors.cnpj}>
          <Input
            id="cnpj"
            name="cnpj"
            inputMode="numeric"
            value={values.cnpj}
            onChange={(event) => setField("cnpj", formatCnpj(event.target.value))}
            placeholder={fields.cnpj.placeholder}
            autoComplete="off"
            aria-required="true"
            aria-invalid={Boolean(errors.cnpj)}
            aria-describedby={errors.cnpj ? "cnpj-error" : undefined}
          />
        </QuoteField>
        <QuoteField
          id="contactName"
          label={fields.contactName.label}
          error={errors.contactName}
          className="quote-form__field--span"
        >
          <Input
            id="contactName"
            name="contactName"
            value={values.contactName}
            onChange={(event) => setField("contactName", event.target.value)}
            placeholder={fields.contactName.placeholder}
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(errors.contactName)}
            aria-describedby={errors.contactName ? "contactName-error" : undefined}
          />
        </QuoteField>
        <QuoteField id="email" label={fields.email.label} error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            placeholder={fields.email.placeholder}
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </QuoteField>
        <QuoteField id="phone" label={fields.phone.label} error={errors.phone}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => setField("phone", formatBrPhone(event.target.value))}
            placeholder={fields.phone.placeholder}
            autoComplete="tel"
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
        </QuoteField>
      </div>

      <fieldset className="quote-form__field quote-form__services">
        <legend className="quote-form__label">
          {fields.service.label}
          <span className="quote-form__required" aria-hidden="true">
            *
          </span>
        </legend>
        <div
          className="quote-form__chips"
          role="group"
          aria-describedby={errors.service ? "service-error" : undefined}
          aria-invalid={Boolean(errors.service) || undefined}
        >
          {serviceOptions.map((service, index) => {
            const selected = serviceIds.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                id={index === 0 ? "service" : undefined}
                className={selected ? "quote-form__chip quote-form__chip--on" : "quote-form__chip"}
                role="checkbox"
                aria-checked={selected}
                onClick={() => toggleService(service.id)}
              >
                <span className="quote-form__check" aria-hidden>
                  {selected ? <Check strokeWidth={2.75} /> : null}
                </span>
                {service.label}
              </button>
            );
          })}
        </div>
        {errors.service ? (
          <p id="service-error" className="quote-form__error">
            {errors.service}
          </p>
        ) : null}
      </fieldset>

      {otherSelected ? (
        <QuoteField id="otherDetail" label={fields.otherDetail.label} error={errors.otherDetail}>
          <Input
            id="otherDetail"
            name="otherDetail"
            value={values.otherDetail}
            onChange={(event) => setField("otherDetail", event.target.value)}
            placeholder={fields.otherDetail.placeholder}
            aria-required="true"
            aria-invalid={Boolean(errors.otherDetail)}
            aria-describedby={errors.otherDetail ? "otherDetail-error" : undefined}
          />
        </QuoteField>
      ) : null}

      <QuoteField id="description" label={fields.description.label} error={errors.description}>
        <Textarea
          id="description"
          name="description"
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          placeholder={fields.description.placeholder}
          aria-required="true"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
      </QuoteField>

      <div className="quote-form__actions">
        {submitError ? (
          <div ref={alertRef} className="quote-form__alert" role="alert" tabIndex={-1}>
            <p className="quote-form__alert-title">{submitError}</p>
          </div>
        ) : attempted && Object.keys(errors).length > 0 ? (
          <div ref={alertRef} className="quote-form__alert" role="alert" tabIndex={-1}>
            <p className="quote-form__alert-title">{copy.validation.incomplete}</p>
          </div>
        ) : null}
        <Button
          type="submit"
          size="xl"
          className="quote-form__submit"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? copy.submitPending : copy.submit}
        </Button>
      </div>

      <p className="quote-form__privacy">
        {copy.privacy.before}
        <Link href={copy.privacy.href}>{copy.privacy.link}</Link>{copy.privacy.after}
      </p>
    </form>
    <Dialog open={submitted} onOpenChange={(open) => { if (!open) resetForm(); }}>
      <DialogContent className="quote-form__dialog" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="quote-form__success-title">{copy.success.title}</DialogTitle>
          <DialogDescription className="quote-form__success-body">
            {copy.success.body}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" size="xl" className="quote-form__dialog-close" onClick={resetForm}>
            {copy.success.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

function QuoteField({
  id,
  label,
  error,
  required = true,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={["quote-form__field", className].filter(Boolean).join(" ")}>
      <Label htmlFor={id} className="quote-form__label">
        {label}
        {required ? (
          <span className="quote-form__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="quote-form__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
