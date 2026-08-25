"use client";

import { useState, type FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { services } from "@/data/home-content";

interface QuoteFormProps {
  defaultServiceId?: string;
}

export function QuoteForm({ defaultServiceId }: QuoteFormProps) {
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
        <h2 className="text-xl font-semibold text-foreground">Solicitação enviada</h2>
        <p className="text-muted-foreground max-w-sm">
          Recebemos sua solicitação. Nossa equipe entrará em contato em até 2
          dias úteis.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="company">Empresa</Label>
          <Input id="company" name="company" required placeholder="Nome da empresa" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contactName">Responsável</Label>
          <Input id="contactName" name="contactName" required placeholder="Seu nome" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required placeholder="voce@empresa.com" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="(00) 00000-0000" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="service">Serviço desejado</Label>
        <Select value={serviceId} onValueChange={setServiceId} name="service">
          <SelectTrigger id="service" className="w-full">
            <SelectValue placeholder="Selecione um serviço" />
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
        <Label htmlFor="description">Descrição da necessidade</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Descreva a peça, prazo e o que precisa ser medido/analisado"
          className="min-h-32"
        />
      </div>

      <Button type="submit" size="lg" className="self-start">
        Enviar solicitação
      </Button>
    </form>
  );
}
