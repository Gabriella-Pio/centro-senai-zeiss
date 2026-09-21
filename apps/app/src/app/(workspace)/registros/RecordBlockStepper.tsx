import { CheckCircle2, Circle, Lock } from "lucide-react";
import type { RecordBlock } from "@/lib/record-lifecycle";
import { canAccessBlock, isBlockDone } from "@/lib/record-lifecycle";
import type { ServiceRecord } from "./types";

const BLOCK_LABELS: Record<RecordBlock, { title: string; subtitle: string }> = {
  A: { title: "Orçado", subtitle: "Estimativa e proposta" },
  B: { title: "Realizado", subtitle: "Execução e faturamento" },
  C: { title: "Aprendizado", subtitle: "Lição e validação" },
};

export function RecordBlockStepper({
  record,
  activeTab,
  onSelect,
  onBlockedSelect,
}: {
  record: ServiceRecord;
  activeTab: RecordBlock;
  onSelect: (block: RecordBlock) => void;
  onBlockedSelect: (block: RecordBlock) => void;
}) {
  const blocks: RecordBlock[] = ["A", "B", "C"];
  const activeIndex = blocks.indexOf(activeTab);

  return (
    <nav className="record-stepper" aria-label="Blocos do registro">
      <div className="record-stepper__track" aria-hidden="true">
        <span
          className="record-stepper__progress"
          style={{ width: `${(activeIndex / (blocks.length - 1)) * 100}%` }}
        />
      </div>

      {blocks.map((tab, index) => {
        const done = isBlockDone(record, tab);
        const accessible = canAccessBlock(record, tab);
        const active = activeTab === tab;
        const Icon = !accessible ? Lock : done ? CheckCircle2 : Circle;

        return (
          <button
            key={tab}
            type="button"
            className={`record-stepper__step${active ? " record-stepper__step--active" : ""}${done ? " record-stepper__step--done" : ""}${!accessible ? " record-stepper__step--locked" : ""}`}
            aria-current={active ? "step" : undefined}
            aria-disabled={!accessible}
            onClick={() => {
              if (!accessible) {
                onBlockedSelect(tab);
                return;
              }
              onSelect(tab);
            }}
          >
            <span className="record-stepper__badge">{tab}</span>
            <span className="record-stepper__content">
              <span className="record-stepper__status">
                <Icon aria-hidden="true" />
                <strong>{BLOCK_LABELS[tab].title}</strong>
              </span>
              <small>{BLOCK_LABELS[tab].subtitle}</small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
