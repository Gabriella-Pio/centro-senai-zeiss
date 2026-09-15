import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { getCatalog } from "@/copy/catalog";

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = getCatalog(locale);
  return {
    title: copy.nav.servicesLabel,
    description: copy.servicesHeading.description ?? copy.siteMeta.description,
  };
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getCatalog(locale);

  return (
    <ServiceIndex
      heading={copy.servicesHeading}
      items={copy.services}
      equipment={copy.equipment}
      detailsLabel={copy.servicesCatalog.detailsLabel}
    />
  );
}
