import type { Metadata } from "next";
import { LegalDoc } from "@/components/sections/LegalDoc";
import { legalPages } from "@/copy";

export const metadata: Metadata = {
  title: "Termos de Uso | Centro de Excelência em Metrologia SENAI ZEISS",
  description: legalPages.terms.description,
};

export default function TermsPage() {
  return <LegalDoc sectionKey="legal-terms" {...legalPages.terms} />;
}
