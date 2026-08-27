import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { ProseSection } from "@/components/sections/ProseSection";
import { history, institutionalHeading, pillars } from "@/copy";

export default function InstitutionalPage() {
  return (
    <>
      <FeatureGrid heading={institutionalHeading} items={pillars} columns={3} className="!pt-16" />
      <ProseSection title={history.title} paragraphs={history.paragraphs} variant="muted" />
    </>
  );
}
