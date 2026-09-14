export const siteMeta = {
  title: "Centro de Excelência em Metrologia SENAI ZEISS | Goiânia",
  description:
    "Primeiro Centro de Excelência em Metrologia SENAI ZEISS do Brasil. Medimos, digitalizamos e inspecionamos peças industriais na Faculdade SENAI Ítalo Bologna, em Goiânia.",
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
  menuLabel: "Menu",
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
    "Primeiro centro SENAI ZEISS do Brasil. Da peça ao laudo, com método e rastreabilidade.",
  visitTitle: "Visite-nos",
  servicesTitle: "Serviços",
  institutionalTitle: "O centro",
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
  title: "Fale com a nossa equipe",
  description:
    "Peça orçamento, agende visita ao laboratório ou tire dúvidas sobre medição e ensaios.",
  primaryCta: { label: "Solicitar orçamento", href: "/quote" },
  secondaryCta: { label: "Ver endereço e horários", href: "/contact" },
};

/** Na própria página de orçamento o primário não pode apontar para ela mesma. */
export const contactBandOnQuote = {
  eyebrow: "Contato",
  title: "Prefere falar primeiro?",
  description:
    "Dúvida de recebimento, visita ou horário — endereço e telefone estão na página de contato.",
  primaryCta: { label: "Ver endereço e horários", href: "/contact" },
  secondaryCta: { label: "Ver os serviços", href: "/services" },
};

/** Na própria página de contato o secundário não pode apontar para ela mesma. */
export const contactBandOnContact = {
  ...contactBand,
  eyebrow: "Orçamento",
  title: "Prefere uma proposta por escrito?",
  description:
    "Descreva a peça e o que precisa resolver. Quer ver o que o laboratório faz? Os serviços estão ao lado.",
  secondaryCta: { label: "Ver os serviços", href: "/services" },
};

export const legalPages = {
  terms: {
    eyebrow: "Termos de uso",
    title: "Termos de Uso",
    description:
      "Este site apresenta o laboratório. Proposta, prazo e condições técnicas só se confirmam depois da análise da demanda.",
    blocks: [
      {
        title: "Este site",
        text: "O conteúdo informa a indústria sobre os serviços, a infraestrutura e as formas de contato do Centro de Excelência em Metrologia SENAI ZEISS, na Faculdade SENAI Ítalo Bologna, em Goiânia.",
      },
      {
        title: "Orçamento e atualização",
        text: "Orçamentos, prazos e condições técnicas só se confirmam depois que analisamos a demanda. Informações publicadas podem ser atualizadas para refletir equipamentos, horários e canais oficiais.",
      },
      {
        title: "Formulário",
        text: "Ao solicitar orçamento ou enviar dados pelo formulário, você declara que as informações são verdadeiras e que está autorizado a representá-las perante o SENAI Goiás / FIEG.",
      },
    ],
    actions: [{ label: "Política de privacidade", href: "/privacy" }],
  },
  privacy: {
    eyebrow: "Privacidade",
    title: "Política de Privacidade",
    description:
      "Este aviso vale para o site do Centro de Excelência em Metrologia SENAI ZEISS. O tratamento institucional no SENAI Goiás segue a política de privacidade do Sistema FIEG.",
    blocks: [
      {
        title: "Dados neste site",
        text: "Usamos os dados enviados pelo formulário de orçamento ou pelos canais de contato — nome, empresa, CNPJ, e-mail, telefone e descrição da demanda — só para responder à solicitação e organizar o atendimento técnico.",
      },
      {
        title: "Compartilhamento",
        text: "Não vendemos dados pessoais. O compartilhamento ocorre apenas internamente, entre as nossas equipes e as da Faculdade SENAI Ítalo Bologna necessárias ao orçamento, à logística da peça e ao laudo.",
      },
      {
        title: "Pedidos",
        text: "Para atualizar ou excluir informações enviadas por este site, use o telefone ou o e-mail da página de contato. Pedidos sobre a política institucional do Sistema FIEG vão ao encarregado de dados.",
        cta: { label: "privacidade@fieg.com.br", href: "mailto:privacidade@fieg.com.br" },
      },
      {
        title: "Sistema FIEG",
        text: "A política de privacidade do Sistema FIEG (SESI, SENAI, IEL e FIEG) descreve o tratamento institucional, os direitos do titular e o encarregado de dados.",
        cta: {
          label: "Política de privacidade do Sistema FIEG",
          href: "https://www.fieg.com.br/sobre/politica-privacidade",
        },
      },
    ],
    actions: [
      { label: "Ver contato", href: "/contact" },
      { label: "Termos de uso", href: "/terms" },
    ],
  },
};
