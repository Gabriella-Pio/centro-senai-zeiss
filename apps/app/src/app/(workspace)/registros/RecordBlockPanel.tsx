import type { CSSProperties, ReactNode } from "react";
import type { RecordBlock } from "@/lib/record-lifecycle";

const BLOCK_ACCENTS: Record<RecordBlock, string> = {
  A: "var(--record-block-a-accent)",
  B: "var(--record-block-b-accent)",
  C: "var(--record-block-c-accent)",
};

export function RecordBlockPanel({
  block,
  title,
  description,
  children,
}: {
  block: RecordBlock;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`record-detail-page__workspace record-detail-page__workspace--block-${block.toLowerCase()}`}
      style={{ "--record-block-accent": BLOCK_ACCENTS[block] } as CSSProperties}
    >
      <div className="record-detail-page__workspace-header">
        <span className="record-detail-page__workspace-badge" aria-hidden="true">{block}</span>
        <div className="record-detail-page__workspace-copy">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="record-detail-page__workspace-body">{children}</div>
    </div>
  );
}
