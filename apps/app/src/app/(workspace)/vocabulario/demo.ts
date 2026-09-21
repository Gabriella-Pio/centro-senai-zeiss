import type { VocabularyTerm } from "./types";

export const DEMO_VOCABULARY_KEY = "cem_demo_vocabulary";

export const DEMO_VOCABULARY: VocabularyTerm[] = [
  {
    id: "vocab-1",
    label: "Metrologia avançada ZEISS e inspeção dimensional",
    class: "SERVICE_TYPE",
    guidance: "Verificação de dimensões, tolerâncias e conformidade geométrica com equipamentos ZEISS.",
    active: true,
    updatedAt: "2026-09-15T09:00:00.000Z",
  },
  {
    id: "vocab-2",
    label: "Escaneamento 3D, digitalização de peças e impressão 3D",
    class: "SERVICE_TYPE",
    guidance: "Captura da geometria, modelagem e fabricação aditiva para análise ou engenharia reversa.",
    active: true,
    updatedAt: "2026-09-14T09:00:00.000Z",
  },
  {
    id: "vocab-3",
    label: "Superfície livre",
    class: "PART_TRAIT",
    guidance: "Região sem uma definição geométrica simples, comum em peças moldadas.",
    active: true,
    updatedAt: "2026-09-12T09:00:00.000Z",
  },
  {
    id: "vocab-4",
    label: "Tolerância apertada",
    class: "PART_TRAIT",
    guidance: "Característica que exige controle dimensional mais rigoroso.",
    active: true,
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "vocab-5",
    label: "Máquina de medição por coordenadas",
    class: "RESOURCE",
    guidance: "Recurso indicado para medições dimensionais com alta precisão.",
    active: true,
    updatedAt: "2026-09-08T09:00:00.000Z",
  },
  {
    id: "vocab-6",
    label: "Acesso incompleto à região",
    class: "DEVIATION_CAUSE",
    guidance: "Registrar quando a geometria não pode ser medida por falta de acesso.",
    active: false,
    updatedAt: "2026-09-06T09:00:00.000Z",
  },
];
