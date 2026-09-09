import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { HistorySection } from "@/components/sections/HistorySection";
import { PurposeSection } from "@/components/sections/PurposeSection";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { LogoRow } from "@/components/sections/LogoRow";
import {
  historyFacts,
  historyHeading,
  historyParagraphs,
  institutionalHero,
  partners,
  partnersHeading,
  purposeHeading,
  purposeItems,
  team,
  teamHeading,
} from "@/copy";

export const metadata: Metadata = {
  title: "Institucional | Centro de Excelência em Metrologia SENAI ZEISS",
  description:
    "História, missão, visão e quem fez o primeiro Centro de Excelência em Metrologia SENAI ZEISS do Brasil, na Faculdade SENAI Ítalo Bologna, em Goiânia.",
};

export default function InstitutionalPage() {
  return (
    <>
      <Hero {...institutionalHero} sectionKey="institutional-hero" />
      <HistorySection heading={historyHeading} facts={historyFacts} paragraphs={historyParagraphs} />
      <PurposeSection heading={purposeHeading} items={purposeItems} />
      <TeamGrid heading={teamHeading} members={team} />
      <LogoRow heading={partnersHeading} items={partners} sectionKey="institutional-partners" />
    </>
  );
}
