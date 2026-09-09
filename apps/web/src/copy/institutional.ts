import type { CtaCopy, FeatureItem, SectionCopy, StatItem, TeamMember } from "@/copy/types";

export const institutionalHero = {
  eyebrow: "Institucional",
  title: "O primeiro centro SENAI ZEISS do Brasil",
  subtitle: "Inaugurado em 2024 na Faculdade SENAI Ítalo Bologna.",
  body: "Parceria entre a FIEG, o SENAI Goiás e a Carl Zeiss — metrologia industrial de referência, com serviço à indústria e formação no mesmo laboratório, em Goiânia.",
  primaryCta: { label: "Ver a história", href: "#historia" } satisfies CtaCopy,
  secondaryCta: { label: "Solicitar orçamento", href: "/quote" } satisfies CtaCopy,
  image: {
    src: "/lab/lab-int-3.jpeg",
    alt: "Sala de medição do Centro de Excelência em Metrologia SENAI ZEISS, com equipamentos ao fundo.",
    objectPosition: "50% 42%",
  },
  imageBlend: "feather" as const,
  place: "Goiânia · Faculdade SENAI Ítalo Bologna",
};

export const historyHeading: SectionCopy = {
  eyebrow: "História",
  title: "Como o centro chegou a Goiânia",
  description:
    "Uma parceria inédita no país, na primeira unidade SENAI da capital.",
};

export const historyFacts: StatItem[] = [
  { value: "25.11.2024", label: "Inauguração na Faculdade SENAI Ítalo Bologna" },
  { value: "R$40M", label: "Investimento em máquinas, software e ambiente controlado" },
  { value: "300+", label: "Empresas previstas em cinco anos, em Goiás e fora do Estado" },
];

export const historyParagraphs = [
  "Em 25 de novembro de 2024, a FIEG inaugurou na Faculdade SENAI Ítalo Bologna o primeiro Centro de Excelência em Metrologia SENAI ZEISS do Brasil. A parceria com a Carl Zeiss — referência mundial em metrologia industrial — montou um complexo com CMM, medição óptica, sistemas multissensores, escaneamento 3D e raio-X.",
  "O investimento de R$ 40 milhões destina o centro a dois papéis: prestar serviços de alta precisão às empresas e formar profissionais capazes de operar essas tecnologias. A expectativa institucional é atender mais de 300 empresas em cinco anos, apoiando qualidade de produto, manutenção e transformação tecnológica da indústria.",
];

export const purposeHeading: SectionCopy = {
  eyebrow: "Método",
  title: "Três referências, o mesmo rigor do laudo",
  description:
    "Missão, visão e valores identificados como no ensaio — cada um no seu datum, sem atalho de interpretação.",
};

export const purposeItems: FeatureItem[] = [
  {
    title: "Missão",
    value: "Apoiar a indústria com dados que se pode rastrear",
    description:
      "Medições, inspeções e engenharia aplicadas — evidência para qualidade, manutenção e competitividade, no mesmo rigor que a formação do SENAI exige em sala.",
    icon: "Target",
  },
  {
    title: "Visão",
    value: "Ser o laboratório que a indústria consulta e no qual a próxima geração aprende a medir",
    description:
      "Referência nacional em metrologia industrial, unindo tecnologia ZEISS e a rede de educação profissional do SENAI.",
    icon: "Scan",
  },
  {
    title: "Valores",
    value: "Rigor técnico, rastreabilidade e precisão",
    description:
      "Compromisso com o desenvolvimento da indústria. Cada peça que entra no fluxo leva identificação, método e relatório — sem atalho de ensaio.",
    icon: "Ruler",
  },
];

export const teamHeading: SectionCopy = {
  eyebrow: "Quem fez acontecer",
  title: "Quem pensou, viabilizou e inaugurou o centro",
  description:
    "A FIEG viabilizou o investimento, a Faculdade SENAI Ítalo Bologna abriga o complexo, a ZEISS traz a tecnologia. Retratos entram quando o material oficial chegar — até lá, o recorte é o mesmo dos equipamentos.",
};

export const team: TeamMember[] = [
  {
    name: "Sandro Mabel",
    role: "Presidente da FIEG e dos Conselhos Regionais do SENAI e SESI",
    org: "FIEG",
  },
  {
    name: "Dario Queija de Siqueira",
    role: "Diretor da Faculdade SENAI Ítalo Bologna",
    org: "SENAI Goiás",
  },
  {
    name: "Claudemir Bonatto",
    role: "Diretor regional do SENAI",
    org: "SENAI Goiás",
  },
  {
    name: "Paulo Vargas",
    role: "Diretor regional do SENAI e superintendente do SESI na inauguração",
    org: "SENAI / SESI",
    note: "In memoriam",
  },
  {
    name: "Alan Tonietti",
    role: "Diretor",
    org: "ZEISS",
    note: "Na inauguração",
  },
  {
    name: "Jochen Weinisch",
    role: "Vice-presidente de Vendas",
    org: "ZEISS",
  },
];
