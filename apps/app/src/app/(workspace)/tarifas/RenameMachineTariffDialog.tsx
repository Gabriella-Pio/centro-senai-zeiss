"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { isLabelTaken } from "@/lib/machine-tariff-utils";
import type { MachineTariff } from "@/lib/machine-tariff";

export function RenameMachineTariffDialog({
  open,
  onOpenChange,
  tariff,
  machineTariffs,
  onRename,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tariff: MachineTariff;
  machineTariffs: MachineTariff[];
  onRename: (label: string) => void;
}) {
  const [label, setLabel] = useState(tariff.label);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLabel(tariff.label);
      setError(null);
    }
  }, [open, tariff.label]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = label.trim();
    if (trimmed.length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres.");
      return;
    }
    if (isLabelTaken(machineTariffs, trimmed, tariff.id)) {
      setError("Já existe um ativo ativo com esse nome.");
      return;
    }
    onRename(trimmed);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Renomear ativo</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            O nome também será atualizado no vocabulário de recursos.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          <div className="grid gap-2">
            <Label htmlFor="rename-machine-label">Nome do ativo</Label>
            <Input
              id="rename-machine-label"
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
            <Button type="submit" size="lg">Salvar nome</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
