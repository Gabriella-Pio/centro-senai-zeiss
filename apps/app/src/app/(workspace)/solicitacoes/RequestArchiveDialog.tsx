"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label } from "@cem/ui";
import type { QuoteRequest } from "./types";

export function RequestArchiveDialog({
  request,
  open,
  onOpenChange,
  onConfirm,
}: {
  request: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (request: QuoteRequest, reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Arquivar solicitação</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Registre por que {request?.requestNumber ?? "esta solicitação"} não seguirá para um Registro de Serviço.
          </DialogDescription>
        </DialogHeader>
        <div className="request-archive-form">
          <Label htmlFor="archive-reason">Justificativa</Label>
          <textarea
            id="archive-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Ex.: cliente mudou o escopo e encerrou o pedido."
            rows={4}
            autoFocus
          />
          <DialogFooter className="gap-3 sm:gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={reason.trim().length < 5 || !request}
              onClick={() => {
                if (!request) return;
                onConfirm(request, reason);
              }}
            >
              Confirmar arquivamento
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
