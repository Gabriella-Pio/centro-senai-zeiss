import type { FeatureItem, SectionCopy, StatItem } from "@/copy/types";

export const hero = {
  eyebrow: "Centro de Excelência em Metrologia · Faculdade SENAI Ítalo Bologna",
  brand: { left: "SENAI", right: "ZEISS" },
  subtitle: "O primeiro centro de excelência em metrologia SENAI ZEISS do Brasil.",
  body: "Metrologia dimensional, engenharia reversa, digitalização 3D e tomografia industrial com tecnologia ZEISS. Validamos componentes, avaliamos conformidade e entregamos dados que a indústria usa para decidir.",
  primaryCta: { label: "Solicitar orçamento", href: "/quote" },
  secondaryCta: { label: "Conhecer o centro", href: "/institutional" },
};

export const labIntro = {
  eyebrow: "Sobre o centro",
  title: "Precisão alemã a serviço da indústria brasileira",
  body: "Instalado na Faculdade SENAI Ítalo Bologna, em Goiânia, o Centro de Excelência em Metrologia SENAI ZEISS reúne equipamentos ZEISS de última geração e equipe técnica especializada. Atendemos indústrias de Goiás e de outros estados na validação dimensional, análise de falhas, reconstrução CAD e inspeção não destrutiva — com o mesmo rigor exigido em qualidade, manutenção e desenvolvimento de produto.",
  image: {
    src: "/lab/centro.jpg",
    alt: "Vista do laboratório do Centro de Excelência em Metrologia SENAI ZEISS, com a sala de medição ao fundo.",
  },
  cta: { label: "Conhecer o centro", href: "/institutional" },
  stats: [
    { value: "0,9 µm", label: "Precisão de medição por coordenadas" },
    { value: "1º no Brasil", label: "Centro SENAI ZEISS" },
    { value: "8", label: "Equipamentos ZEISS instalados" },
  ] satisfies StatItem[],
};

export const serviceHubHeading: SectionCopy = {
  eyebrow: "Serviços",
  title: "O que medimos e o que entregamos",
  description:
    "Quatro linhas técnicas para controle de qualidade, engenharia e inspeção industrial. Cada serviço tem página própria, com aplicações e indicação de público.",
};

export const differentialsHeading: SectionCopy = {
  eyebrow: "Diferenciais",
  title: "Por que a indústria recorre ao centro",
  description:
    "Cada demanda segue um fluxo técnico — do recebimento da peça à entrega do relatório — com metodologia ZEISS e rastreabilidade das medições.",
};

export const differentials: FeatureItem[] = [
  {
    title: "Precisão dimensional",
    description:
      "Medição por coordenadas com precisão de até 0,9 µm, adequada a tolerâncias apertadas e peças críticas.",
    icon: "Target",
  },
  {
    title: "Rastreabilidade",
    description:
      "Relatórios com cadeia de medição documentada, equipamentos calibrados e condições de ensaio controladas.",
    icon: "ShieldCheck",
  },
  {
    title: "Tecnologia ZEISS",
    description:
      "Parque com máquinas de coordenadas, sistemas ópticos e multissensores, scanners 3D e raio-X industrial — o mesmo padrão usado em centros de referência.",
    icon: "Cpu",
  },
  {
    title: "Técnicos e formação",
    description:
      "Equipe dedicada à metrologia industrial, no ambiente de uma faculdade SENAI: atendimento à indústria e capacitação de profissionais no mesmo complexo.",
    icon: "Users",
  },
];

export const infrastructureHeading: SectionCopy = {
  eyebrow: "Infraestrutura",
  title: "Ambiente preparado para medições de alta precisão",
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
    description:
      "Área dedicada a escaneamento óptico, reconstrução digital e comparação peça–CAD.",
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
    description:
      "Fluxo de identificação, guarda e devolução das peças enviadas para ensaio.",
    icon: "PackageCheck",
  },
];

export const equipmentHeading: SectionCopy = {
  eyebrow: "Equipamentos",
  title: "Parque ZEISS para medição, digitalização e inspeção",
};

export const equipment: FeatureItem[] = [
  {
    title: "Máquinas de medição por coordenadas",
    description:
      "CMM ZEISS para metrologia dimensional de alta precisão, em peças usinadas, ferramental e componentes críticos.",
    icon: "Box",
  },
  {
    title: "Sistemas ópticos e multissensores",
    description:
      "Medição por contato e por imagem, inclusive em características de difícil acesso ao apalpador.",
    icon: "Aperture",
  },
  {
    title: "Scanners 3D",
    description:
      "Digitalização de superfícies complexas para engenharia reversa, controle dimensional e documentação.",
    icon: "Scan",
  },
  {
    title: "Raio-X e tomografia industrial",
    description:
      "Ensaio não destrutivo da estrutura interna: poros, trincas, inclusões e montagens fechadas.",
    icon: "Layers",
  },
];

export const sectorsHeading: SectionCopy = {
  eyebrow: "Setores",
  title: "Onde a medição faz diferença no produto",
};

export const sectors: FeatureItem[] = [
  {
    title: "Automotivo",
    description:
      "Padronização dimensional, repetibilidade entre lotes, validação de reposição e engenharia reversa de componentes.",
    icon: "Car",
  },
  {
    title: "Aeroespacial",
    description:
      "Inspeção de peças críticas pós-manutenção, com CMM, escaneamento 3D e raio-X para integridade interna.",
    icon: "Plane",
  },
  {
    title: "Metalmecânico",
    description:
      "Controle de usinagem, ferramental, conformidade de peça e análise de falhas em manufatura.",
    icon: "Factory",
  },
  {
    title: "Farmacêutico e alimentício",
    description:
      "Apoio a qualidade e rastreabilidade de componentes, embalagens e dispositivos de processo.",
    icon: "HeartPulse",
  },
];

export const partners = {
  title: "Parceiros",
  items: ["ZEISS", "SENAI Goiás", "FIEG", "Faculdade SENAI Ítalo Bologna"],
};
