import type { SectionCopy, ServiceContent } from "@/copy/types";

export const servicesHeading: SectionCopy = {
  eyebrow: "Serviços",
  title: "Serviços de metrologia industrial",
  description:
    "Do controle dimensional ao apoio em conformidade — cada linha combina equipamentos ZEISS, metodologia e equipe técnica conforme a sua demanda.",
};

export const serviceDetail = {
  eyebrow: "Serviço",
  applicationsLabel: "Aplicações",
  audienceLabel: "Público-alvo",
  equipmentLabel: "Equipamentos relacionados",
  ctaLabel: "Solicitar orçamento para este serviço",
};

export const servicesCatalog = {
  detailsLabel: "Ver detalhes",
  quoteLabel: "Solicitar orçamento",
  allServicesCta: { label: "Ver todos os serviços", href: "/services" },
};

export const services: ServiceContent[] = [
  {
    id: "controle-qualidade-dimensional",
    label: "Controle de qualidade dimensional",
    icon: "Ruler",
    cardImage: "/lab/ponteiras.jpeg",
    cardImageAlt:
      "Ponteiras e sensores ZEISS em máquina de coordenadas para medição dimensional.",
    shortDescription:
      "Validação de geometria e tolerâncias por apalpação (CMM) e medição óptica — PRISMO, DuraMax e O-Inspect, isolados ou combinados.",
    description:
      "Ensaios dimensionais para comprovar conformidade de peças, ferramental e dispositivos. Combinamos medição por contato em máquinas de coordenadas e medição óptica por imagem, conforme a geometria, o toleramento e o relatório exigido.",
    applications: [
      "Controle dimensional de peças usinadas e estampadas",
      "Validação de ferramental e dispositivos de fixação",
      "Inspeção de recebimento e de produto acabado",
      "Comparação peça–CAD e análise de desvio nominal",
      "Avaliação de conformidade em séries e protótipos",
    ],
    audience:
      "Indústrias automotiva, aeroespacial, metalmecânica e fabricantes que precisam de laudos dimensionais rastreáveis.",
  },
  {
    id: "digitalizacao-engenharia-reversa",
    label: "Digitalização e engenharia reversa",
    icon: "Scan",
    cardImage: "/lab/relatorio.jpeg",
    cardImageAlt: "Peça física e modelo CAD na tela durante reconstrução digital.",
    cardImagePosition: "50% 42%",
    shortDescription:
      "Escaneamento ATOS Q no laboratório ou T-SCAN in loco, com reconstrução CAD, malha 3D e comparação ao nominal.",
    description:
      "Digitalização de alta densidade para documentar a geometria real, gerar nuvem de pontos e malha 3D, reconstruir modelos CAD e apoiar engenharia reversa — no centro ou no seu chão de fábrica.",
    applications: [
      "Documentação as-built e controle de superfícies complexas",
      "Engenharia reversa de peças sem desenho",
      "Comparação peça–CAD e análise de desvio",
      "Base de dados para usinagem e manufatura aditiva",
      "Recuperação de componentes legados e ferramental",
    ],
    audience:
      "Engenharia de produto, ferramentaria, manutenção industrial e times de desenvolvimento.",
  },
  {
    id: "inspecao-interna",
    label: "Inspeção interna (NDT)",
    icon: "Layers",
    cardImage: "/equipment/bosello-max.png",
    cardImageAlt: "Sistema ZEISS BOSELLO MAX para tomografia e raio-X industrial.",
    cardImageFit: "contain",
    shortDescription:
      "Tomografia e raio-X industrial sem destruir a peça — porosidade, trincas, inclusões e geometrias internas.",
    description:
      "Inspeção não destrutiva por raios X e tomografia computadorizada para avaliar o interior de componentes — descontinuidades, montagens fechadas e integridade estrutural — com laudo técnico.",
    applications: [
      "Análise de porosidade e vides em fundidos e moldados",
      "Detecção de trincas e inclusões internas",
      "Inspeção de montagens e geometrias ocultas",
      "Validação pós-manutenção de peças críticas",
      "Controle de qualidade em polímeros e composites",
    ],
    audience:
      "Fundição, automotivo, aeroespacial, polímeros e operações em que a integridade interna é crítica.",
  },
  {
    id: "prototipacao-3d",
    label: "Prototipação 3D",
    icon: "Printer",
    cardImage: "/lab/cmm.jpeg",
    cardImageAlt: "Peça em validação dimensional após prototipagem.",
    shortDescription:
      "Impressão 3D de protótipos a partir de modelos CAD ou malhas digitalizadas no centro, para testes funcionais e geométricos.",
    description:
      "Fabricação aditiva de protótipos a partir de dados CAD ou de digitalizações realizadas no laboratório — para validar forma, encaixe e conceito antes da produção em série.",
    applications: [
      "Protótipos funcionais e geométricos para desenvolvimento",
      "Peças de reposição e ferramental simplificado",
      "Validação de encaixe e montagem",
      "Iteração rápida entre digitalização, CAD e peça física",
    ],
    audience:
      "Desenvolvimento de produto, ferramentaria e P&D que precisam materializar modelos digitais com rapidez.",
  },
  {
    id: "consultoria-qualidade",
    label: "Consultoria em qualidade",
    icon: "ClipboardCheck",
    cardImage: "/lab/tecnico.jpeg",
    cardImageAlt: "Equipe técnica do centro em operação de medição.",
    cardImagePosition: "50% 40%",
    shortDescription:
      "Apoio gerencial e técnico: planos de manutenção metrológica, conformidade com normas ISO e estruturação de processos de qualidade.",
    description:
      "Consultoria da equipe gerencial e técnica do centro para estruturar e melhorar processos de qualidade — da definição de planos de manutenção de equipamentos à conformidade com normas e auditorias.",
    applications: [
      "Diagnóstico e estruturação de processos de metrologia",
      "Apoio à conformidade com normas ISO de qualidade",
      "Planos de manutenção e calibração de equipamentos",
      "Treinamento e alinhamento de equipes internas",
      "Definição de fluxos de inspeção e rastreabilidade",
    ],
    audience:
      "Indústrias de todos os portes que buscam maturidade em qualidade, com o respaldo SENAI e metodologia ZEISS.",
  },
];
