import Link from "next/link";
import { Aperture, Layers, Ruler, Scan, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { vitrineCardClass } from "@/lib/vitrine-card";
import { services } from "@/data/home-content";

const serviceIcons: Record<string, LucideIcon> = {
  "metrologia-dimensional": Ruler,
  "engenharia-reversa": Scan,
  "digitalizacao-3d": Aperture,
  "tomografia-industrial": Layers,
};

export function ServiceHub() {
  return (
    <Section variant="default">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Serviços"
          title="O que o laboratório mede e entrega"
          description="Cada card abre o serviço. Orçamento entra no detalhe, sem preço na vitrine."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = serviceIcons[service.id];
            return (
              <Link
                key={service.id}
                href={`/services/${service.id}`}
                className="group block rounded-(--radius) outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Card className={vitrineCardClass("h-full")}>
                  <CardHeader className="gap-3">
                    <div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
                      {Icon && <Icon size={22} strokeWidth={1.75} />}
                    </div>
                    <CardTitle className="font-heading text-lg font-semibold group-hover:text-foreground">
                      {service.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.shortDescription}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
