import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Hero() {
  return (
    <Section
      variant="default"
      className="relative overflow-hidden !pt-40 md:!pt-56 !pb-32 md:!pb-48 border-b border-border"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,87,184,0.18)_0%,transparent_65%)] pointer-events-none" />

      <Container className="text-center space-y-8 relative z-10 max-w-5xl">
        <Eyebrow>Centro de Excelência em Metrologia • SENAI Ítalo Bologna</Eyebrow>

        <h1 className="text-display-lg font-bold tracking-tight leading-[1.05] text-foreground">
          SENAI <span className="text-accent">×</span> ZEISS
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
          Metrologia dimensional de alta precisão, engenharia reversa,
          digitalização 3D e tomografia industrial com tecnologia alemã de
          ponta.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <Button size="xl" render={<Link href="/quote" />}>
            Solicitar Orçamento
          </Button>
          <Button size="xl" variant="outline" render={<Link href="/institutional" />}>
            Conhecer o Laboratório
          </Button>
        </div>
      </Container>

      {/* Espaço reservado para a animação/visualização interativa (a definir) */}
    </Section>
  );
}
