import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@cem/ui";
import { services } from "@/data/home-content";

interface ServicePageProps {
  params: { serviceId: string };
}

export function generateStaticParams() {
  return services.map((service) => ({ serviceId: service.id }));
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = services.find((s) => s.id === params.serviceId);
  if (!service) notFound();

  return (
    <Section variant="default" className="!pt-16">
      <Container className="max-w-3xl flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <Eyebrow>Serviço</Eyebrow>
          <h1 className="font-heading text-display-sm font-bold tracking-tight text-foreground leading-[1.1]">
            {service.label}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
            {service.shortDescription}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
            Aplicações
          </h2>
          <ul className="flex flex-col gap-2">
            {service.applications.map((app) => (
              <li key={app} className="flex items-center gap-3 text-foreground/80">
                <span className="w-1.5 h-1.5 bg-accent shrink-0" />
                {app}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
            Público-alvo
          </h2>
          <p className="text-foreground/80">{service.audience}</p>
        </div>

        <div className="pt-4">
          <Button size="lg" render={<Link href={`/quote?service=${service.id}`} />}>
            Solicitar orçamento para este serviço
          </Button>
        </div>
      </Container>
    </Section>
  );
}
