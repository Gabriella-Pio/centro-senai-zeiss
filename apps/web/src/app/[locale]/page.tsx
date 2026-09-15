import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { LabIntro } from "@/components/sections/LabIntro";
import { DiffGrid } from "@/components/sections/DiffGrid";
import { SectorGrid } from "@/components/sections/SectorGrid";
import { EquipmentCarousel } from "@/components/sections/EquipmentCarousel";
import { MediaSwitch } from "@/components/sections/MediaSwitch";
import { LogoRow } from "@/components/sections/LogoRow";
import { getCatalog } from "@/copy/catalog";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getCatalog(locale);

  const serviceItems = copy.services.map((service) => ({
    title: service.label,
    description: service.shortDescription,
    icon: service.icon,
    href: `/services/${service.id}`,
    image: service.cardImage,
    imageAlt: service.cardImageAlt,
    imageFit: service.cardImageFit,
    imagePosition: service.cardImagePosition,
  }));

  return (
    <>
      <Hero {...copy.hero} />
      <LabIntro {...copy.labIntro} />
      <MediaSwitch
        heading={copy.serviceHubHeading}
        items={serviceItems}
        sectionKey="services"
        surface="cream"
        pattern="none"
        ambient="none"
        listTrailing="service-link"
        catalogCta={copy.servicesCatalog.allServicesCta}
      />
      <DiffGrid heading={copy.differentialsHeading} items={copy.differentials} />
      <EquipmentCarousel
        heading={copy.equipmentHeading}
        items={copy.equipment}
        catalogCta={copy.equipmentCatalogCta}
      />
      <SectorGrid
        heading={copy.sectorsHeading}
        items={copy.sectors}
        sectorsCard={copy.sectorsCard}
        services={copy.services}
      />
      <LogoRow heading={copy.partnersHeading} items={copy.partners} />
    </>
  );
}
