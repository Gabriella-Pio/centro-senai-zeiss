import type { FeatureItem, PartnerLogo, SectionCopy, SectorItem } from '@/copy/types';

export const hero = {
  eyebrow: 'Centro de Excelência em Metrologia',
  brand: { left: 'SENAI', right: 'ZEISS' },
  subtitle: 'O primeiro centro de excelência em metrologia SENAI ZEISS do Brasil.',
  body: 'Medimos, digitalizamos e inspecionamos peças industriais — controle dimensional, inspeção interna, prototipação 3D e consultoria em qualidade. Tecnologia ZEISS, equipe SENAI.',
  primaryCta: { label: 'Solicitar orçamento', href: '/quote' },
  secondaryCta: { label: 'Conheça o laboratório', href: '/institutional' },
  image: {
    src: '/lab/lab-entrada.jpeg',
    alt: 'Vista do laboratório do Centro de Excelência em Metrologia SENAI ZEISS, com equipamentos ZEISS ao fundo.',
    objectPosition: '50% 40%',
  },
  imageBlend: 'feather' as const,
  place: 'Goiânia · Faculdade SENAI Ítalo Bologna',
};

export const labIntro = {
  eyebrow: 'O laboratório',
  title: 'Tecnologia ZEISS e equipe SENAI, em Goiânia',
  body: 'Funcionamos na Faculdade SENAI Ítalo Bologna. Aqui estão as máquinas do parque, as salas climatizadas e a equipe técnica do SENAI.\n\nAtendemos indústrias de Goiás e de outros estados na validação dimensional, análise de falhas, reconstrução CAD, inspeção não destrutiva e prototipação 3D — o mesmo rigor que qualidade, manutenção e desenvolvimento de produto exigem.',
  image: {
    src: '/lab/lab-int-2.jpeg',
    alt: 'Vista do laboratório do Centro de Excelência em Metrologia SENAI ZEISS, com a sala de medição ao fundo.',
  },
  cta: { label: 'Conheça o laboratório', href: '/institutional' },
};

export const serviceHubHeading: SectionCopy = {
  eyebrow: 'Nossos serviços',
  title: 'O que medimos e o que entregamos',
  description:
    'Do laudo dimensional à consultoria em qualidade, escolhemos as máquinas conforme a peça e o que o relatório precisa responder.',
};

export const differentialsHeading: SectionCopy = {
  eyebrow: 'Por que nos procuram',
  title: 'Da peça que recebemos ao relatório que devolvemos',
  description:
    'Cada demanda segue um fluxo técnico — do recebimento da peça à entrega do relatório — com metodologia ZEISS e rastreabilidade das medições.',
};

export const differentials: FeatureItem[] = [
  {
    value: '0,9µm',
    title: 'Precisão dimensional',
    description: 'Medimos tolerâncias apertadas em peças críticas.',
    icon: 'Target',
  },
  {
    value: '100%',
    title: 'Rastreabilidade',
    description: 'Documentamos a cadeia de medição do recebimento ao relatório.',
    icon: 'FileCheck',
  },
  {
    value: '7',
    title: 'Máquinas no parque',
    description: 'CMM, óptico, scanner, raio-X e impressão 3D.',
    icon: 'Cpu',
  },
  {
    value: '1º',
    title: 'Centro no Brasil',
    description: 'O primeiro centro SENAI ZEISS do país.',
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
  servicesLabel: 'Serviços que combinamos',
  colSector: 'Setor',
  colApplication: 'No produto',
  colServices: 'Serviços',
};

export const sectorsHeading: SectionCopy = {
  eyebrow: 'Setores que atendemos',
  title: 'Onde a medição entra no produto',
  description:
    'Da linha de montagem ao componente crítico — aplicamos a metrologia conforme o risco e a tolerância de cada setor.',
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
      'Inspecionamos peças críticas pós-manutenção — CMM, escaneamento 3D e raio-X para integridade interna.',
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
      'Apoiamos qualidade e rastreabilidade de componentes, embalagens e dispositivos de processo.',
    icon: 'HeartPulse',
    relatedServices: ['controle-qualidade-dimensional', 'consultoria-qualidade'],
  },
];

export const partnersHeading: SectionCopy = {
  eyebrow: 'Quem nos sustenta',
  title: 'As instituições por trás do laboratório',
  description:
    'FIEG, SENAI Goiás, ZEISS e a Faculdade SENAI Ítalo Bologna — a estrutura que mantém a metrologia ZEISS em Goiânia.',
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
