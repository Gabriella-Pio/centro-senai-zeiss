import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { DiffGrid } from "@/components/sections/DiffGrid";
import { SectorGrid } from "@/components/sections/SectorGrid";
import { EquipmentCarousel } from "@/components/sections/EquipmentCarousel";
import { MediaSwitch } from "@/components/sections/MediaSwitch";
import { LogoRow } from "@/components/sections/LogoRow";
import {
  differentials,
  differentialsHeading,
  equipment,
  equipmentHeading,
  hero,
  labIntro,
  partners,
  partnersHeading,
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
      <DiffGrid heading={differentialsHeading} items={differentials} />
      <EquipmentCarousel heading={equipmentHeading} items={equipment} />
      <SectorGrid heading={sectorsHeading} items={sectors} />
      <LogoRow heading={partnersHeading} items={partners} />
    </>
  );
}
