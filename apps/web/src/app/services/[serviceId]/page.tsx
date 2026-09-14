import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServiceDetail } from "@/components/sections/ServiceDetail";
import { equipment } from "@/copy/equipment";
import { serviceDetail, services, servicesCatalog, servicesHeading } from "@/copy/services";

interface ServicePageProps {
  params: Promise<{ serviceId: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
  return services.map((service) => ({ serviceId: service.id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { serviceId } = await params;
  const service = services.find((item) => item.id === serviceId);
  if (!service) notFound();

  return {
    title: `${service.label} | Centro de Excelência em Metrologia SENAI ZEISS`,
    description: service.shortDescription,
    alternates: siteUrl ? { canonical: `${siteUrl}/services/${service.id}` } : undefined,
  };
}

const extraGallery: Record<string, { src: string; alt: string; position?: string; machine?: string; fit?: "cover" | "contain" }[]> = {
  "controle-qualidade-dimensional": [
    {
      src: "/lab/services/o-inspect-lat.jpeg",
      alt: "ZEISS O-Inspect no laboratório.",
      machine: "O-Inspect",
    },
    {
      src: "/lab/services/o-inspect-tela.jpeg",
      alt: "Leitura óptica no ZEISS O-Inspect.",
      machine: "O-Inspect",
    },
  ],
  "digitalizacao-engenharia-reversa": [
    {
      src: "/lab/services/digitalizacao.jpeg",
      alt: "Digitalização 3D no laboratório.",
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
      src: "/equipment/bambu-lab-a1.png",
      alt: "Impressora 3D Bambu Lab A1 no laboratório.",
      fit: "contain",
      machine: "Bambu Lab A1",
    },
  ],
};

const cardMachine: Record<string, string> = {
  "controle-qualidade-dimensional": "DuraMax",
  "digitalizacao-engenharia-reversa": "ATOS Q",
  "inspecao-interna": "BOSELLO MAX",
};

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { serviceId } = await params;
  const service = services.find((s) => s.id === serviceId);
  if (!service) notFound();

  const index = services.findIndex((item) => item.id === service.id);
  const servicePath = `/services/${service.id}`;
  const machines = equipment
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
      eyebrow={servicesHeading.eyebrow ?? serviceDetail.eyebrow}
      index={index}
      title={service.label}
      body={service.description}
      images={images}
      machines={machines}
      applications={{
        title: serviceDetail.applicationsLabel,
        items: service.applications,
      }}
      audience={{
        title: serviceDetail.audienceLabel,
        text: service.audience,
      }}
      equipmentLabel={serviceDetail.equipmentLabel}
      cta={{
        label: serviceDetail.ctaLabel,
        href: `/quote?service=${service.id}`,
      }}
      siblings={services.map((item) => ({
        id: item.id,
        label: item.label,
        href: `/services/${item.id}`,
        current: item.id === service.id,
      }))}
      siblingsLabel={serviceDetail.backLabel}
      catalogCta={servicesCatalog.allServicesCta}
      detailsLabel={servicesCatalog.detailsLabel}
      siteUrl={siteUrl}
    />
  );
}