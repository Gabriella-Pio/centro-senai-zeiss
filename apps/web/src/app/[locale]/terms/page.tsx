import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDoc } from "@/components/sections/LegalDoc";
import { getCatalog } from "@/copy/catalog";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCatalog(locale);
  return {
    title: copy.legalPages.terms.title,
    description: copy.legalPages.terms.description,
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getCatalog(locale);
  return <LegalDoc sectionKey="legal-terms" {...copy.legalPages.terms} />;
}
