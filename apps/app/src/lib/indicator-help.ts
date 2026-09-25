import type { FieldHelpContent } from "@/components/FieldHelp";

export const HOME_KPI_HELP = {
  assertiveness: {
    hint: "Percentual de casos formalizados em que as horas realizadas ficaram dentro de ±15% das estimadas.",
    formula: "|realizado − estimado| ÷ estimado ≤ 15%",
  },
  averageMargin: {
    hint: "Média da margem realizada nos casos formalizados, comparada com a meta configurada do laboratório.",
    formula: "margem = (preço − custo) ÷ preço × 100",
  },
  formalized: {
    hint: "Total de registros concluídos com lição validada — a mesma base que alimenta o Assistente.",
  },
  pending: {
    hint: "Resumo do que aguarda ação conforme seu perfil: solicitações, lições em validação ou rascunhos.",
  },
} satisfies Record<string, FieldHelpContent>;

export const INDICATORS_KPI_HELP = {
  formalized: {
    hint: "Total de casos formalizados na base demo — concluídos com lição validada no bloco C.",
  },
  assertiveness: {
    hint: "Percentual de casos formalizados em que as horas realizadas ficaram dentro de ±15% das estimadas.",
    formula: "|realizado − estimado| ÷ estimado ≤ 15%",
  },
  averageDeviation: {
    hint: "Diferença média entre horas realizadas e estimadas, em percentual. Valores positivos indicam tendência a subestimar.",
    formula: "média de (realizado − estimado) ÷ estimado × 100",
  },
  averageMargin: {
    hint: "Média da margem realizada nos casos formalizados, usando custo e valor cobrado ou proposto.",
    formula: "margem = (preço − custo) ÷ preço × 100",
  },
  belowTarget: {
    hint: "Quantidade de serviços cuja margem realizada ficou abaixo da meta configurada em Parâmetros de orçamento.",
  },
} satisfies Record<string, FieldHelpContent>;

export const CHART_HELP = {
  effortTrend: {
    hint: "Média mensal de horas estimadas e realizadas nos últimos 6 meses de casos formalizados.",
  },
  scatter: {
    hint: "Cada ponto é um caso formalizado. Pontos na diagonal y = x indicam estimativa perfeita; fora dela, desvio de esforço.",
    formula: "tolerância de assertividade: ±15%",
  },
  marginDonut: {
    hint: "Distribuição dos casos formalizados por faixa de margem realizada em relação à meta do laboratório.",
    formula: "verde ≥ meta · amarelo ≥ meta − 10 pp · vermelho < meta − 10 pp",
  },
  confidenceDonut: {
    hint: "Quantos tipos de serviço têm histórico robusto no Assistente, pela contagem de casos formalizados por tipo.",
    formula: "alta ≥ 15 casos · média ≥ 5 · baixa < 5",
  },
  pareto: {
    hint: "Causas de desvio mais frequentes registradas no bloco C — onde o laboratório mais erra na estimativa.",
  },
} satisfies Record<string, FieldHelpContent>;
