import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from "@cem/ui";
import { vitrineCardClass } from "@/lib/vitrine-card";
import { services } from "@/data/home-content";

export default function ServicesPage() {
  return (
    <Section variant="default" className="!pt-16">
      <Container className="flex flex-col gap-16">
        <SectionHeading
          eyebrow="Catálogo"
          title="Serviços de metrologia industrial"
          description="Cada serviço possui uma página própria com aplicações e público-alvo. Escolha o que melhor atende sua necessidade ou solicite um orçamento diretamente."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className={vitrineCardClass()}>
              <CardHeader>
                <CardTitle className="font-heading text-lg font-semibold">{service.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>
              </CardContent>
              <CardFooter className="gap-3 border-t border-border pt-4">
                <Button variant="outline" size="sm" render={<Link href={`/services/${service.id}`} />}>
                  Ver detalhes
                </Button>
                <Button size="sm" render={<Link href={`/quote?service=${service.id}`} />}>
                  Solicitar orçamento
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
