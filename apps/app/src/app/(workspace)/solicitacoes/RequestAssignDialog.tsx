"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label } from "@cem/ui";
import { getAssignableUsers } from "@/lib/request-lifecycle";
import type { QuoteRequest } from "./types";

export function RequestAssignDialog({
  request,
  open,
  onOpenChange,
  onConfirm,
}: {
  request: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (request: QuoteRequest, userId: string, userName: string) => void;
}) {
  const assignableUsers = getAssignableUsers();
  const [userId, setUserId] = useState(assignableUsers[0]?.id ?? "");

  useEffect(() => {
    if (!open || !request) {
      return;
    }
    setUserId(request.assignedToUserId ?? assignableUsers[0]?.id ?? "");
  }, [assignableUsers, open, request]);

  const selectedUser = assignableUsers.find((user) => user.id === userId);
  const isReassign = request?.status === "ASSIGNED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isReassign ? "Reatribuir solicitação" : "Atribuir responsável"}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Escolha quem vai acompanhar {request?.requestNumber ?? "esta solicitação"} até a conversão em registro.
          </DialogDescription>
        </DialogHeader>
        <div className="request-assign-form">
          <Label htmlFor="request-assignee">Responsável</Label>
          <select
            id="request-assignee"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            className="request-assign-form__select"
          >
            {assignableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} · {user.role === "VALIDADOR" ? "Validador" : "Técnico"}
              </option>
            ))}
          </select>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={!request || !selectedUser}
              onClick={() => {
                if (!request || !selectedUser) return;
                onConfirm(request, selectedUser.id, selectedUser.name);
              }}
            >
              {isReassign ? "Confirmar reatribuição" : "Confirmar atribuição"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
