"use client";

import { useState, type FormEvent } from "react";
import {
  Label,
  Input,
  Textarea,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cem/ui";
import type { QuoteFormCopy } from "@/copy/quote";

interface QuoteFormProps {
  defaultServiceId?: string;
  services: { id: string; label: string }[];
  copy: QuoteFormCopy;
}

export function QuoteForm({ defaultServiceId, services, copy }: QuoteFormProps) {
  const [serviceId, setServiceId] = useState(defaultServiceId ?? "");
  const [submitted, setSubmitted] = useState(false);

  // TODO: integrar com o endpoint real (ex: POST /api/v1/budget) quando o
  // backend estiver disponível. Por ora, apenas simula o envio no client.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h2 className="type-band-title font-heading font-semibold text-foreground">{copy.success.title}</h2>
        <p className="type-caption max-w-sm text-muted-foreground">{copy.success.body}</p>
      </div>
    );
  }

  const { fields } = copy;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">{fields.company.label}</Label>
          <Input id="company" name="company" required placeholder={fields.company.placeholder} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactName">{fields.contactName.label}</Label>
          <Input
            id="contactName"
            name="contactName"
            required
            placeholder={fields.contactName.placeholder}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{fields.email.label}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder={fields.email.placeholder}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">{fields.phone.label}</Label>
          <Input id="phone" name="phone" type="tel" required placeholder={fields.phone.placeholder} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="service">{fields.service.label}</Label>
        <Select
          value={serviceId}
          onValueChange={(value) => {
            if (value) setServiceId(value);
          }}
          name="service"
        >
          <SelectTrigger id="service" className="w-full">
            <SelectValue placeholder={fields.service.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">{fields.description.label}</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder={fields.description.placeholder}
          className="min-h-32"
        />
      </div>

      <Button type="submit" size="lg" className="self-start">
        {copy.submit}
      </Button>
    </form>
  );
}
