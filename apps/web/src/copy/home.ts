import type { FeatureItem, PartnerLogo, SectionCopy, SectorItem } from '@/copy/types';

export const hero = {
  eyebrow: 'Centro de Excelência em Metrologia',
  brand: { left: 'SENAI', right: 'ZEISS' },
  subtitle: 'O primeiro centro de excelência em metrologia SENAI ZEISS do Brasil.',
  body: 'Controle de qualidade dimensional, digitalização, inspeção interna, prototipação 3D e consultoria em qualidade — com tecnologia ZEISS e equipe técnica SENAI.',
  primaryCta: { label: 'Solicitar orçamento', href: '/quote' },
  secondaryCta: { label: 'Conhecer o centro', href: '/institutional' },
  image: {
    src: '/lab/lab-entrada.jpeg',
    alt: 'Vista do laboratório do Centro de Excelência em Metrologia SENAI ZEISS, com equipamentos ZEISS ao fundo.',
    objectPosition: '50% 40%',
  },
  imageBlend: 'feather' as const,
  place: 'Goiânia · Faculdade SENAI Ítalo Bologna',
};

export const labIntro = {
  eyebrow: 'Sobre o centro',
  title: 'Precisão alemã a serviço da indústria brasileira',
  body: 'Instalado na Faculdade SENAI Ítalo Bologna, em Goiânia, o Centro de Excelência em Metrologia SENAI ZEISS reúne equipamentos ZEISS de última geração, salas climatizadas e equipe técnica especializada.\n\nAtendemos indústrias de Goiás e de outros estados na validação dimensional, análise de falhas, reconstrução CAD e inspeção não destrutiva — com o mesmo rigor exigido em qualidade, manutenção e desenvolvimento de produto.',
  image: {
    src: '/lab/info.jpeg',
    alt: 'Vista do laboratório do Centro de Excelência em Metrologia SENAI ZEISS, com a sala de medição ao fundo.',
  },
  cta: { label: 'Conhecer o centro', href: '/institutional' },
};

export const serviceHubHeading: SectionCopy = {
  eyebrow: 'Serviços',
  title: 'O que medimos e o que entregamos',
  description:
    'Cinco linhas de atendimento — do laudo dimensional à consultoria em conformidade. Cada serviço combina equipamentos ZEISS conforme a peça e o relatório.',
};

export const differentialsHeading: SectionCopy = {
  eyebrow: 'Diferenciais',
  title: 'Por que a indústria recorre ao centro',
  description:
    'Cada demanda segue um fluxo técnico — do recebimento da peça à entrega do relatório — com metodologia ZEISS e rastreabilidade das medições.',
};

export const differentials: FeatureItem[] = [
  {
    value: '0,9µm',
    title: 'Precisão dimensional',
    description: 'Tolerâncias apertadas para peças críticas de qualquer setor.',
    icon: 'Target',
  },
  {
    value: '100%',
    title: 'Rastreabilidade',
    description: 'Cadeia de medição documentada do recebimento ao relatório.',
    icon: 'FileCheck',
  },
  {
    value: '8',
    title: 'Máquinas ZEISS',
    description: 'CMM, óptico, multisensor, scanner 3D e raio-X.',
    icon: 'Cpu',
  },
  {
    value: '1º',
    title: 'Centro no Brasil',
    description: 'Primeiro centro SENAI ZEISS do país.',
    icon: 'Award',
  },
  {
    value: 'R$40M',
    title: 'Investimento',
    description: 'Infraestrutura completa de metrologia.',
    icon: 'ShieldCheck',
  },
];

export const sectorsCard = {
  servicesLabel: 'Serviços comuns',
};

export const sectorsHeading: SectionCopy = {
  eyebrow: 'Setores',
  title: 'Onde a medição faz diferença no produto',
  description:
    'Da linha de montagem ao componente crítico — metrologia aplicada conforme o risco e a tolerância de cada setor.',
};

export const sectors: SectorItem[] = [
  {
    id: 'automotivo',
    title: 'Automotivo',
    description:
      'Padronização dimensional, repetibilidade entre lotes, validação de reposição e engenharia reversa de componentes.',
    icon: 'Car',
    relatedServices: [
      'controle-qualidade-dimensional',
      'digitalizacao-engenharia-reversa',
      'prototipacao-3d',
    ],
  },
  {
    id: 'aeroespacial',
    title: 'Aeroespacial',
    description:
      'Inspeção de peças críticas pós-manutenção, com CMM, escaneamento 3D e raio-X para integridade interna.',
    icon: 'Plane',
    relatedServices: [
      'inspecao-interna',
      'controle-qualidade-dimensional',
      'digitalizacao-engenharia-reversa',
    ],
  },
  {
    id: 'metalmecanico',
    title: 'Metalmecânico',
    description:
      'Controle de usinagem, ferramental, conformidade de peça e análise de falhas em manufatura.',
    icon: 'Factory',
    relatedServices: [
      'controle-qualidade-dimensional',
      'inspecao-interna',
      'consultoria-qualidade',
    ],
  },
  {
    id: 'farmaceutico',
    title: 'Farmacêutico',
    description:
      'Apoio à qualidade e à rastreabilidade de componentes, embalagens e dispositivos de processo no setor farmacêutico.',
    icon: 'HeartPulse',
    relatedServices: ['controle-qualidade-dimensional', 'consultoria-qualidade'],
  },
];

export const partnersHeading: SectionCopy = {
  eyebrow: 'Parceiros',
  title: 'Quem sustenta o centro',
  description:
    'A estrutura institucional que mantém a metrologia ZEISS em Goiânia.',
};

export const partners = [
    {
      name: 'ZEISS',
      logoSrc: '/brand/partners/zeiss-cooperacao.png',
      logoAlt: 'Logo Carl Zeiss — parceiro tecnológico em metrologia industrial',
      href: 'https://www.zeiss.com/metrology',
    },
    {
      name: 'SENAI Goiás',
      logoSrc: '/brand/partners/senai-estendido.png',
      logoAlt: 'Logo SENAI Goiás — rede de educação profissional e serviços à indústria',
      wide: true,
      href: 'https://goias.senai.br',
    },
    {
      name: 'FIEG',
      logoSrc: '/brand/partners/fieg.png',
      logoAlt: 'Logo FIEG — Federação das Indústrias do Estado de Goiás',
      wide: true,
      href: 'https://www.fieg.com.br',
    },
    {
      name: 'Faculdade SENAI Ítalo Bologna',
      href: 'https://goias.senai.br/unidade/faculdade-senai-italo-bologna',
      caption: 'Ítalo Bologna',
    },
] satisfies PartnerLogo[];
