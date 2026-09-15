import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { HistorySection } from "@/components/sections/HistorySection";
import { PurposeSection } from "@/components/sections/PurposeSection";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { LogoRow } from "@/components/sections/LogoRow";
import { getCatalog } from "@/copy/catalog";

type InstitutionalPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: InstitutionalPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCatalog(locale);
  return {
    title: copy.institutionalHero.eyebrow,
    description: copy.institutionalHero.body,
  };
}

export default async function InstitutionalPage({ params }: InstitutionalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getCatalog(locale);

  return (
    <>
      <Hero {...copy.institutionalHero} sectionKey="institutional-hero" />
      <HistorySection
        heading={copy.historyHeading}
        facts={copy.historyFacts}
        paragraphs={copy.historyParagraphs}
      />
      <PurposeSection heading={copy.purposeHeading} items={copy.purposeItems} />
      <TeamGrid heading={copy.teamHeading} groups={copy.teamGroups} />
      <LogoRow heading={copy.partnersHeading} items={copy.partners} sectionKey="institutional-partners" />
    </>
  );
}
