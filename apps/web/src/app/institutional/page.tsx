import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProseSection } from "@/components/sections/ProseSection";
import { StatRow } from "@/components/sections/StatRow";
import {
  history,
  infrastructure,
  infrastructureHeading,
  institutionalHeading,
  institutionalStats,
  pillars,
} from "@/copy";

export default function InstitutionalPage() {
  return (
    <>
      <FeatureGrid heading={institutionalHeading} items={pillars} columns={3} clearNav />
      <StatRow items={institutionalStats} variant="muted" />
      <FeatureGrid heading={infrastructureHeading} items={infrastructure} columns={3} variant="muted" />
      <ProseSection title={history.title} paragraphs={history.paragraphs} variant="default" />
    </>
  );
}
