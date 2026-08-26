import Link from "next/link";
import { Button } from "@cem/ui";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function NotFound() {
  return (
    <Section variant="default" className="!pt-32 md:!pt-44 !pb-20 md:!pb-28">
      <Container className="max-w-3xl">
        <Eyebrow>Página não encontrada</Eyebrow>

        <p className="mt-8 font-heading text-display-lg font-bold tracking-tight leading-[1.08] text-foreground">
          404
        </p>

        <h1 className="mt-4 font-heading text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Este endereço não está no laboratório.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          A URL não corresponde a um serviço, seção institucional ou formulário
          de orçamento. Volte à home ou fale com a equipe.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="xl" render={<Link href="/" />}>
            Voltar à home
          </Button>
          <Button size="xl" variant="outline" render={<Link href="/quote" />}>
            Solicitar orçamento
          </Button>
        </div>
      </Container>
    </Section>
  );
}
