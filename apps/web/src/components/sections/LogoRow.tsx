import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";

interface LogoRowProps {
  title: string;
  items: string[];
  variant?: "default" | "muted" | "surface";
}

/** Fileira de selos/logos em texto — usada tanto para Certificações quanto
 * para Parceiros. Quando houver imagens de logo reais, trocar o <span> por
 * <Image>, mantendo a mesma estrutura de grid. */
export function LogoRow({ title, items, variant = "muted" }: LogoRowProps) {
  return (
    <Section variant={variant} className="!py-16 md:!py-20">
      <Container className="flex flex-col items-center gap-10">
        <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
          {title}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {items.map((item) => (
            <span
              key={item}
              className="text-lg sm:text-xl font-semibold tracking-tight text-foreground/50 hover:text-foreground/90 transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  );
}
