import { FilterX, Inbox, Plus } from "lucide-react";
import { Button } from "@cem/ui";
import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";
import type { QuoteRequest } from "./types";
import { RequestsTable } from "./RequestsTable";

export function RequestsList({
  requests,
  filtering,
  onView,
  onClearFilters,
  onSimulate,
}: {
  requests: QuoteRequest[];
  filtering: boolean;
  onView: (request: QuoteRequest) => void;
  onClearFilters: () => void;
  onSimulate: () => void;
}) {
  if (requests.length === 0) {
    return filtering ? (
      <WorkspaceEmptyState
        icon={FilterX}
        title="Nenhuma solicitação encontrada"
        description="Ajuste a pesquisa ou limpe os filtros para ver a fila completa."
        action={<Button type="button" variant="outline" size="lg" onClick={onClearFilters}>Limpar filtros</Button>}
      />
    ) : (
      <WorkspaceEmptyState
        icon={Inbox}
        title="Nenhuma solicitação na fila"
        description="Simule um pedido vindo do site para começar o fluxo comercial."
        action={
          <Button type="button" variant="outline" size="lg" onClick={onSimulate}>
            <Plus aria-hidden="true" />
            Simular pedido do site
          </Button>
        }
      />
    );
  }

  return <RequestsTable requests={requests} onView={onView} />;
}
