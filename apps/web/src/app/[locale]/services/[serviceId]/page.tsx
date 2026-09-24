import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { getCatalog } from "@/copy/catalog";

interface ServicePageProps {
  params: Promise<{ locale: string; serviceId: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
  return getCatalog("pt").services.map((service) => ({ serviceId: service.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale, serviceId } = await params;
  const copy = getCatalog(locale);
  const service = copy.services.find((item) => item.id === serviceId);
  if (!service) notFound();

  const prefix = locale === "pt" ? "" : `/${locale}`;
  return {
    title: service.label,
    description: service.shortDescription,
    alternates: siteUrl ? { canonical: `${siteUrl}${prefix}/services/${service.id}` } : undefined,
  };
}

const extraGallery: Record<string, { src: string; alt: string; position?: string; machine?: string; fit?: "cover" | "contain" }[]> = {
  "controle-qualidade-dimensional": [
    {
      src: "/lab/services/duramax-close.jpeg",
      alt: "ZEISS DuraMax.",
      machine: "DuraMax",
    },
    {
      src: "/lab/services/o-inspect-lat.jpeg",
      alt: "ZEISS O-Inspect no laboratório.",
      machine: "O-Inspect",
    },
    {
      src: "/lab/services/prismo.jpeg",
      alt: "ZEISS Prismo no laboratório.",
      machine: "Prismo",
    },
  ],
  "inspecao-interna": [
    {
      src: "/lab/services/bosello-lat.jpeg",
      alt: "ZEISS BOSELLO MAX no laboratório.",
      machine: "BOSELLO MAX",
    },
  ],
  "prototipacao-3d": [
    {
      src: "/lab/services/bambu-trabalha.jpeg",
      alt: "Impressora 3D Bambu Lab A1 no laboratório.",
      // fit: "contain",
      machine: "Bambu Lab A1",
    },
    {
      src: "/lab/services/cad-print.png",
      alt: "Digitalização 3D no laboratório.",
    },
    // TODO
    // {
    //   src: "/lab/services/cad.mp4",
    //   alt: "Digitalização 3D no laboratório.",
    // },
  ],
};

const cardMachine: Record<string, string> = {
  "controle-qualidade-dimensional": "DuraMax",
  "digitalizacao-engenharia-reversa": "ATOS Q",
  "inspecao-interna": "BOSELLO MAX",
};

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { locale, serviceId } = await params;
  setRequestLocale(locale);
  const copy = getCatalog(locale);
  const service = copy.services.find((item) => item.id === serviceId);
  if (!service) notFound();

  const index = copy.services.findIndex((item) => item.id === service.id);
  const servicePath = `/services/${service.id}`;
  const machines = copy.equipment
    .filter((item) => item.href === servicePath)
    .map((item) => ({
      name: item.title.replace(/^ZEISS\s+/, ""),
      tag: item.tag,
    }));

  const images = [
    ...(service.cardImage
      ? [
          {
            src: service.cardImage,
            alt: service.cardImageAlt ?? service.label,
            fit: service.cardImageFit,
            position: service.cardImagePosition,
            machine: cardMachine[service.id],
          },
        ]
      : []),
    ...(extraGallery[service.id] ?? []),
  ];

  return (
    <ServiceDetail
      eyebrow={copy.servicesHeading.eyebrow ?? copy.serviceDetail.eyebrow}
      index={index}
      title={service.label}
      body={service.description}
      images={images}
      machines={machines}
      applications={{
        title: copy.serviceDetail.applicationsLabel,
        items: service.applications,
      }}
      audience={{
        title: copy.serviceDetail.audienceLabel,
        text: service.audience,
      }}
      equipmentLabel={copy.serviceDetail.equipmentLabel}
      cta={{
        label: copy.serviceDetail.ctaLabel,
        href: `/quote?service=${service.id}`,
      }}
      siblings={copy.services.map((item) => ({
        id: item.id,
        label: item.label,
        href: `/services/${item.id}`,
        current: item.id === service.id,
      }))}
      siblingsLabel={copy.serviceDetail.backLabel}
      catalogCta={copy.servicesCatalog.allServicesCta}
      detailsLabel={copy.servicesCatalog.detailsLabel}
      siteUrl={siteUrl}
    />
  );
}
