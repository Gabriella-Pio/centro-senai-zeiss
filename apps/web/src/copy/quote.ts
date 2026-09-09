import type { FieldCopy, SectionCopy } from "@/copy/types";

export const quoteHeading: SectionCopy = {
  eyebrow: "Orçamento",
  title: "Solicite um orçamento",
  description:
    "Informe a empresa, os serviços e o que precisa ser medido ou inspecionado. A equipe técnica retorna com uma proposta.",
};

export const quoteNotes = {
  heading: "Para a proposta sair mais rápida",
  items: [
    { label: "Peça", text: "Tipo, material e quantidade." },
    { label: "Ensaio", text: "O que precisa ser medido, digitalizado ou inspecionado." },
    { label: "Prazo", text: "Quando a peça pode chegar e quando o laudo precisa sair." },
    { label: "Desenho", text: "CAD ou especificação, se já existir." },
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
        "Peça, quantidade, prazo e o que deve ser medido, digitalizado ou inspecionado",
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
    summary: "Complete os campos abaixo para enviar a solicitação.",
    submit: "Não foi possível enviar. Tente de novo ou fale pelo telefone da página de contato.",
  },
  privacy: {
    before: "Os dados servem só para responder ao orçamento. Leia a ",
    link: "política de privacidade",
    href: "/privacy",
    after: ".",
  },
  success: {
    title: "Solicitação recebida",
    body: "Registramos o pedido. A equipe técnica entra em contato em até dois dias úteis.",
    again: "Enviar outra solicitação",
  },
};

export type QuoteFormCopy = typeof quoteForm;
