export interface FeatureItem {
  title: string;
  description: string;
  icon: string; // nome do ícone lucide-react, resolvido no componente
  /** Foto de equipamento/peça, quando o laboratório autorizar. Sem arquivo, o bloco usa o ícone. */
  image?: string;
}

export const differentials: FeatureItem[] = [
  {
    title: "Precisão Submicrométrica",
    description:
      "Equipamentos ZEISS calibrados para medições dimensionais com incerteza na casa dos micrômetros.",
    icon: "Target",
  },
  {
    title: "Rastreabilidade Metrológica",
    description:
      "Todos os laudos seguem cadeia de rastreabilidade reconhecida, com calibração periódica auditável.",
    icon: "ShieldCheck",
  },
  {
    title: "Tecnologia Alemã de Ponta",
    description:
      "Parceria direta com a ZEISS garante acesso a equipamentos e metodologias de referência mundial.",
    icon: "Cpu",
  },
  {
    title: "Atendimento Técnico Especializado",
    description:
      "Equipe formada por engenheiros e técnicos dedicados exclusivamente a metrologia industrial.",
    icon: "Users",
  },
];

export const infrastructure: FeatureItem[] = [
  {
    title: "Sala Climatizada de Metrologia",
    description:
      "Ambiente com controle de temperatura e umidade, seguindo normas para medições de alta precisão.",
    icon: "Thermometer",
  },
  {
    title: "Laboratório de Digitalização 3D",
    description:
      "Espaço dedicado a escaneamento óptico e reconstrução digital de peças e componentes.",
    icon: "Scan",
  },
  {
    title: "Bancadas de Inspeção Dimensional",
    description:
      "Estrutura para inspeção de peças de pequeno a grande porte, com suporte a diferentes geometrias.",
    icon: "Ruler",
  },
  {
    title: "Área de Recebimento e Logística",
    description:
      "Fluxo estruturado para recebimento, identificação e devolução segura das peças analisadas.",
    icon: "PackageCheck",
  },
];

export const equipment: FeatureItem[] = [
  {
    title: "ZEISS CONTURA",
    description: "Máquina de medição por coordenadas (MMC) para metrologia dimensional de alta precisão.",
    icon: "Box",
  },
  {
    title: "ZEISS COMET",
    description: "Scanner óptico 3D para digitalização e engenharia reversa de componentes complexos.",
    icon: "Aperture",
  },
  {
    title: "Tomógrafo Industrial",
    description: "Inspeção não destrutiva de geometrias internas e análise de porosidade/defeitos.",
    icon: "Layers",
  },
  {
    title: "Braço de Medição Portátil",
    description: "Flexibilidade para medições em campo e peças de grandes dimensões.",
    icon: "MoveDiagonal",
  },
];

export const areasOfExpertise: FeatureItem[] = [
  {
    title: "Automotivo",
    description: "Controle dimensional de componentes e ferramental para a indústria automotiva.",
    icon: "Car",
  },
  {
    title: "Aeroespacial",
    description: "Inspeção de peças críticas com tolerâncias apertadas e rastreabilidade total.",
    icon: "Plane",
  },
  {
    title: "Médico-Odontológico",
    description: "Metrologia para dispositivos médicos e implantes, com foco em conformidade.",
    icon: "HeartPulse",
  },
  {
    title: "Bens de Capital",
    description: "Suporte a fabricantes de máquinas e equipamentos industriais de grande porte.",
    icon: "Factory",
  },
];

export const certifications = [
  "ISO/IEC 17025",
  "ISO 9001",
  "RBC — Inmetro",
  "Calibração Rastreável",
];

export const partners = ["ZEISS", "SENAI Goiás", "SENAI Ítalo Bologna", "Inmetro"];

export interface ServiceContent {
  id: string;
  label: string;
  shortDescription: string;
  applications: string[];
  audience: string;
}

export const services: ServiceContent[] = [
  {
    id: "metrologia-dimensional",
    label: "Metrologia Dimensional",
    shortDescription:
      "Medição de precisão de peças e componentes utilizando máquinas de medição por coordenadas ZEISS.",
    applications: ["Controle dimensional de peças usinadas", "Validação de ferramental", "Inspeção de recebimento"],
    audience: "Indústrias automotiva, aeroespacial e de bens de capital.",
  },
  {
    id: "engenharia-reversa",
    label: "Engenharia Reversa",
    shortDescription:
      "Reconstrução de modelos CAD a partir de digitalização 3D de peças físicas existentes.",
    applications: ["Recuperação de peças sem desenho técnico", "Comparação com modelo nominal", "Documentação técnica"],
    audience: "Empresas que precisam recriar ou documentar componentes legados.",
  },
  {
    id: "digitalizacao-3d",
    label: "Digitalização 3D",
    shortDescription:
      "Escaneamento óptico de alta resolução para geração de nuvens de pontos e malhas 3D.",
    applications: ["Prototipagem", "Documentação de geometria", "Controle de qualidade de superfície"],
    audience: "Times de desenvolvimento de produto e engenharia de qualidade.",
  },
  {
    id: "tomografia-industrial",
    label: "Tomografia Industrial",
    shortDescription:
      "Inspeção não destrutiva por raios-X para análise de geometrias internas e defeitos ocultos.",
    applications: ["Análise de porosidade", "Inspeção de montagens internas", "Controle de qualidade sem corte de peça"],
    audience: "Fundições, indústria automotiva e componentes injetados.",
  },
];
