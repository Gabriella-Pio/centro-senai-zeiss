import type { CtaCopy, FeatureItem, SectionCopy, StatItem, TeamMember } from "@/copy/types";

export const institutionalHero = {
  eyebrow: "O centro",
  title: "O primeiro centro SENAI ZEISS do Brasil",
  subtitle: "Inaugurado em 2024 na Faculdade SENAI Ítalo Bologna.",
  body: "Somos a parceria da FIEG, do SENAI Goiás e da Carl Zeiss: metrologia industrial com serviço à indústria e formação no mesmo laboratório, em Goiânia.",
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
  eyebrow: "Nossa história",
  title: "Como chegamos a Goiânia",
  description: "Uma parceria inédita no país, na Faculdade SENAI Ítalo Bologna.",
};

export const historyFacts: StatItem[] = [
  { value: "1º", label: "Centro SENAI ZEISS do Brasil" },
  { value: "R$40M", label: "Investimento em máquinas, software e ambiente controlado" },
  { value: "25.11.2024", label: "Inauguração na Faculdade SENAI Ítalo Bologna" },
];

export const historyParagraphs = [
  "Em 25 de novembro de 2024, a FIEG inaugurou na Faculdade SENAI Ítalo Bologna o primeiro Centro de Excelência em Metrologia SENAI ZEISS do Brasil. A parceria com a Carl Zeiss — referência mundial em metrologia industrial — instalou o laboratório em Goiânia.",
  "O investimento de R$ 40 milhões reuniu CMM, medição óptica, sistemas multissensores, escaneamento 3D, raio-X e impressão 3D. O laboratório presta serviços de alta precisão às empresas e forma profissionais capazes de operar essas tecnologias.",
];

export const purposeHeading: SectionCopy = {
  eyebrow: "Missão, visão e valores",
  title: "Três referências, o mesmo rigor do laudo",
  description:
    "Missão, visão e valores — cada um no seu lugar, sem atalho de interpretação.",
};

export const purposeItems: FeatureItem[] = [
  {
    title: "Missão",
    value: "Apoiar a indústria com dados que se pode rastrear",
    description:
      "Medimos, inspecionamos e aplicamos engenharia — evidência para qualidade, manutenção e competitividade, no mesmo rigor que a formação do SENAI exige em sala.",
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
      "Compromisso com o desenvolvimento da indústria. Cada peça que entra no nosso fluxo leva identificação, método e relatório — sem atalho de ensaio.",
    icon: "Ruler",
  },
];

export const teamHeading: SectionCopy = {
  eyebrow: "Quem fez acontecer",
  title: "Quem pensou, viabilizou e inaugurou o centro",
  description:
    "A FIEG viabilizou o investimento, a Faculdade SENAI Ítalo Bologna abriga o complexo, a ZEISS traz a tecnologia.",
};

export const team: TeamMember[] = [
  {
    name: "Sandro Mabel",
    role: "Presidente da FIEG e dos Conselhos Regionais do SENAI e SESI",
    org: "FIEG",
    image: "/team/sandro-mabel.jpg",
    imageAlt: "Sandro Mabel, presidente da FIEG.",
    imagePosition: "50% 12%",
  },
  {
    name: "Dario Queija de Siqueira",
    role: "Diretor da Faculdade SENAI Ítalo Bologna",
    org: "SENAI Goiás",
    image: "/team/dario-siqueira.jpg",
    imageAlt: "Dario Queija de Siqueira, diretor da Faculdade SENAI Ítalo Bologna.",
    imagePosition: "50% 18%",
  },
  {
    name: "Claudemir Bonatto",
    role: "Diretor regional do SENAI",
    org: "SENAI Goiás",
    image: "/team/claudemir-bonatto.jpg",
    imageAlt: "Claudemir Bonatto, diretor regional do SENAI Goiás.",
  },
  {
    name: "Rolando Vargas Vallejos",
    role: "Gerente de Tecnologia e Inovação",
    org: "SENAI Goiás",
    image: "/team/rolando.jpg",
    imageAlt: "Rolando Vargas Vallejos, gerente de Tecnologia e Inovação do SENAI Goiás.",
    imagePosition: "50% 20%",
  },
  {
    name: "Paulo Vargas",
    role: "Diretor regional do SENAI e superintendente do SESI na inauguração",
    org: "SENAI / SESI",
    note: "In memoriam",
    image: "/team/paulo-vargas.jpg",
    imageAlt: "Paulo Vargas, diretor regional do SENAI e superintendente do SESI.",
    imagePosition: "50% 12%",
  },
  {
    name: "Alan Tonietti",
    role: "Diretor",
    org: "ZEISS",
    note: "Na inauguração",
    image: "/team/alan-tonietti.jpg",
    imageAlt: "Alan Tonietti, diretor da ZEISS, na inauguração do centro.",
    imagePosition: "50% 18%",
  },
  {
    name: "Jochen Weinisch",
    role: "Vice-presidente de Vendas",
    org: "ZEISS",
    image: "/team/jochen-weinisch.jpg",
    imageAlt: "Jochen Weinisch, vice-presidente de Vendas da ZEISS.",
    imagePosition: "50% 20%",
  },
];
