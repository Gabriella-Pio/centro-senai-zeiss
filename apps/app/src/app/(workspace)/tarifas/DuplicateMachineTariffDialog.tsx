"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { computeMachineCost, type MachineTariff } from "@/lib/machine-tariff";
import { isLabelTaken } from "@/lib/machine-tariff-utils";
import { formatCurrency } from "@/lib/pricing";

export function DuplicateMachineTariffDialog({
  open,
  onOpenChange,
  source,
  machineTariffs,
  onDuplicate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: MachineTariff;
  machineTariffs: MachineTariff[];
  onDuplicate: (label: string) => void;
}) {
  const suggested = `Cópia de ${source.label}`;
  const [label, setLabel] = useState(suggested);
  const [error, setError] = useState<string | null>(null);

  const previewRate = useMemo(
    () => formatCurrency(computeMachineCost(source.inputs).costWithAdministrative),
    [source.inputs],
  );

  useEffect(() => {
    if (open) {
      setLabel(suggested);
      setError(null);
    }
  }, [open, suggested]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = label.trim();
    if (trimmed.length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres.");
      return;
    }
    if (isLabelTaken(machineTariffs, trimmed)) {
      setError("Já existe um ativo ativo com esse nome.");
      return;
    }
    onDuplicate(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Duplicar planilha</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Cria um novo ativo com os mesmos dados básicos de {source.label} (~{previewRate}/h no item 32).
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="duplicate-machine-label">Nome do novo ativo</Label>
            <Input
              id="duplicate-machine-label"
              value={label}
              onChange={(event) => {
                setLabel(event.target.value);
                setError(null);
              }}
              className="h-12 text-base"
              autoFocus
            />
          </div>
          {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" size="lg" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" size="lg">Duplicar ativo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
