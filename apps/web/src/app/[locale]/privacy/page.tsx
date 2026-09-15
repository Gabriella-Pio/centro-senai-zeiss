import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalDoc } from "@/components/sections/LegalDoc";
import { getCatalog } from "@/copy/catalog";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCatalog(locale);
  return {
    title: copy.legalPages.privacy.title,
    description: copy.legalPages.privacy.description,
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getCatalog(locale);
  return <LegalDoc sectionKey="legal-privacy" {...copy.legalPages.privacy} />;
}
