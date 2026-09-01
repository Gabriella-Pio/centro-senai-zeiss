import type { FeatureItem, PartnerLogo, SectionCopy } from '@/copy/types';

export const hero = {
  eyebrow: 'Centro de Excelência em Metrologia · Faculdade SENAI Ítalo Bologna',
  brand: { left: 'SENAI', right: 'ZEISS' },
  subtitle: 'O primeiro centro de excelência em metrologia SENAI ZEISS do Brasil.',
  body: 'Controle de qualidade dimensional, digitalização, inspeção interna, prototipação 3D e consultoria em qualidade — com tecnologia ZEISS e equipe técnica SENAI.',
  primaryCta: { label: 'Solicitar orçamento', href: '/quote' },
  secondaryCta: { label: 'Conhecer o centro', href: '/institutional' },
  image: {
    src: '/lab/centro.jpg',
    alt: 'Vista do laboratório do Centro de Excelência em Metrologia SENAI ZEISS, com equipamentos ZEISS ao fundo.',
    objectPosition: '50% 40%',
  },
  imageBlend: 'panel' as const,
};

export const labIntro = {
  eyebrow: 'Sobre o centro',
  title: 'Precisão alemã a serviço da indústria brasileira',
  body: 'Instalado na Faculdade SENAI Ítalo Bologna, em Goiânia, o Centro de Excelência em Metrologia SENAI ZEISS reúne equipamentos ZEISS de última geração, salas climatizadas e equipe técnica especializada. Atendemos indústrias de Goiás e de outros estados na validação dimensional, análise de falhas, reconstrução CAD e inspeção não destrutiva — com o mesmo rigor exigido em qualidade, manutenção e desenvolvimento de produto.',
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
    title: 'Precisão dimensional',
    description:
      'Medição por coordenadas com precisão de até 0,9 µm, adequada a tolerâncias apertadas e peças críticas.',
    icon: 'Target',
    image: '/lab/cmm.jpeg',
    imageAlt: 'Foto de uma peça sendo medida por uma máquina de coordenadas.',
  },
  {
    title: 'Rastreabilidade',
    description:
      'Relatórios com cadeia de medição documentada, equipamentos calibrados e condições de ensaio controladas.',
    icon: 'ShieldCheck',
    image: '/lab/relatorio.jpeg',
    imageAlt: 'Tecnico do centro operando uma máquina com seu desenho cad na tela.',
  },
  {
    title: 'Tecnologia ZEISS',
    description:
      'Parque com máquinas de coordenadas, sistemas ópticos e multissensores, scanners 3D e raio-X industrial — o mesmo padrão usado em centros de referência.',
    icon: 'Cpu',
    image: '/lab/tecnologia-zeiss.jpeg',
    imageAlt: 'Foto de equipamento ZEISS com foco na logo da marca.',
  },
  {
    title: 'Técnicos e formação',
    description:
      'Equipe dedicada à metrologia industrial, no ambiente de uma faculdade SENAI: atendimento à indústria e capacitação de profissionais no mesmo complexo.',
    icon: 'Users',
    image: '/lab/tecnico.jpeg',
    imageAlt:
      'Técnico do centro operando uma máquina de medição, com a peça na bancada de trabalho.',
  },
  {
    title: 'Valores acessíveis',
    description:
      'Estrutura SENAI pensada para atender desde pequenas empresas até grandes indústrias — com condições compatíveis com o porte e a recorrência da demanda.',
    icon: 'BadgePercent',
    image: '/lab/ponteiras.jpeg',
    imageAlt: 'Ponteiras e sensores em máquina de coordenadas — estrutura acessível para diferentes portes de empresa.',
  },
];

export const sectorsHeading: SectionCopy = {
  eyebrow: 'Setores',
  title: 'Onde a medição faz diferença no produto',
  description:
    'Da linha de montagem ao componente crítico — metrologia aplicada conforme o risco e a tolerância de cada setor.',
};

export const sectors: FeatureItem[] = [
  {
    title: 'Automotivo',
    description:
      'Padronização dimensional, repetibilidade entre lotes, validação de reposição e engenharia reversa de componentes.',
    icon: 'Car',
  },
  {
    title: 'Aeroespacial',
    description:
      'Inspeção de peças críticas pós-manutenção, com CMM, escaneamento 3D e raio-X para integridade interna.',
    icon: 'Plane',
  },
  {
    title: 'Metalmecânico',
    description:
      'Controle de usinagem, ferramental, conformidade de peça e análise de falhas em manufatura.',
    icon: 'Factory',
  },
  {
    title: 'Farmacêutico e alimentício',
    description:
      'Apoio a qualidade e rastreabilidade de componentes, embalagens e dispositivos de processo.',
    icon: 'HeartPulse',
  },
];

export const partners = {
  title: 'Parceiros',
  items: [
    {
      name: 'ZEISS',
      logoSrc: '/brand/partners/zeiss.png',
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
    },
  ] satisfies PartnerLogo[],
};
