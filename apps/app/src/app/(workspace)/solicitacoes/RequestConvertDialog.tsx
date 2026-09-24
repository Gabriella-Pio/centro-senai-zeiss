"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label } from "@cem/ui";
import type { QuoteRequest } from "./types";

type ServiceTypeOption = {
  id: string;
  label: string;
};

export function RequestConvertDialog({
  request,
  open,
  onOpenChange,
  serviceTypes,
  onConfirm,
}: {
  request: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceTypes: ServiceTypeOption[];
  onConfirm: (request: QuoteRequest, serviceTypeId: string) => void;
}) {
  const [serviceTypeId, setServiceTypeId] = useState(serviceTypes[0]?.id ?? "");

  useEffect(() => {
    if (!open || !request) {
      return;
    }
    setServiceTypeId(serviceTypes[0]?.id ?? "");
  }, [open, request, serviceTypes]);

  const selectedType = serviceTypes.find((item) => item.id === serviceTypeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Criar registro de serviço</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Escolha o tipo de serviço interno antes de converter{" "}
            {request?.requestNumber ?? "esta solicitação"} em registro.
          </DialogDescription>
        </DialogHeader>
        <div className="request-assign-form">
          <Label htmlFor="request-service-type">Tipo de serviço (vocabulário)</Label>
          <select
            id="request-service-type"
            value={serviceTypeId}
            onChange={(event) => setServiceTypeId(event.target.value)}
            className="request-assign-form__select"
          >
            {serviceTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          {request ? (
            <p className="text-sm text-muted-foreground">
              Solicitação do site: <strong>{request.service}</strong>
            </p>
          ) : null}
          <DialogFooter className="gap-3 sm:gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={!request || !selectedType}
              onClick={() => {
                if (!request || !selectedType) return;
                onConfirm(request, selectedType.id);
              }}
            >
              Confirmar conversão
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
