import type { Metadata } from "next";
import { ProseSection } from "@/components/sections/ProseSection";
import { legalPages } from "@/copy";

export const metadata: Metadata = {
  title: "Política de Privacidade | Centro de Excelência em Metrologia SENAI ZEISS",
};

export default function PrivacyPage() {
  return <ProseSection clearNav title={legalPages.privacy.title} paragraphs={legalPages.privacy.paragraphs} />;
}
