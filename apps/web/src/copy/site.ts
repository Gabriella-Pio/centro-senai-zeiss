export const siteMeta = {
  title: "Centro de Excelência em Metrologia SENAI ZEISS | Goiânia",
  description:
    "Primeiro Centro de Excelência em Metrologia SENAI ZEISS do Brasil. Medição dimensional, engenharia reversa, digitalização 3D e tomografia industrial na Faculdade SENAI Ítalo Bologna, em Goiânia.",
};

export const brand = {
  ariaLabel: "SENAI",
};

export const location = {
  name: "Faculdade SENAI Ítalo Bologna",
  lines: [
    "Rua Armogaste José da Silveira, nº 612",
    "Setor Centro Oeste — Goiânia/GO",
    "CEP 74.560-020",
  ],
  /** Query usada em Google Maps e Waze. */
  mapsQuery:
    "Faculdade SENAI Ítalo Bologna, Rua Armogaste José da Silveira, 612, Goiânia, GO, 74560-020",
  phone: "(62) 3226-4500",
  phoneTel: "+556232264500",
  /** Contato público do centro (FIEG). Trocar se o laboratório tiver caixa compartilhada. */
  email: "matheusoliveirasilva@fieg.com.br",
  hours: "Segunda a sexta, 8h às 18h",
};

export const nav = {
  home: { label: "Início", href: "/" },
  servicesLabel: "Serviços",
  servicesHref: "/services",
  servicesAllLabel: "Todos os serviços",
  cta: { label: "Solicitar orçamento", href: "/quote" },
  contactCta: { label: "Contato", href: "/contact" },
  openMenu: "Abrir menu",
  closeMenu: "Fechar menu",
  languages: {
    ariaLabel: "Idioma",
    defaultCode: "pt",
    options: [
      { code: "pt", label: "Português" },
      { code: "en", label: "English" },
      { code: "de", label: "Deutsch" },
    ],
  },
  links: [
    { label: "Institucional", href: "/institutional" },
    { label: "Orçamento", href: "/quote" },
    { label: "Contato", href: "/contact" },
  ],
};

export const footer = {
  tagline:
    "Centro de Excelência em Metrologia SENAI ZEISS, na Faculdade SENAI Ítalo Bologna, em Goiânia.",
  visitTitle: "Visite-nos",
  servicesTitle: "Serviços",
  institutionalTitle: "Institucional",
  emailAria: "Enviar e-mail para o laboratório",
  phoneAria: "Ligar para o laboratório",
  copyright:
    "© 2026 Centro de Excelência em Metrologia SENAI ZEISS. Todos os direitos reservados.",
  legal: {
    terms: "Termos de Uso",
    privacy: "Política de Privacidade",
    termsHref: "/terms",
    privacyHref: "/privacy",
  },
  backToTop: "Voltar ao topo",
  mapsLinks: {
    googleMaps: "Google Maps",
    waze: "Waze",
    openInGoogleMaps: "Abrir endereço no Google Maps",
    openInWaze: "Abrir endereço no Waze",
  },
};

export const contactBand = {
  eyebrow: "Contato",
  title: "Fale com a equipe técnica",
  description:
    "Solicite orçamento, agende visita ao laboratório ou tire dúvidas sobre medição e ensaios.",
  primaryCta: { label: "Solicitar orçamento", href: "/quote" },
  secondaryCta: { label: "Ver endereço e horários", href: "/contact" },
};

/** Na própria página de orçamento o primário não pode apontar para ela mesma. */
export const contactBandOnQuote = {
  eyebrow: "Contato",
  title: "Prefere falar primeiro?",
  description:
    "Dúvida de recebimento, visita ou horário — o endereço e o telefone estão na página de contato.",
  primaryCta: { label: "Ver endereço e horários", href: "/contact" },
  secondaryCta: { label: "Ver os serviços", href: "/services" },
};

/** Na própria página de contato o secundário não pode apontar para ela mesma. */
export const contactBandOnContact = {
  ...contactBand,
  title: "Prefere uma proposta formal?",
  description:
    "Descreva a peça e o ensaio na página de orçamento. Para a origem do centro, a institucional.",
  secondaryCta: { label: "Conhecer o centro", href: "/institutional" },
};

export const legalPages = {
  terms: {
    title: "Termos de Uso",
    paragraphs: [
      "Este site apresenta o Centro de Excelência em Metrologia SENAI ZEISS, na Faculdade SENAI Ítalo Bologna, em Goiânia. O conteúdo destina-se a informar a indústria sobre serviços, infraestrutura e formas de contato.",
      "Orçamentos, prazos e condições técnicas são confirmados apenas após análise da demanda pela equipe do centro. Informações publicadas podem ser atualizadas sem aviso prévio para refletir equipamentos, horários e canais oficiais.",
      "Ao solicitar orçamento ou enviar dados pelo formulário, você declara que as informações são verdadeiras e que está autorizado a representá-las perante o SENAI Goiás / FIEG.",
    ],
  },
  privacy: {
    title: "Política de Privacidade",
    paragraphs: [
      "Dados enviados pelo formulário de orçamento ou pelos canais de contato (nome, empresa, CNPJ, e-mail, telefone e descrição da demanda) são usados exclusivamente para responder à solicitação e organizar o atendimento técnico.",
      "Não vendemos dados pessoais. O compartilhamento ocorre apenas internamente, entre as equipes do centro e da Faculdade SENAI Ítalo Bologna necessárias ao orçamento, à logística da peça e ao laudo.",
      "Para atualizar ou excluir informações enviadas, utilize o telefone ou o e-mail publicados na página de contato.",
    ],
  },
};
