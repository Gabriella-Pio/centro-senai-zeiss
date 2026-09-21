import { ClipboardList, FilterX, Plus } from "lucide-react";
import { Button } from "@cem/ui";
import { WorkspaceEmptyState } from "@/components/WorkspaceEmptyState";
import type { ServiceRecord } from "./types";
import { RecordsTable } from "./RecordsTable";

export function RecordsList({
  records,
  filtering,
  canCreate,
  onClearFilters,
  onCreate,
}: {
  records: ServiceRecord[];
  filtering: boolean;
  canCreate: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
}) {
  if (records.length === 0) {
    return filtering ? (
      <WorkspaceEmptyState
        icon={FilterX}
        title="Nenhum registro encontrado"
        description="Ajuste a pesquisa ou limpe os filtros para ver todos os registros."
        action={<Button type="button" variant="outline" size="lg" onClick={onClearFilters}>Limpar filtros</Button>}
      />
    ) : (
      <WorkspaceEmptyState
        icon={ClipboardList}
        title="Nenhum registro cadastrado"
        description="Crie um registro de serviço para começar o orçamento e o acompanhamento do trabalho."
        action={
          canCreate ? (
            <Button type="button" variant="outline" size="lg" onClick={onCreate}>
              <Plus aria-hidden="true" />
              Novo registro
            </Button>
          ) : undefined
        }
      />
    );
  }

  return <RecordsTable records={records} />;
}
