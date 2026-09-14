import type { FieldCopy, SectionCopy } from "@/copy/types";

export const quoteHeading: SectionCopy = {
  eyebrow: "Orçamento",
  title: "Peça um orçamento",
  description:
    "Descreva a empresa e o que precisa resolver. Cuidamos do ensaio e da proposta.",
};

export const quoteNotes = {
  heading: "O que nos ajuda a montar a proposta",
  items: [
    { label: "Peça", text: "Tipo, material e quantidade." },
    { label: "Necessidade", text: "O que precisa resolver ou comprovar na peça." },
    { label: "Prazo", text: "Quando a peça pode chegar e quando o laudo precisa sair." },
  ],
};

export const quoteForm = {
  fields: {
    company: { label: "Empresa", placeholder: "Nome da empresa" },
    cnpj: { label: "CNPJ", placeholder: "00.000.000/0000-00" },
    contactName: { label: "Responsável", placeholder: "Seu nome" },
    email: { label: "E-mail", placeholder: "voce@empresa.com" },
    phone: { label: "Telefone", placeholder: "(00) 00000-0000" },
    service: { label: "Serviços desejados", placeholder: "Selecione os serviços" },
    otherDetail: {
      label: "Qual outro serviço",
      placeholder: "Qual ensaio ou demanda não está na lista",
    },
    description: {
      label: "Descrição da necessidade",
      placeholder:
        "Peça, quantidade, prazo e o que precisa resolver",
    },
  } satisfies Record<string, FieldCopy>,
  otherService: { id: "outro", label: "Outro" },
  requiredLegend: "Campos obrigatórios",
  submit: "Enviar solicitação",
  submitPending: "Enviando…",
  validation: {
    required: "Preencha este campo.",
    email: "Informe um e-mail válido.",
    phone: "Informe um telefone com DDD.",
    cnpj: "Informe um CNPJ válido.",
    service: "Selecione pelo menos um serviço.",
    submit: "Não foi possível enviar. Tente de novo ou fale pelo telefone da página de contato.",
  },
  privacy: {
    before: "Usamos os dados só para responder ao orçamento. Leia a ",
    link: "política de privacidade",
    href: "/privacy",
    after: ".",
  },
  success: {
    title: "Recebemos a solicitação",
    body: "Registramos o pedido. A nossa equipe analisa a demanda e retorna com a proposta por e-mail, WhatsApp ou ligação.",
    close: "Fechar",
  },
};

export type QuoteFormCopy = typeof quoteForm;
