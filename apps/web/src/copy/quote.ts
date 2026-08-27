import type { FieldCopy, SectionCopy } from "@/copy/types";

export const quoteHeading: SectionCopy = {
  eyebrow: "Orçamento",
  title: "Solicite um orçamento",
  description:
    "Informe a empresa, o serviço e o que precisa ser medido ou inspecionado. A equipe técnica retorna com uma proposta.",
};

export const quoteForm = {
  fields: {
    company: { label: "Empresa", placeholder: "Nome da empresa" },
    contactName: { label: "Responsável", placeholder: "Seu nome" },
    email: { label: "E-mail", placeholder: "voce@empresa.com" },
    phone: { label: "Telefone", placeholder: "(00) 00000-0000" },
    service: { label: "Serviço desejado", placeholder: "Selecione um serviço" },
    description: {
      label: "Descrição da necessidade",
      placeholder:
        "Peça, quantidade, prazo e o que deve ser medido, digitalizado ou inspecionado",
    },
  } satisfies Record<string, FieldCopy>,
  submit: "Enviar solicitação",
  success: {
    title: "Solicitação recebida",
    body: "Registramos o pedido. A equipe técnica entra em contato em até dois dias úteis.",
  },
};

export type QuoteFormCopy = typeof quoteForm;
