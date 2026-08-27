import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/sections/ArticleDetail";
import { serviceDetail, services } from "@/copy";

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

  return (
    <ArticleDetail
      eyebrow={serviceDetail.eyebrow}
      title={service.label}
      body={service.description}
      groups={[
        { title: serviceDetail.applicationsLabel, items: service.applications },
        { title: serviceDetail.audienceLabel, text: service.audience },
      ]}
      cta={{
        label: serviceDetail.ctaLabel,
        href: `/quote?service=${service.id}`,
      }}
    />
  );
}
