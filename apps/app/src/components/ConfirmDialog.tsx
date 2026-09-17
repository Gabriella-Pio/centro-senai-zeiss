"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@cem/ui";

type ConfirmDialogProps = {
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  pendingLabel?: string;
  tone?: "default" | "danger";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  pendingLabel = "Aguarde…",
  tone = "default",
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);

  function setOpen(next: boolean) {
    if (pending && !next) {
      return;
    }
    onOpenChange(next);
  }

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-5 p-6 sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-base text-muted-foreground">{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" size="lg" disabled={pending} />}>
            {cancelLabel}
          </DialogClose>
          <Button
            type="button"
            variant={tone === "danger" ? "destructive" : "default"}
            size="lg"
            disabled={pending}
            onClick={() => void handleConfirm()}
          >
            {pending ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
