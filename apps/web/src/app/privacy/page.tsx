import type { Metadata } from "next";
import { LegalDoc } from "@/components/sections/LegalDoc";
import { legalPages } from "@/copy";

export const metadata: Metadata = {
  title: "Política de Privacidade | Centro de Excelência em Metrologia SENAI ZEISS",
  description: legalPages.privacy.description,
};

export default function PrivacyPage() {
  return <LegalDoc sectionKey="legal-privacy" {...legalPages.privacy} />;
}
