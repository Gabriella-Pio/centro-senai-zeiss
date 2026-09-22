import type { RecordBlock } from "@/lib/record-lifecycle";

export const RECORD_BLOCK_COPY: Record<RecordBlock, { title: string; description: string }> = {
  A: {
    title: "Orçamento",
    description: "Classifique o serviço, estime esforço e congele o orçamento antes da execução.",
  },
  B: {
    title: "Execução",
    description: "Registre horas, custos reais, faturamento e data de entrega do serviço.",
  },
  C: {
    title: "Lição aprendida",
    description: "Documente desvios e aprendizados. O contexto do serviço é montado automaticamente.",
  },
};
