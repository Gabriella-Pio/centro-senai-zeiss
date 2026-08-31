import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { DifferentialsSwitch } from "@/components/sections/DifferentialsSwitch";
import { DifferentialsGallery } from "@/components/sections/DifferentialsGallery";
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
  servicesCatalog,
} from "@/copy";

export default function HomePage() {
  return (
    <>
      <Hero {...hero} />
      <LabIntro {...labIntro} />
      <DifferentialsSwitch
        heading={serviceHubHeading}
        ctaLabel={servicesCatalog.detailsLabel}
        items={services.map((service) => ({
          title: service.label,
          description: service.shortDescription,
          icon: service.icon,
          href: `/services/${service.id}`,
        }))}
      />

      <DifferentialsGallery heading={differentialsHeading} items={differentials} />

      <FeatureGrid heading={infrastructureHeading} items={infrastructure} />
      <FeatureGrid heading={equipmentHeading} items={equipment} />
      <FeatureGrid heading={sectorsHeading} items={sectors} />

      <LogoRow title={partners.title} items={partners.items} variant="default" />
    </>
  );
}
