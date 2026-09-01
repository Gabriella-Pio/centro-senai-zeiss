import type { FeatureItem, SectionCopy, StatItem } from "@/copy/types";

export const institutionalHeading: SectionCopy = {
  eyebrow: "Institucional",
  title: "Sobre o Centro de Excelência SENAI ZEISS",
  description:
    "Parceria entre o SENAI Goiás e a Carl Zeiss para levar metrologia industrial de referência à indústria brasileira — com serviços técnicos e formação de profissionais no mesmo ambiente.",
};

export const pillarsHeading: SectionCopy = {
  eyebrow: "Pilares",
  title: "Missão, visão e valores",
};

export const pillars: FeatureItem[] = [
  {
    title: "Missão",
    description:
      "Apoiar a indústria com medições, inspeções e engenharia aplicadas, gerando dados confiáveis para qualidade, manutenção e competitividade.",
  },
  {
    title: "Visão",
    description:
      "Ser referência nacional em metrologia industrial, unindo tecnologia ZEISS e a rede de educação profissional do SENAI.",
  },
  {
    title: "Valores",
    description:
      "Rigor técnico, rastreabilidade, precisão e compromisso com o desenvolvimento da indústria.",
  },
];

export const institutionalStats: StatItem[] = [
  { value: "0,9 µm", label: "Precisão de medição por coordenadas" },
  { value: "1º no Brasil", label: "Centro SENAI ZEISS" },
  { value: "8", label: "Equipamentos ZEISS instalados" },
];

export const infrastructureHeading: SectionCopy = {
  eyebrow: "Infraestrutura",
  title: "Ambiente preparado para medições de alta precisão",
  description:
    "Salas climatizadas, áreas de digitalização e fluxo rastreado de recebimento — condições controladas para reduzir incerteza e garantir rastreabilidade das peças.",
};

export const infrastructure: FeatureItem[] = [
  {
    title: "Sala climatizada de metrologia",
    description:
      "Controle de temperatura e umidade para medições dimensionais com incerteza reduzida.",
    icon: "Thermometer",
  },
  {
    title: "Laboratório de digitalização 3D",
    description: "Área dedicada a escaneamento óptico, reconstrução digital e comparação peça–CAD.",
    icon: "Scan",
  },
  {
    title: "Inspeção dimensional",
    description:
      "Bancadas e volume de medição para peças de diferentes portes, materiais e geometrias.",
    icon: "Ruler",
  },
  {
    title: "Recebimento e logística",
    description: "Fluxo de identificação, guarda e devolução das peças enviadas para ensaio.",
    icon: "PackageCheck",
  },
];

export const history = {
  title: "O primeiro centro SENAI ZEISS do Brasil",
  paragraphs: [
    "Em 25 de novembro de 2024, a FIEG inaugurou na Faculdade SENAI Ítalo Bologna, em Goiânia, o primeiro Centro de Excelência em Metrologia SENAI ZEISS do Brasil. A parceria com a multinacional alemã Carl Zeiss, referência mundial em metrologia industrial, estruturou um complexo com máquinas ópticas, eletrônicas, de precisão e raio-X, além de sistemas multissensores, microscopia industrial e escaneamento 3D.",
    "O investimento de R$ 40 milhões destina o centro a dois papéis: prestar serviços de alta precisão às empresas e formar profissionais capazes de operar essas tecnologias. A expectativa institucional é atender mais de 300 empresas em cinco anos, em Goiás e em outros estados, apoiando a transformação tecnológica e a melhoria da qualidade dos produtos.",
  ],
};
