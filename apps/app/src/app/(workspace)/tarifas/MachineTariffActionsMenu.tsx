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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cem/ui";
import {
  archiveMachineTariff,
  deleteMachineTariff,
  duplicateMachineTariff,
  renameMachineTariff,
  restoreMachineTariff,
  updateDemoState,
} from "@/lib/demo/demo-store";
import { getMachineHourlyRate, type MachineTariff } from "@/lib/machine-tariff";
import {
  getResourceUsageCount,
  isMachineTariffActive,
} from "@/lib/machine-tariff-utils";
import { useDemoStore } from "@/lib/use-demo-store";
import { Archive, Copy, MoreHorizontal, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { DuplicateMachineTariffDialog } from "./DuplicateMachineTariffDialog";
import { RenameMachineTariffDialog } from "./RenameMachineTariffDialog";

export function MachineTariffActionsMenu({
  tariff,
  canEdit,
  onArchived,
  onDeleted,
  onDuplicated,
}: {
  tariff: MachineTariff;
  canEdit: boolean;
  onArchived?: () => void;
  onDeleted?: () => void;
  onDuplicated?: (tariffId: string) => void;
}) {
  const demoState = useDemoStore();
  const { machineTariffs } = demoState;
  const [renameOpen, setRenameOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!canEdit) return null;

  const isActive = isMachineTariffActive(tariff);
  const usage = getResourceUsageCount(demoState, tariff.resourceId);
  const canDelete = usage.total === 0;

  function handleArchive() {
    updateDemoState((state) => archiveMachineTariff(state, tariff.id));
    setArchiveOpen(false);
    onArchived?.();
  }

  function handleRestore() {
    updateDemoState((state) => restoreMachineTariff(state, tariff.id));
  }

  function handleDelete() {
    updateDemoState((state) => deleteMachineTariff(state, tariff.id));
    setDeleteOpen(false);
    onDeleted?.();
  }

  function handleRename(label: string) {
    updateDemoState((state) => renameMachineTariff(state, tariff.id, label));
  }

  function handleDuplicate(label: string) {
    const tariffId = `machine-${Date.now()}`;
    updateDemoState((state) => duplicateMachineTariff(state, tariff.id, label, tariffId));
    onDuplicated?.(tariffId);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="machine-tariff-hero__menu-btn"
              aria-label={`Ações para ${tariff.label}`}
            >
              <MoreHorizontal aria-hidden="true" />
              Ações
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setRenameOpen(true)} disabled={!isActive}>
            <Pencil aria-hidden="true" />
            Renomear
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDuplicateOpen(true)}>
            <Copy aria-hidden="true" />
            Duplicar planilha
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isActive ? (
            <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
              <Archive aria-hidden="true" />
              Arquivar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleRestore}>
              <RotateCcw aria-hidden="true" />
              Restaurar
            </DropdownMenuItem>
          )}
          {canDelete ? (
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 aria-hidden="true" />
              Excluir
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameMachineTariffDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        tariff={tariff}
        machineTariffs={machineTariffs}
        onRename={handleRename}
      />

      <DuplicateMachineTariffDialog
        open={duplicateOpen}
        onOpenChange={setDuplicateOpen}
        source={tariff}
        machineTariffs={machineTariffs}
        onDuplicate={handleDuplicate}
      />

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent className="gap-5 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Arquivar ativo?</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {tariff.label} deixará de aparecer em novos orçamentos. Registros antigos mantêm o snapshot da tarifa vigente.
              {usage.total > 0
                ? ` Este ativo aparece em ${usage.records} registro(s). Novos orçamentos não poderão selecioná-lo.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" size="lg" />}>
              Cancelar
            </DialogClose>
            <Button type="button" size="lg" onClick={handleArchive}>
              Arquivar ativo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="gap-5 p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Excluir ativo?</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Ação permanente. {tariff.label} e seu termo no vocabulário serão removidos. Tarifa atual: {getMachineHourlyRate(tariff)}/h (item 32).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" size="lg" />}>
              Cancelar
            </DialogClose>
            <Button type="button" variant="destructive" size="lg" onClick={handleDelete}>
              Excluir permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
