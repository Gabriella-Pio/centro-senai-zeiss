import { InstitutionalHero } from "@/components/sections/InstitutionalHero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProseSection } from "@/components/sections/ProseSection";
import { StatRow } from "@/components/sections/StatRow";
import {
  history,
  infrastructure,
  infrastructureHeading,
  institutionalStats,
  pillars,
  pillarsHeading,
} from "@/copy";

export default function InstitutionalPage() {
  return (
    <>
      <InstitutionalHero />
      <FeatureGrid heading={pillarsHeading} items={pillars} columns={3} />
      <StatRow items={institutionalStats} variant="muted" />
      <FeatureGrid heading={infrastructureHeading} items={infrastructure} columns={3} variant="muted" />
      <ProseSection title={history.title} paragraphs={history.paragraphs} variant="default" />
    </>
  );
}
