import type { SectionCopy, ServiceContent } from "@/copy/types";

export const servicesHeading: SectionCopy = {
  eyebrow: "Nossos serviços",
  title: "O que fazemos no laboratório",
  description:
    "Do controle dimensional à consultoria em qualidade. Em cada linha combinamos as máquinas do parque, método e a nossa equipe à peça e ao relatório.",
};

export const serviceDetail = {
  eyebrow: "Serviço",
  backLabel: "Todos os nossos serviços",
  applicationsLabel: "Aplicações",
  audienceLabel: "Para quem",
  equipmentLabel: "Equipamentos que usamos",
  ctaLabel: "Solicitar orçamento para este serviço",
};

export const servicesCatalog = {
  detailsLabel: "Ver detalhes",
  quoteLabel: "Solicitar orçamento",
  allServicesCta: { label: "Ver todos os serviços", href: "/services" },
};

/** Convenção de fotos de card: public/lab/services/{slug}.jpeg — substitua ao adicionar fotos definitivas. */
export const services: ServiceContent[] = [
  {
    id: "controle-qualidade-dimensional",
    label: "Controle de qualidade dimensional",
    icon: "Ruler",
    cardImage: "/lab/services/duramax.jpeg",
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
    cardImage: "/lab/services/atosq.jpeg",
    cardImageAlt: "Peça física e modelo CAD na tela durante reconstrução digital.",
    cardImagePosition: "50% 42%",
    shortDescription:
      "Escaneamento ATOS Q no laboratório ou T-SCAN in loco, com reconstrução CAD, malha 3D e comparação ao nominal.",
    description:
      "Digitalizamos em alta densidade para documentar a geometria real, gerar nuvem de pontos e malha 3D, reconstruir modelos CAD e apoiar engenharia reversa — no laboratório ou no seu chão de fábrica.",
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
    label: "Tomografia industrial para inspeções internas não destrutivas",
    icon: "Layers",
    cardImage: "/lab/services/bosello-front.jpeg",
    cardImageAlt: "Sistema ZEISS BOSELLO MAX para tomografia e raio-X industrial.",
    cardImagePosition: "50% 40%",
    shortDescription:
      "Tomografia e raio-X industrial sem destruir a peça — porosidade, trincas, inclusões e geometrias internas.",
    description:
      "Inspecionamos o interior de componentes por raios X e tomografia, sem destruir a peça — descontinuidades, montagens fechadas e integridade estrutural — e entregamos laudo técnico.",
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
    label: "Digitalização de peças e impressão 3D",
    icon: "Printer",
    cardImage: "/lab/services/cad.jpeg",
    cardImageAlt: "Peça em validação dimensional após prototipagem.",
    shortDescription:
      "Impressão 3D de protótipos a partir de modelos CAD ou malhas digitalizadas aqui, para testes funcionais e geométricos.",
    description:
      "Fabricamos protótipos por adição a partir de CAD ou de digitalizações feitas aqui — para validar forma, encaixe e conceito antes da produção em série.",
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
    cardImage: "/lab/services/consultorias.jpeg",
    cardImageAlt: "Equipe técnica do centro em operação de medição.",
    cardImagePosition: "50% 40%",
    shortDescription:
      "Apoio gerencial e técnico: planos de manutenção metrológica, conformidade com normas ISO e estruturação de processos de qualidade.",
    description:
      "Nossa equipe gerencial e técnica apoia a estruturar e melhorar processos de qualidade — da definição de planos de manutenção de equipamentos à conformidade com normas e auditorias. Oferecemos treinamentos técnicos nas áreas de manutenção, metrologia, engenharia reversa, lubrificação e análise de falhas.",
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
