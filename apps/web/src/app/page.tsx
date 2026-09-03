import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { CoverGrid } from "@/components/sections/CoverGrid";
import { SectorGrid } from "@/components/sections/SectorGrid";
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
        sectionKey="services"
        surface="white"
        pattern="none"
        ambient="diagonal"
        listTrailing="service-link"
        catalogCta={servicesCatalog.allServicesCta}
      />
      <CoverGrid heading={differentialsHeading} items={differentials} />
      <MediaSwitch
        heading={equipmentHeading}
        items={equipment}
        sectionKey="equipment"
        surface="white"
        pattern="none"
        ambient="spotlight"
        ctaLabel="Ver serviço relacionado"
        listTrailing="number"
        catalogCta={equipmentCatalogCta}
      />
      <SectorGrid heading={sectorsHeading} items={sectors} />
      <LogoRow title={partners.title} items={partners.items} />
    </>
  );
}
