import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/sections/ArticleDetail";
import { equipment } from "@/copy/equipment";
import { serviceDetail, services } from "@/copy/services";

interface ServicePageProps {
  params: Promise<{ serviceId: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ serviceId: service.id }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { serviceId } = await params;
  const service = services.find((s) => s.id === serviceId);
  if (!service) notFound();

  const servicePath = `/services/${service.id}`;
  const relatedEquipment = equipment.filter((item) => item.href === servicePath);

  const groups = [
    { title: serviceDetail.applicationsLabel, items: service.applications },
    ...(relatedEquipment.length > 0
      ? [
          {
            title: serviceDetail.equipmentLabel,
            items: relatedEquipment.map((item) =>
              item.tag ? `${item.title} · ${item.tag}` : item.title,
            ),
          },
        ]
      : []),
    { title: serviceDetail.audienceLabel, text: service.audience },
  ];

  return (
    <ArticleDetail
      eyebrow={serviceDetail.eyebrow}
      title={service.label}
      body={service.description}
      groups={groups}
      cta={{
        label: serviceDetail.ctaLabel,
        href: `/quote?service=${service.id}`,
      }}
    />
  );
}
