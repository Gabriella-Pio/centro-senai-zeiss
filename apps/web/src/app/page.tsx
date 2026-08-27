import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { LinkCardGrid } from "@/components/sections/LinkCardGrid";
import { DifferentialsSwitch } from "@/components/sections/DifferentialsSwitch";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { LogoRow } from "@/components/sections/LogoRow";
import {
  differentials,
  differentialsHeading,
  equipment,
  equipmentHeading,
  hero,
  infrastructure,
  infrastructureHeading,
  labIntro,
  partners,
  sectors,
  sectorsHeading,
  serviceHubHeading,
  services,
} from "@/copy";

export default function HomePage() {
  return (
    <>
      <Hero {...hero} />
      <LabIntro {...labIntro} />
      <LinkCardGrid
        heading={serviceHubHeading}
        items={services.map((service) => ({
          title: service.label,
          description: service.shortDescription,
          href: `/services/${service.id}`,
          icon: service.icon,
        }))}
      />

      <DifferentialsSwitch heading={differentialsHeading} items={differentials} />

      <FeatureGrid heading={infrastructureHeading} items={infrastructure} />
      <FeatureGrid heading={equipmentHeading} items={equipment} />
      <FeatureGrid heading={sectorsHeading} items={sectors} />

      <LogoRow title={partners.title} items={partners.items} variant="default" />
    </>
  );
}
