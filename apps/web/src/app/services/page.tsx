import type { Metadata } from "next";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { services, servicesHeading } from "@/copy";

export const metadata: Metadata = {
  title: "Serviços | Centro de Excelência em Metrologia SENAI ZEISS",
  description:
    "Controle dimensional, digitalização, inspeção interna, prototipação 3D e consultoria em qualidade no Centro de Excelência em Metrologia SENAI ZEISS, em Goiânia.",
};

export default function ServicesPage() {
  return <ServiceIndex heading={servicesHeading} items={services} />;
}
