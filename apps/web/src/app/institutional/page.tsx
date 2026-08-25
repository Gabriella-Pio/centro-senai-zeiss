import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardHeader, CardTitle, CardContent } from "@cem/ui";

const pillars = [
  {
    title: "Missão",
    description:
      "Oferecer serviços de metrologia de alta precisão que fortaleçam a competitividade da indústria brasileira.",
  },
  {
    title: "Visão",
    description:
      "Ser referência nacional em metrologia dimensional industrial, unindo tecnologia ZEISS e ensino técnico SENAI.",
  },
  {
    title: "Valores",
    description:
      "Precisão, rastreabilidade, rigor técnico e compromisso com o desenvolvimento da indústria.",
  },
];

export default function InstitutionalPage() {
  return (
    <>
      <Section variant="default" className="!pt-16">
        <Container className="flex flex-col gap-16">
          <SectionHeading
            eyebrow="Institucional"
            title="Sobre o Centro de Excelência SENAI × ZEISS"
            description="Uma parceria entre o SENAI e a ZEISS para levar metrologia industrial de padrão alemão às empresas brasileiras."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="p-2">
                <CardHeader>
                  <CardTitle className="text-base">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section variant="muted">
        <Container className="flex flex-col gap-6 max-w-3xl">
          <h2 className="text-display-sm font-bold tracking-tight text-foreground leading-[1.1]">
            Histórico
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed font-light">
            O laboratório nasceu da parceria entre o SENAI Ítalo Bologna e a
            ZEISS, unindo a estrutura de ensino técnico do SENAI ao
            equipamento de precisão da ZEISS para formar profissionais e
            atender à demanda da indústria por metrologia de alto padrão.
          </p>
        </Container>
      </Section>
    </>
  );
}
