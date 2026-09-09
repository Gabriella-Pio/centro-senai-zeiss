import type { Metadata } from "next";
import { ProseSection } from "@/components/sections/ProseSection";
import { legalPages } from "@/copy";

export const metadata: Metadata = {
  title: "Termos de Uso | Centro de Excelência em Metrologia SENAI ZEISS",
};

export default function TermsPage() {
  return <ProseSection clearNav title={legalPages.terms.title} paragraphs={legalPages.terms.paragraphs} />;
}
