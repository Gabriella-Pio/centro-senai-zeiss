import type { RecordBlock } from "@/lib/record-lifecycle";

const RECORD_BLOCKS = new Set<RecordBlock>(["A", "B", "C"]);

export function getRecordDetailPath(recordId: string, block?: RecordBlock) {
  const base = `/registros/${recordId}`;
  if (!block) {
    return base;
  }
  return `${base}?bloco=${block}`;
}

export function getRecordListHref(recordId: string) {
  return `/registros?registro=${recordId}`;
}

export function getRequestHref(requestId: string) {
  return `/solicitacoes?solicitacao=${requestId}`;
}

export function getValidationHref(recordId?: string) {
  if (!recordId) {
    return "/validacao";
  }
  return `/validacao?registro=${recordId}`;
}

export function parseRecordBlockParam(value: string | null): RecordBlock | null {
  if (!value || !RECORD_BLOCKS.has(value as RecordBlock)) {
    return null;
  }
  return value as RecordBlock;
}

export function setRecordBlockParam(params: URLSearchParams, block: RecordBlock | null) {
  if (block) {
    params.set("bloco", block);
    return;
  }
  params.delete("bloco");
}
