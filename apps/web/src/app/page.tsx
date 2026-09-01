import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { CoverGrid } from "@/components/sections/CoverGrid";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { MediaSwitch } from "@/components/sections/MediaSwitch";
import { LogoRow } from "@/components/sections/LogoRow";
import {
  differentials,
  differentialsHeading,
  equipment,
  equipmentCatalogCta,
  equipmentHeading,
  hero,
  labIntro,
  partners,
  sectors,
  sectorsHeading,
  serviceHubHeading,
  services,
  servicesCatalog,
} from "@/copy";

const serviceItems = services.map((service) => ({
  title: service.label,
  description: service.shortDescription,
  icon: service.icon,
  href: `/services/${service.id}`,
  image: service.cardImage,
  imageAlt: service.cardImageAlt,
  imageFit: service.cardImageFit,
  imagePosition: service.cardImagePosition,
}));

export default function HomePage() {
  return (
    <>
      <Hero {...hero} />
      <LabIntro {...labIntro} />
      <MediaSwitch
        heading={serviceHubHeading}
        items={serviceItems}
        zone="services"
        atmosphere="grid"
        listTrailing="service-link"
        catalogCta={servicesCatalog.allServicesCta}
      />
      <CoverGrid heading={differentialsHeading} items={differentials} />
      <MediaSwitch
        heading={equipmentHeading}
        items={equipment}
        ctaLabel="Ver serviço relacionado"
        listTrailing="number"
        catalogCta={equipmentCatalogCta}
      />
      <FeatureGrid heading={sectorsHeading} items={sectors} zone="catalog" />
      <LogoRow title={partners.title} items={partners.items} />
    </>
  );
}
