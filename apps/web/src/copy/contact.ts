import { location } from "@/copy/site";
import type { InfoCardItem, SectionCopy } from "@/copy/types";

export const contactHeading: SectionCopy = {
  eyebrow: "Contato",
  title: "Fale com o centro",
  description:
    "Dúvidas, visita técnica ou alinhamento de ensaio. Para proposta formal, use a página de orçamento.",
};

export const contactCards: InfoCardItem[] = [
  {
    icon: "MapPin",
    title: "Endereço",
    value: [location.name, ...location.lines].join("\n"),
  },
  {
    icon: "Phone",
    title: "Telefone",
    value: location.phone,
  },
  {
    icon: "Mail",
    title: "E-mail",
    value: "Envie sua demanda pela página de Orçamento",
  },
  {
    icon: "Clock",
    title: "Horário",
    value: location.hours,
  },
];

export const mapPlaceholder = "Localização na Faculdade SENAI Ítalo Bologna";
