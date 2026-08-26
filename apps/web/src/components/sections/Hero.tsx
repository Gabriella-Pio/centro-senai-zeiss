import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@cem/ui";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CoordinateGrid } from "@/components/sections/CoordinateGrid";

export function Hero() {
  return (
    <Section variant="default" className="relative overflow-hidden !pt-32 md:!pt-44 !pb-20 md:!pb-28">
      <CoordinateGrid fade />
      <Container className="relative z-10 max-w-3xl">
        <Eyebrow>Centro de Excelência em Metrologia • SENAI Ítalo Bologna</Eyebrow>

        <h1 className="mt-8 font-heading text-display-lg font-bold tracking-tight leading-[1.08] text-foreground">
          SENAI <span className="text-primary">×</span> ZEISS
        </h1>

        <p className="mt-4 font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Precisão em cada etapa.
        </p>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Metrologia dimensional de alta precisão, engenharia reversa,
          digitalização 3D e tomografia industrial com tecnologia alemã de
          ponta.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="xl" render={<Link href="/quote" />}>
            Solicitar Orçamento
          </Button>
          <Button size="xl" variant="outline" render={<Link href="/institutional" />}>
            Conhecer o Laboratório
          </Button>
        </div>
      </Container>
    </Section>
  );
}
