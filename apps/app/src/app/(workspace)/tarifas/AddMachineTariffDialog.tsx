"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@cem/ui";
import { addMachineTariff, updateDemoState } from "@/lib/demo-store";
import { computeMachineCost } from "@/lib/machine-tariff";
import { DEFAULT_MACHINE_INPUTS } from "@/lib/machine-tariff-seed";
import { formatCurrency } from "@/lib/pricing";

export function AddMachineTariffDialog({
  open,
  onOpenChange,
  existingLabels,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingLabels: string[];
  onCreated: (tariffId: string) => void;
}) {
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setLabel("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = label.trim();
    if (trimmed.length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres.");
      return;
    }
    const duplicate = existingLabels.some(
      (existing) => existing.toLocaleLowerCase("pt-BR") === trimmed.toLocaleLowerCase("pt-BR"),
    );
    if (duplicate) {
      setError("Já existe uma máquina com esse nome.");
      return;
    }

    const stamp = Date.now();
    const tariffId = `machine-${stamp}`;
    updateDemoState((state) => addMachineTariff(state, trimmed));
    onCreated(tariffId);
    handleOpenChange(false);
  }

  const previewRate = formatCurrency(
    computeMachineCost(DEFAULT_MACHINE_INPUTS).costWithAdministrative,
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-5 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Novo ativo</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Cria a planilha com valores padrão do laboratório (~{previewRate}/h no item 32).
            Ajuste os dados básicos depois de cadastrar.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="machine-tariff-label">Nome do ativo</Label>
            <Input
              id="machine-tariff-label"
              value={label}
              onChange={(event) => {
                setLabel(event.target.value);
                setError(null);
              }}
              placeholder="Ex.: CMM CONTURA 7"
              className="h-12 text-base"
              autoFocus
            />
          </div>
          {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" size="lg" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" size="lg">Cadastrar ativo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
