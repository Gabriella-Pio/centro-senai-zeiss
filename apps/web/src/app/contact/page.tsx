import type { Metadata } from "next";
import { ContactChannels } from "@/components/sections/ContactChannels";
import { contactHeading } from "@/copy";

export const metadata: Metadata = {
  title: "Contato | Centro de Excelência em Metrologia SENAI ZEISS",
  description:
    "Endereço, telefone, e-mail e mapa do Centro de Excelência em Metrologia SENAI ZEISS na Faculdade SENAI Ítalo Bologna, em Goiânia.",
};

export default function ContactPage() {
  return <ContactChannels heading={contactHeading} />;
}
