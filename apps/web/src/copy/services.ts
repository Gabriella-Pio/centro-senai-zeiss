import type { SectionCopy, ServiceContent } from "@/copy/types";

export const servicesHeading: SectionCopy = {
  eyebrow: "Serviços",
  title: "Serviços de metrologia industrial",
  description:
    "Escolha a linha técnica da sua demanda ou solicite um orçamento descrevendo a peça, o prazo e o que precisa ser medido ou inspecionado.",
};

export const serviceDetail = {
  eyebrow: "Serviço",
  applicationsLabel: "Aplicações",
  audienceLabel: "Público-alvo",
  ctaLabel: "Solicitar orçamento para este serviço",
};

export const servicesCatalog = {
  detailsLabel: "Ver detalhes",
  quoteLabel: "Solicitar orçamento",
};

export const services: ServiceContent[] = [
  {
    id: "metrologia-dimensional",
    label: "Metrologia dimensional",
    icon: "Ruler",
    shortDescription:
      "Medição por coordenadas com máquinas ZEISS para validar geometria, tolerâncias e conformidade de peças e ferramental.",
    description:
      "Medição dimensional de peças, conjuntos e ferramental em máquinas de coordenadas ZEISS, com comparação ao desenho ou ao modelo CAD e emissão de relatório técnico.",
    applications: [
      "Controle dimensional de peças usinadas",
      "Validação de ferramental e dispositivos",
      "Inspeção de recebimento e de produto acabado",
      "Avaliação de conformidade em séries e protótipos",
      "Análise de desvio em relação ao modelo nominal",
    ],
    audience:
      "Indústrias automotiva, aeroespacial, metalmecânica e fabricantes de bens de capital que precisam comprovar geometria e tolerâncias.",
  },
  {
    id: "engenharia-reversa",
    label: "Engenharia reversa",
    icon: "Scan",
    shortDescription:
      "Reconstrução de modelos CAD a partir da peça física, para reposição, documentação técnica e comparação com o projeto nominal.",
    description:
      "Digitalização da peça física e reconstrução do modelo CAD para reposição, documentação ou correção de ferramenta — inclusive quando o desenho original não existe mais.",
    applications: [
      "Recuperação de peças sem documentação técnica",
      "Reconstrução de superfícies e volumes para fabricação",
      "Comparação entre peça real e projeto nominal",
      "Geração de dados para usinagem e manufatura aditiva",
      "Documentação técnica de componentes legados",
    ],
    audience:
      "Manutenção industrial, ferramentaria, desenvolvimento de produto e empresas que dependem de peças de reposição fora de linha.",
  },
  {
    id: "digitalizacao-3d",
    label: "Digitalização 3D",
    icon: "Aperture",
    shortDescription:
      "Escaneamento óptico de alta densidade para nuvem de pontos, malha 3D e análise de superfície.",
    description:
      "Escaneamento óptico de alta resolução para gerar nuvem de pontos e malha 3D, com densidade suficiente para controle de superfície e análise dimensional.",
    applications: [
      "Documentação da geometria real da peça",
      "Controle de qualidade de superfícies complexas",
      "Comparação peça–CAD (nominal vs. real)",
      "Apoio a prototipagem e desenvolvimento",
      "Base de dados para engenharia reversa",
    ],
    audience:
      "Engenharia de produto, qualidade, design industrial e times que precisam do as-built da peça.",
  },
  {
    id: "tomografia-industrial",
    label: "Tomografia industrial",
    icon: "Layers",
    shortDescription:
      "Inspeção por raios X sem destruição da peça, para geometrias internas, porosidade, fissuras e montagens ocultas.",
    description:
      "Inspeção não destrutiva por raios X para ver o interior do componente — poros, trincas, inclusões e montagens — sem cortar nem desmontar a peça.",
    applications: [
      "Análise de porosidade e descontinuidades internas",
      "Detecção de fissuras invisíveis na superfície",
      "Inspeção de montagens e geometrias internas",
      "Validação de componentes após manutenção",
      "Controle de qualidade em peças fundidas, injetadas ou soldadas",
    ],
    audience:
      "Fundição, automotivo, aeroespacial, polímeros e qualquer operação em que a integridade interna seja crítica.",
  },
];
